/**
 * Hex secrets from env vars, tolerant of common paste mistakes in hosting
 * dashboards: a whole `.env` line (`NEXT_PUBLIC_IV="abc..."`), quotes or
 * surrounding whitespace. Returns "" when nothing usable is left.
 */
export function envHex(raw: string | undefined): string {
  const value = (raw ?? "")
    .trim()
    .replace(/^(export\s+)?[A-Z0-9_]+\s*=\s*/, "")
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2")
    .trim();
  return /^[0-9a-fA-F]*$/.test(value) ? value : "";
}
