import { instance } from "../instance";

export const apiChangePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const response = await instance.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });

  return response.data;
};
  