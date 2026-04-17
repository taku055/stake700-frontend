import { instance } from "../instance";
import { tProvider } from "@/types/tProvider";

export const apiGetCustomCategoryProviders = async (category?: string) => {
  const res = await instance.get<tProvider[]>(
    `/game/custom-category-providers?category=${category || ""}`
  );
  return res.data.filter((p) => p.added_slot);
};
