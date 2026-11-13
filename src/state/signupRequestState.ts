import { signal } from "@preact/signals-react";

export const signupRequestState = signal({
  email: "",
  password: "",
  userName: "",
  referCode: "",
  firstName: "",
  lastName: "",
  middleName: "",
  birthDay: "",
  phone: "",
  referralCode: "",
});