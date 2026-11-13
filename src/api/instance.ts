import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/v1",
  headers: {
    // Bypass ngrok free-tier browser warning for programmatic API calls
    "ngrok-skip-browser-warning": "true",
  },
});

export const setAxiosAuthToken = (token: string | null | undefined) => {
  console.log("backend url", process.env.NEXT_PUBLIC_BACKEND_URL);
  if (token) {
    instance.defaults.headers["Authorization"] = `Bearer ${token}`;
    window.localStorage.setItem("access_token", token);
  } else {
    delete instance.defaults.headers["Authorization"];
    window.localStorage.removeItem("access_token");
  }
};
