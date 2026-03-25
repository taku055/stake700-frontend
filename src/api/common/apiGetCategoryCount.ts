import { instance } from "../instance";

export type tCategoryCountParam = {
  category?: string;
  custom: boolean;
  name: string;
  path: string;
  pathSegment?: string;
  count?: number;
}[];

export const apiGetCategoryCount = async (params: tCategoryCountParam) => {
  const response = await instance.post<tCategoryCountParam>(
    `${import.meta.env.VITE_BACKEND_URL}/v1/game/category-count`,
    params
  );
  return response.data;
};
