import { instance } from "../instance";

export const apiVerifyEmail = async (token: string) => {
  const res = await instance.post<{ status: boolean }>(
    `/profile/verify-email?token=${encodeURIComponent(token)}`
  );
  return res.data;
};
