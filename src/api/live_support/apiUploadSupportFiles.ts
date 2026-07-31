import { instance } from "../instance";

export type UploadedSupportFile = {
  url: string;
  filename: string;
  mimeType: string;
};

export const apiUploadSupportFiles = async (files: File[]) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const res = await instance.post<UploadedSupportFile[]>(
    "/live-support/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};
