import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_AISUPPORT_URL + "/api/v1",
  headers: {
    "x-api-key": import.meta.env.VITE_AISUPPORT_API_KEY,
  },
});

export type StartNewSupportResponse = {
  "session_id": string;
  "message": string;
  "topic": string;
};

export type StartNewSupportDto = {
  "language": string;
};

export const apiStartNewSupport = async (data: StartNewSupportDto) => {
  const res = await instance.post<StartNewSupportResponse>(`/support/new`, data);
  return res.data;
};
