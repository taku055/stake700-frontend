import { SITE_KEY } from "@/config/site";
import { instance } from "../instance";
import { encrypt } from "@/helpers/encrypt";

// Sign-up no longer logs the user in — they must confirm their email first.
type tRegisterRes = {
  success: boolean;
  email: string;
  emailSent: boolean;
};

type tRegisterReq = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthDay?: string;
  email: string;
  password: string;
  userName: string;
  referCode: string | null;
  phone?: string;
};

export const apiRegister = async (data: tRegisterReq) => {
  const token = await encrypt(
    data.email +
      data.email.length +
      data.password +
      data.password.length +
      data.userName +
      data.userName.length +
      SITE_KEY
  );
  const res = await instance.post<tRegisterRes>(`/auth/signup`, {
    ...data,
    token,
  });

  return res.data;
};
