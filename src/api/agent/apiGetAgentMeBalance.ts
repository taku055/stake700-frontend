import { tAgent } from "@/types/tAgent";
import { instance } from "../instance";

export const apiGetAgentMeBalance = async () => {
  const res = await instance.get<tAgent>(`/agent/user/me/balance`);
  return res.data;
};
