import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_AISUPPORT_URL + "/api/v1",
  headers: {
    "x-api-key": import.meta.env.VITE_AISUPPORT_API_KEY,
  },
});

export type GetSupportMessageDto = {
  prompt: string;
  session_id: string;
};

export type GetSupportMessageResponse = {
  "ai": string;
  "topic": string;
};

export const apiGetSupportMessage = async (dto: GetSupportMessageDto) => {
  const res = await instance.post<GetSupportMessageResponse>(`/support/live`, dto);
  return res.data;
};
