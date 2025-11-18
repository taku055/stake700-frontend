import { tUser } from "@/types/tUser";
import { instance } from "../instance";
import { encrypt } from "@/helpers/encrypt";

type tRegisterRes = {
  accessToken: string;
  user: tUser;
};

type tRegisterReq = {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDay: string;
  email: string;
  password: string;
  userName: string;
  referCode: string | null;
};

export const apiRegister = async (data: tRegisterReq) => {
  const token = await encrypt(
    data.email +
      data.email.length +
      data.password +
      data.password.length +
      data.userName +
      data.userName.length +
      (import.meta.env.VITE_SITE_NAME as string).toLowerCase()
  );
  const res = await instance.post<tRegisterRes>(`/auth/signup`, {
    ...data,
    token,
  });

  return res.data;
};
