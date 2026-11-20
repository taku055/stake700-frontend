import { API_BASE, instance } from "../instance";

export const apiChangeAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await fetch(
    `${API_BASE}/auth/change-avatar`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization:
          instance.defaults.headers["Authorization"]?.toString() || "",
        "ngrok-skip-browser-warning": "true",
      },
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.text();
};
