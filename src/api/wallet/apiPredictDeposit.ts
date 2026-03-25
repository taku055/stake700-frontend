import { instance } from "../instance";

export const apiPredictDeposit = async (
  chainId: number,
  tokenAddress: string,
  promoId?: string,
) => {
  const promoFromUrl = (() => {
    if (typeof window === "undefined") return undefined;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("promotionId") ??
      params.get("promo") ??
      params.get("bonusId") ??
      undefined
    );
  })();
  const resolvedPromoId = promoId ?? promoFromUrl;

  const res = await instance.post(`/predict-deposit`, {
    chainId,
    tokenAddress,
    promoId: resolvedPromoId,
  });
  return res.data;
};
