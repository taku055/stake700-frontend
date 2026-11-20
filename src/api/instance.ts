import axios from "axios";

/** API root, e.g. "https://api.example.com/v1". The build fails if the URL is missing (next.config.ts). */
export const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/v1`;

export const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    // Bypass ngrok free-tier browser warning for programmatic API calls
    "ngrok-skip-browser-warning": "true",
  },
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
