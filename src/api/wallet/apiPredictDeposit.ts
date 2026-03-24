import { instance } from "../instance";

export const apiPredictDeposit = async (
  chainId: number,
  tokenAddress: string,
  promoId?: string
) => {
  const res = await instance.post(`/predict-deposit`, {
    chainId,
    tokenAddress,
    promoId,
  });
  return res.data;
};
