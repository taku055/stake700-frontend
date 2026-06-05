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

export function formatEligibility(value?: string | null) {
  if (!value || value === "ALL") return "All users";
  return (
    PROMO_ELIGIBILITIES.find((e) => e.value === value)?.label ??
    value.replace(/_/g, " ")
  );
}

export function formatVipRange(min?: number | null, max?: number | null) {
  const minV = min ?? 0;
  const maxV = max ?? 0;
  if (minV <= 0 && maxV <= 0) return null;
  if (minV > 0 && maxV > 0) return `VIP level ${minV}–${maxV}`;
  if (minV > 0) return `VIP level ${minV}+`;
  return `Up to VIP level ${maxV}`;
}
