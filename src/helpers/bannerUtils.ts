const VALID_DAY_KEYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;

/** Day-of-week key in UTC (matches backend validDays). */
export function getDayKeyUtc(date: Date = new Date()): string {
  return VALID_DAY_KEYS[date.getUTCDay()];
}

/** Empty validDays means visible every day. */
export function isVisibleOnValidDays(
  validDays?: string[],
  date: Date = new Date(),
): boolean {
  if (!validDays?.length) return true;
  return validDays.includes(getDayKeyUtc(date));
}
