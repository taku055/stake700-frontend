import { apiStartSportsbook } from "@/api/game/apiStartSportsbook";
import Loader from "@/components/Loader";
import {
  checkTurbostarsSDKLoaded,
  getDefaultSportsbookConfig,
} from "@/config/sportsbook";
import { useTranslations } from "@/context/I18nContext";
import { currencyState } from "@/state/currencyState";
import { localeState } from "@/state/localeState";
import { loginOpenedState } from "@/state/loginOpenedState";
import { userState } from "@/state/userState";
import { useEffect, useRef, useState } from "preact/hooks";

const waitForSportsbookSDK = (): Promise<void> => {
  if (checkTurbostarsSDKLoaded()) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      waitForSportsbookSDK().then(resolve);
    }, 300);
  });
};

export default function Sportsbook({
  sportsBookPath,
}: {
  sportsBookPath?: string;
}) {
  const [initializing, setInitializing] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sportsbookAppRef = useRef<unknown>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const t = useTranslations("Sportsbook");

  useEffect(() => {
    let cancelled = false;

    initPromiseRef.current = (async () => {
      await waitForSportsbookSDK();
      if (cancelled) return;

      if (!containerRef.current) {
        setError(t("container_not_found"));
        setInitializing(false);
        return;
      }

      try {
        const sportsbookConfig = getDefaultSportsbookConfig("en", "");
        sportsbookAppRef.current = await (window as any).Sportsbook.init(
          sportsbookConfig,
        );
      } catch {
        setError(t("failed_initialize"));
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    })();

    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        try {
          const messageData = JSON.parse(event.data);
          if (
            messageData.type === "click" &&
            messageData.target === "loginButton"
          ) {
            loginOpenedState.value = true;
          }
        } catch (parseError) {
          console.error("Failed to parse message from sportsbook:", parseError);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      cancelled = true;
      window.removeEventListener("message", handleMessage);
      const app = sportsbookAppRef.current as { destroy?: () => void } | null;
      if (app?.destroy) {
        app.destroy();
      }
      sportsbookAppRef.current = null;
      initPromiseRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const initPromise = initPromiseRef.current;
      if (!initPromise) return;
      await initPromise;
      if (cancelled) return;

      const app = sportsbookAppRef.current as {
        update: (opts: { token: string; lang: string }) => unknown;
        setRoute: (path?: string) => unknown;
      } | null;
      if (!app) return;

      setSyncing(true);
      setError(null);

      try {
        let token = "";
        if (userState.value?.id) {
          try {
            const response = await apiStartSportsbook(currencyState.value.unit);
            token = response.token;
          } catch {
            setError(t("failed_sportsbook_token"));
            return;
          }
        }

        if (cancelled) return;

        app.update({
          token,
          lang: localeState.value,
        });
        app.setRoute(sportsBookPath);
      } finally {
        if (!cancelled) {
          setSyncing(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    userState.value?.id,
    localeState.value,
    currencyState.value.unit,
    sportsBookPath,
  ]);

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        style={{ background: "#1a0e08" }}
      >
        <div className="text-center">
          <div className="text-lg mb-2" style={{ color: "#f0a830" }}>
            Error
          </div>
          <div style={{ color: "#C3A59B" }}>{error}</div>
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded text-white font-semibold transition hover:opacity-90"
              style={{
                background: "linear-gradient(145deg, #f5c842, #c87a10)",
                boxShadow: "0 0 16px #f0a83033",
              }}
            >
              {t("reload_page")}
            </button>
            {error.includes("Failed to get sportsbook access") && (
              <button
                onClick={() => {
                  setError(null);
                }}
                className="px-4 py-2 rounded text-white font-semibold transition hover:opacity-90"
                style={{
                  background: "rgba(194,126,49,0.25)",
                  border: "1px solid #f0a83066",
                  color: "#f0d080",
                }}
              >
                {t("retry")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const showOverlay = initializing || syncing;

  return (
    <div className="w-full bg-[var(--background)]">
      {showOverlay && (
        <div className="w-full flex items-center justify-center md:h-[calc(var(--viewport-height)-167px)] h-[calc(var(--viewport-height)-117px)] min-h-[500px]">
          <div className="text-center gap-4 flex flex-col items-center">
            <Loader />
            {initializing ? t("initializing") : t("updating")}
          </div>
        </div>
      )}

      <div
        id="sportsbook-placeholder"
        ref={containerRef}
        className="w-full"
        style={{
          minHeight: showOverlay ? "600px" : "auto",
          display: showOverlay ? "none" : "block",
        }}
      />
    </div>
  );
}
