import { instance } from "../instance";
import { tProvider } from "@/types/tProvider";

export const apiGetProviders = async (category?: "SLOT" | "LIVECASINO" | "SPORT") => {
  const res = await instance.get<tProvider[]>(
    `/game/providers?category=${category || ""}`
  );
  return res.data.filter((p) => p.added_slot);
};
