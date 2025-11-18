import { instance } from "../instance";

type tUpdateUserDetailsDto = {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  country: string;
  city: string;
  address: string;
  gender: string;
};

export const apiUpdateUserDetails = async (
  data: tUpdateUserDetailsDto
) => {
  const response = await instance.patch("/profile/personal-info", data);
  return response.data;
};
