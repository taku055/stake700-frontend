import { bonusAvailabilityState } from "@/state/bonusAvailabilityState";

export function isBonusAvailableForGame(game: {
  providerId?: string;
  gameType?: string;
}): boolean {
  const { defaultLivecasino, defaultSlot, settings } =
    bonusAvailabilityState.value;
  const gameType = (game.gameType || "SLOT").toUpperCase();
  if (gameType === "SPORT") {
    return false;
  }
  const row = game.providerId ? settings[game.providerId] : undefined;
  if (gameType === "LIVECASINO") {
    return row?.livecasino ?? defaultLivecasino;
  }
  return row?.slot ?? defaultSlot;
}
