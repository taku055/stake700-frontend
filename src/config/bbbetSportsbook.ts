/** BBBet getIframe deep links (sidebar routes inside the sportsbook iframe). */
export const BBBET_LAUNCH_URLS = {
  horseRacing: "/sportsbook/sidebar/horse-racing-55",
  greyhound: "/sportsbook/sidebar/greyhound-58",
  harness: "/sportsbook/sidebar/harness-202",
} as const;

export type BbbetRacingKey = keyof typeof BBBET_LAUNCH_URLS;

/** Theme id from GET /game/bbbet-templates — override via VITE_BBBET_CUSTOM_THEME */
export const BBBET_CUSTOM_THEME =
  import.meta.env.VITE_BBBET_CUSTOM_THEME || "black-green-sidebar";
