import { instance } from "../instance";

export async function apiPayWithVisa(params: any) {
  const res = await instance.post("/ereus", params);
  return res.data;
}