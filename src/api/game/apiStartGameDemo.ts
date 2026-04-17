import { instance } from "../instance";
import { tIGPGameResponse } from "./apiStartGame";

export type tStartGameDemoDto = {
  gameId: string;
  isMobile: boolean;
  language?: string;
};

export const apiStartGameDemo = async (data: tStartGameDemoDto) => {
  const res = await instance.post<tIGPGameResponse>(`/game/start-game-demo`, data);
  return res.data;
};
