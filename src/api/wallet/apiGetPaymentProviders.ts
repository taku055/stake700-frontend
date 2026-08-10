import { instance } from "../instance";

export type tFineraPaymentMethod = "card" | "googlepay" | "applepay";
export type tFineraWithdrawMethod = "card" | "card_ref" | "bank";

export type tPaymentProviderPublicConfig = {
  depositPageUrl?: string;
  withdrawPageUrl?: string;
  methods_enabled?: Record<tFineraPaymentMethod, boolean>;
  withdraw_methods_enabled?: Record<tFineraWithdrawMethod, boolean>;
  features_enabled?: {
    deposits?: boolean;
    withdrawals?: boolean;
  };
  mode?: "test" | "live";
};

export type tPaymentProviderPublic = {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
  currency: string;
  min_amount: number;
  max_amount: number;
  logo?: string | null;
  config: tPaymentProviderPublicConfig;
};

export type tPaymentProvidersResponse = {
  count: number;
  providers: tPaymentProviderPublic[];
  from: number;
  limit: number;
};

export function isFineraProviderCode(code: string) {
  return code === "Finera";
}

export async function apiGetPaymentProviders() {
  const res = await instance.get<tPaymentProvidersResponse>(
    "/payment/providers?from=0&limit=50",
  );
  return res.data;
}

export function getFineraProvider(providers: tPaymentProviderPublic[]) {
  return providers.find((p) => isFineraProviderCode(p.code));
}

export function getEnabledFineraDepositMethods(
  provider: tPaymentProviderPublic | undefined,
): tFineraPaymentMethod[] {
  if (!provider?.enabled) return [];
  if (provider.config?.features_enabled?.deposits === false) return [];

  const methods = provider.config?.methods_enabled;
  const all: tFineraPaymentMethod[] = ["card", "googlepay", "applepay"];
  return all.filter((method) => methods?.[method] !== false);
}

export function getEnabledFineraWithdrawMethods(
  provider: tPaymentProviderPublic | undefined,
): tFineraWithdrawMethod[] {
  if (!provider?.enabled) return [];
  if (provider.config?.features_enabled?.withdrawals === false) return [];

  const methods = provider.config?.withdraw_methods_enabled;
  const all: tFineraWithdrawMethod[] = ["card", "card_ref", "bank"];
  return all.filter((method) => methods?.[method] === true);
}
