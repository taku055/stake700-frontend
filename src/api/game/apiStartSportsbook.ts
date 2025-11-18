import { instance } from "../instance";

export const apiStartSportsbook = async () => {
  const res = await instance.post<{ token: string }>(`/game/start-sportsbook`);
  return res.data;
};
