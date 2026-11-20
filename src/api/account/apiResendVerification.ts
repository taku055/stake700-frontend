import { instance } from "../instance";

export const apiResendVerification = async (email: string) => {
  const res = await instance.post<{ success: boolean }>(
    `/auth/resend-verification`,
    { email }
  );
  return res.data;
};
