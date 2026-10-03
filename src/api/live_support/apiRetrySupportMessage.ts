import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { instance } from "../instance";

export const apiRetrySupportMessage = async (messageId: number) => {
  const res = await instance.post<tLiveSupportMessage>(
    `/live-support/messages/${messageId}/retry`,
  );
  return res.data;
};
