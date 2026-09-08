import { instance } from "../instance";
import { tToken } from "@/types/tToken";
import { BITCOIN_CHAIN_ID, TRON_CHAIN_ID } from "@/config/constants";

const ETHEREUM_CHAIN_ID = 1;

/** Player deposit/withdraw: USDT ERC, USDT TRC, BTC only. */
export function isAllowedPlayerCryptoToken(token: tToken): boolean {
  const symbol = (token.tokenSymbol || "").toUpperCase();
  const field = (token.dbField || "").toLowerCase();

  if (token.chainId === BITCOIN_CHAIN_ID) {
    return (
      symbol === "BTC" ||
      field === "btc" ||
      field === String(BITCOIN_CHAIN_ID)
    );
  }

  const isUsdt = symbol === "USDT" || field === "usdt";
  if (token.chainId === ETHEREUM_CHAIN_ID && isUsdt) return true;
  if (token.chainId === TRON_CHAIN_ID && isUsdt) return true;
  return false;
}

export const apiGetTokenList = async (chainId: number) => {
  const res = await instance.get<tToken[]>(
    `/token-price/token-list?chainId=${chainId}`
  );
  return res.data.filter(isAllowedPlayerCryptoToken);
};
