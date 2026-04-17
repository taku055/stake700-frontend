import { tGame } from "@/types/tGame";
import { instance } from "../instance";

export const apiGetGameById = async (id: string) => {
  const res = await instance.get<tGame>(`/game/${id}`);
  return res.data;
};
