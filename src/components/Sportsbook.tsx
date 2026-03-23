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
<<<<<<< HEAD

      setUpdating(true);
      while (initializing) {
        await sleep(1000);
      }
      await sleep(500);

      if (sportsbookApp) {
        const res = sportsbookApp.update({
          token: sportsbookToken,
          lang: localeState.value,
        });
      }

      await sleep(500);
      setUpdating(false);
    })();
  }, [userState.value?.id, localeState.value, currencyState.value.unit]);

  useEffect(() => {
    (async () => {
      console.log("sportsBookPath", sportsBookPath);

      setUpdating(true);
      while (initializing) {
        await sleep(1000);
      }
      await sleep(500);

      if (sportsbookApp) {
        const res = sportsbookApp.setRoute(sportsBookPath);
      }

      await sleep(500);
      setUpdating(false);
    })();
  }, [sportsBookPath]);

  // Handle postMessage events for login/deposit
  useEffect(() => {
    (async () => {
      setInitializingState(true);
      initializing = true;

      // Fetch token upfront so sportsbook initializes already authenticated
      let initialToken = "";
      if (userState.value?.id) {
        try {
          const response = await apiStartSportsbook(currencyState.value.unit);
          initialToken = response.token;
        } catch (ex) {
          setError(t("failed_sportsbook_token"));
        }
      }

      // Gets sportsbook config
      const sportsbookConfig = getDefaultSportsbookConfig(localeState.value, initialToken);

      // Initialize the sportsbook when SDK is ready
      const initializeSportsbook = async () => {
        if (!containerRef.current) {
          setError(t("container_not_found"));
          setInitializingState(false);
          initializing = false;
          return;
        }

        // Initialize the sportsbook application
        try {
          sportsbookApp = await (window as any).Sportsbook.init(
            sportsbookConfig,
          );
        } catch (ex) {
          setError(t("failed_initialize"));
        }

        setInitializingState(false);
        initializing = false;
      };

      // Wait for SDK to load and then initialize
      const waitForSDK = async () => {
        if (checkTurbostarsSDKLoaded()) {
          await initializeSportsbook();
        } else {
          // Check again after a short delay
          setTimeout(waitForSDK, 300);
        }
      };

      // Start waiting for SDK
      waitForSDK();
=======
>>>>>>> 561a52da9167b576dee0ae0faf141231065959ac
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
<<<<<<< HEAD
      if (sportsbookApp) {
        sportsbookApp.destroy();
        sportsbookApp = null;
=======
      const app = sportsbookAppRef.current as { destroy?: () => void } | null;
      if (app?.destroy) {
        app.destroy();
>>>>>>> 561a52da9167b576dee0ae0faf141231065959ac
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t("reload_page")}
            </button>
            {error.includes("Failed to get sportsbook access") && (
              <button
                onClick={() => {
                  setError(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
