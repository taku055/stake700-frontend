export const PROMO_ELIGIBILITIES = [
  { value: "ALL", label: "All users" },
  { value: "VIP", label: "VIP users" },
  { value: "FIRST_DEPOSIT", label: "First deposit" },
  { value: "FIRST_CRYPTO_DEPOSIT", label: "First crypto deposit" },
  { value: "SECOND_DEPOSIT", label: "Second deposit" },
  { value: "THIRD_DEPOSIT", label: "Third deposit" },
] as const;

const DEPOSIT_SEQUENCE_ELIGIBILITIES = [
  "FIRST_DEPOSIT",
  "FIRST_CRYPTO_DEPOSIT",
  "SECOND_DEPOSIT",
  "THIRD_DEPOSIT",
] as const;

export function isDepositSequenceEligibility(eligibility: string) {
  return (DEPOSIT_SEQUENCE_ELIGIBILITIES as readonly string[]).includes(
    eligibility,
  );
}

type PromoTranslator = (
  key: string,
  values?: Record<string, string>,
) => string;

const ELIGIBILITY_I18N_KEYS: Record<string, string> = {
  ALL: "eligibility_all",
  VIP: "eligibility_vip",
  FIRST_DEPOSIT: "eligibility_first_deposit",
  FIRST_CRYPTO_DEPOSIT: "eligibility_first_crypto_deposit",
  SECOND_DEPOSIT: "eligibility_second_deposit",
  THIRD_DEPOSIT: "eligibility_third_deposit",
};

export function formatEligibility(
  value?: string | null,
  t?: PromoTranslator,
) {
  const eligibility = value || "ALL";
  if (t && ELIGIBILITY_I18N_KEYS[eligibility]) {
    return t(ELIGIBILITY_I18N_KEYS[eligibility]);
  }
  if (!value || value === "ALL") return "All users";
  return (
    PROMO_ELIGIBILITIES.find((e) => e.value === value)?.label ??
    value.replace(/_/g, " ")
  );
}

export function formatVipRange(
  min?: number | null,
  max?: number | null,
  t?: PromoTranslator,
) {
  const minV = min ?? 0;
  const maxV = max ?? 0;
  if (minV <= 0 && maxV <= 0) return null;
  if (t) {
    if (minV > 0 && maxV > 0) {
      return t("vip_range_min_max", {
        min: String(minV),
        max: String(maxV),
      });
    }
    if (minV > 0) {
      return t("vip_range_min_plus", { min: String(minV) });
    }
    return t("vip_range_max_only", { max: String(maxV) });
  }
  if (minV > 0 && maxV > 0) return `VIP level ${minV}–${maxV}`;
  if (minV > 0) return `VIP level ${minV}+`;
  return `Up to VIP level ${maxV}`;
}

const PROMO_TYPE_I18N_KEYS: Record<string, string> = {
  DEPOSIT: "type_deposit",
  DEPOSIT_BONUS: "type_deposit_bonus",
  NO_DEPOSIT: "type_no_deposit",
  SIGNUP: "type_signup",
  SIGNUP_BONUS: "type_signup",
};

export function isNoDepositPromoType(type?: string | null) {
  return type === "NO_DEPOSIT";
}

export function isOneTimePromotion(p: {
  name?: string | null;
  code?: string | null;
  type?: string | null;
}) {
  const name = (p.name ?? "").trim().toLowerCase();
  const code = (p.code ?? "").trim().toUpperCase();
  return (
    name.startsWith("one-time promotion") ||
    name.includes("one-time promotion for") ||
    code.startsWith("ONE_TIME_") ||
    p.type === "MANUAL_BONUS" ||
    p.type === "ONE_TIME" ||
    p.type === "ONE_TIME_PROMO"
  );
}

/** Offers shown on the player promotions page. */
export function isPlayerVisiblePromotion(p: {
  name?: string | null;
  code?: string | null;
  type?: string | null;
}) {
  return !isNoDepositPromoType(p.type) && !isOneTimePromotion(p);
}

export function isDepositPromoType(type?: string | null) {
  return (
    type === "DEPOSIT" ||
    type === "DEPOSIT_BONUS" ||
    type === "WELCOME_BONUS"
  );
}

export function formatPromoType(type: string, t?: PromoTranslator) {
  const key = PROMO_TYPE_I18N_KEYS[type];
  if (t && key) return t(key);
  return type.replace(/_/g, " ");
}
