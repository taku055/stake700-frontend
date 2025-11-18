import { instance } from "../instance";

export const apiLazyWithdraw = async (
  chainId: number,
  address: string,
  cash: number,
) => {
  const res = await instance.post(`/wallet/lazy-withdraw`, {
    cash,
    chainId,
    address,
  });
  return res.data;
};
