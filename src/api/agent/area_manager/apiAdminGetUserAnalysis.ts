import { eTransactionCurrency } from "@/types/tTransaction";
import { instance } from "../../instance";
import { tUserAnalysis } from "@/types/tUserAnalysis";
import queryString from "query-string";

type tParam = {
  startDate?: number;
  endDate?: number;
  currency: eTransactionCurrency;
};

export const apiAdminGetUserAnalysis = async (param: tParam) => {
  const res = await instance.get<tUserAnalysis[]>(
    `/admin/dashboard/finance/user-analysis?${queryString.stringify(param)}`
  );
  return res.data;
};
