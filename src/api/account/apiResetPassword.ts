import { instance } from "../instance";

/** `true` from older servers; newer ones name the account that was changed. */
export type tResetPasswordRes = boolean | { success: boolean; userName?: string; email?: string };

export const apiResetPassword = async (hash: string, password: string) => {
  const res = await instance.post<tResetPasswordRes>(`/auth/reset-password`, {
    hash,
    password,
  });

  return res.data;
};
