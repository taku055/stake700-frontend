import { instance } from "../instance";

export type UploadedSupportFile = {
  url: string;
  filename: string;
  mimeType: string;
};

export const apiUploadSupportFiles = async (files: File[]) => {
  const formData = new FormData();
  for (const file of files) {
    // Pass filename explicitly so Nest/multer keeps the original name
    formData.append("files", file, file.name || "file");
  }

  // Do NOT set Content-Type manually — axios must add the multipart boundary.
  const res = await instance.post<UploadedSupportFile[]>(
    "/live-support/upload",
    formData,
  );
  return res.data;
};
