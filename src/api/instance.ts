import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/v1",
});

export const setAxiosAuthToken = (token: string | null | undefined) => {
  if (token) {
    instance.defaults.headers["Authorization"] = `Bearer ${token}`;
    window.localStorage.setItem("access_token", token);
  } else {
    delete instance.defaults.headers["Authorization"];
    window.localStorage.removeItem("access_token");
  }
};
