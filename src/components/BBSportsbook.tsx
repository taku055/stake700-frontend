import { useEffect, useState } from "preact/hooks";
import { userState } from "@/state/userState";
import { currencyState } from "@/state/currencyState";
import { localeState } from "@/state/localeState";
import { apiGetBBBetUrl } from "@/api/bbbet/apiGetGameUrl";
import { BBBET_CUSTOM_THEME } from "@/config/bbbetSportsbook";

type BBSportsbookProps = {
  /** BBBet sidebar deep link, e.g. /sportsbook/sidebar/horse-racing-55 */
  launchUrl?: string;
  customTheme?: string;
};

export default function BBSportsbook({
  launchUrl,
  customTheme = BBBET_CUSTOM_THEME,
}: BBSportsbookProps) {
  const [gameUrl, setGameUrl] = useState("");
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAuthReady(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;

    (async () => {
      setGameUrl("");
      try {
        const data = await apiGetBBBetUrl(!userState.value?.id, {
          currency: currencyState.value?.unit || "TRY",
          language: localeState.value || "en",
          launchUrl,
          customTheme,
        });
        if (!cancelled) {
          setGameUrl(data?.iframeUrl ?? "");
        }
      } catch (error) {
        console.error("Failed to start BBBet sportsbook:", error);
        if (!cancelled) {
          setGameUrl("");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    authReady,
    userState.value?.id,
    currencyState.value?.unit,
    localeState.value,
    launchUrl,
    customTheme,
  ]);

  if (!gameUrl) {
    return (
      <div className="w-full min-h-[500px] flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(var(--viewport-height)-60px-126px)] lg:h-[calc(var(--viewport-height)-60px-54px)] relative flex justify-center items-center overflow-hidden rounded-xl lg:mt-3">
      <iframe
        src={gameUrl}
        title="BBBET Sportsbook"
        className="w-full h-full border-0"
        allow="fullscreen"
      />
    </div>
  );
}
