import { bonusAvailabilityState } from "@/state/bonusAvailabilityState";

export function isBonusAvailableForGame(game: {
  providerId?: string;
  gameType?: string;
}): boolean {
  const { defaultLivecasino, defaultSlot, defaultSport, settings } =
    bonusAvailabilityState.value;
  const gameType = game.gameType?.toUpperCase();
  const row = game.providerId ? settings[game.providerId] : undefined;

  if (gameType === "SPORT") {
    return false;
  }
  if (gameType === "LIVECASINO") {
    return row?.livecasino ?? defaultLivecasino;
  }
  if (gameType === "SLOT") {
    return row?.slot ?? defaultSlot;
  }

  if (!row) {
    return defaultSlot;
  }
  return row.slot && row.livecasino;
}
