import { instance } from "../instance";

export const apiCloseSupport = async () => {
  const res = await instance.post<{ ok: boolean; status: string }>(
    "/live-support/close",
  );
  return res.data;
};
