import { instance } from "../instance";
import { eTransactionCurrency } from "@/types/tTransaction";

export type tStartGameDto = {
  gameId: string;
  isMobile: boolean;
  language?: string;
  currency: eTransactionCurrency;
};

export type tIGPGameResponse = {
  url: string;
  iframe: string;
  sessionId: string;
  width: string;
  vertical: string;
  withoutFrame: string;
  rewriterule: string;
  localhost: string;
  exitButton_mobile: string;
  exitButton: string;
  disableReload: string;
  wager: string;
  bonus: string;
};

export const apiStartGame = async (data: tStartGameDto) => {
  const res = await instance.post<tIGPGameResponse | string>(`/game/start-game`, data);
  return res.data;
};
