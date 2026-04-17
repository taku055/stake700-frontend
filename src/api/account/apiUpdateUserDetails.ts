import { instance } from "../instance";
import { tUser } from "@/types/tUser";

type tUpdateUserDetailsDto = {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  country: string;
  city: string;
  address: string;
  gender: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
};

export const apiUpdateUserDetails = async (
  data: tUpdateUserDetailsDto
) => {
  const response = await instance.patch<tUser>("/profile/personal-info", data);
  return response.data;
};
