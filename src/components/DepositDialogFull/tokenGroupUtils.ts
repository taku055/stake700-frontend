import type { tToken } from "@/types/tToken";

export function buildTokenGroups(tokens: tToken[]): Record<string, tToken[]> {
  return tokens
    .filter((token) => token.chainId !== 0)
    .reduce(
      (acc, token) => {
        if (!acc[token.tokenSymbol]) {
          acc[token.tokenSymbol] = [];
        }
        acc[token.tokenSymbol].push(token);
        return acc;
      },
      {} as Record<string, tToken[]>,
    );
}

/** USDT first, USDC second, remaining symbols A–Z. */
function tokenSymbolSortRank(symbol: string): number {
  if (symbol === "USDT") return 0;
  if (symbol === "USDC") return 1;
  return 2;
}

export function sortTokenSymbols(symbols: string[]): string[] {
  return [...symbols].sort((a, b) => {
    const ra = tokenSymbolSortRank(a);
    const rb = tokenSymbolSortRank(b);
    if (ra !== rb) return ra - rb;
    return a.localeCompare(b);
  });
}

/** Default currency when the token list loads (first chain in group if present). */
export const DEFAULT_CRYPTO_SELECTION_SYMBOL = "USDT";

export function getPreferredDefaultCryptoSymbol(
  sortedSymbols: string[],
  tokenGroups: Record<string, tToken[]>,
): string | undefined {
  if (sortedSymbols.length === 0) return undefined;
  const sym = DEFAULT_CRYPTO_SELECTION_SYMBOL;
  if (sortedSymbols.includes(sym) && tokenGroups[sym]?.length) return sym;
  return sortedSymbols[0];
}
