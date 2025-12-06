import { tAgent } from "@/types/tAgent";
import { instance } from "../../instance";

export const apiAdminCreateSubagent = async (
  areaManagerId: string,
  name: string,
  password: string
) => {
  const res = await instance.post<tAgent>(
    `/admin/area-manager/create-subagent`,
    {
      name,
      password,
      areaManagerId,
    }
  );
  return res.data;
};
