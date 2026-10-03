import { bonusAvailabilityState } from "@/state/bonusAvailabilityState";

function looksLikeLiveCasino(gameType?: string, name?: string): boolean {
  if (gameType === "LIVECASINO") {
    return true;
  }
  if (gameType === "SPORT") {
    return false;
  }
  const value = (name || "").toLowerCase();
  if (!value) {
    return false;
  }
  return (
    value.includes("first person") ||
    value.includes("roulette") ||
    value.includes("blackjack") ||
    value.includes("baccarat") ||
    value.includes("crazy time") ||
    value.includes("dream catcher") ||
    value.endsWith(" live") ||
    value.includes(" live ")
  );
}

export function isBonusAvailableForGame(game: {
  providerId?: string;
  gameType?: string;
  name?: string;
}): boolean {
  const { defaultSlot, settings } = bonusAvailabilityState.value;
  const gameType = game.gameType?.toUpperCase();
  const row = game.providerId ? settings[game.providerId] : undefined;

  if (gameType === "SPORT") {
    return false;
  }
  if (looksLikeLiveCasino(gameType, game.name)) {
    return row?.livecasino ?? false;
  }
  if (gameType === "SLOT") {
    return row?.slot ?? defaultSlot;
  }

  if (!row) {
    return false;
  }
  return row.slot && row.livecasino;
}
