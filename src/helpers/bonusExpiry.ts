export function getExpiresInMs(bonusExpiresAt: string | null | undefined): number {
  if (!bonusExpiresAt) return 0;
  const diff = new Date(bonusExpiresAt).getTime() - Date.now();
  return Number.isFinite(diff) ? diff : 0;
}

export function isBonusExpired(bonusExpiresAt: string | null | undefined): boolean {
  return getExpiresInMs(bonusExpiresAt) <= 0 && !!bonusExpiresAt;
}

export function isBonusExpiryUrgent(
  bonusExpiresAt: string | null | undefined,
  urgentHours = 1,
): boolean {
  const ms = getExpiresInMs(bonusExpiresAt);
  return ms > 0 && ms <= urgentHours * 60 * 60 * 1000;
}

export type BonusExpiryCountdownLabels = {
  expired: string;
  days_hours_left: string;
  hours_mins_left: string;
  mins_secs_left: string;
  secs_left: string;
};

export const DEFAULT_BONUS_EXPIRY_LABELS: BonusExpiryCountdownLabels = {
  expired: "Expired",
  days_hours_left: "{days}d {hours}h left",
  hours_mins_left: "{hours}h {mins}m left",
  mins_secs_left: "{mins}m {secs}s left",
  secs_left: "{secs}s left",
};

function applyCountdownTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}

/** Human-readable countdown, e.g. "2d 5h left" or "Expired". */
export function formatExpiryCountdown(
  bonusExpiresAt: string | null | undefined,
  labels: BonusExpiryCountdownLabels = DEFAULT_BONUS_EXPIRY_LABELS,
): string | null {
  if (!bonusExpiresAt) return null;
  const diff = getExpiresInMs(bonusExpiresAt);
  if (diff <= 0) return labels.expired;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (days > 0) {
    return applyCountdownTemplate(labels.days_hours_left, { days, hours });
  }
  if (hours > 0) {
    return applyCountdownTemplate(labels.hours_mins_left, { hours, mins });
  }
  if (mins > 0) {
    return applyCountdownTemplate(labels.mins_secs_left, { mins, secs });
  }
  return applyCountdownTemplate(labels.secs_left, { secs });
}

export function formatExpiryDateTime(bonusExpiresAt: string | null | undefined): string {
  if (!bonusExpiresAt) return "";
  try {
    return new Date(bonusExpiresAt).toLocaleString();
  } catch {
    return bonusExpiresAt;
  }
}
