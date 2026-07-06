import type { tUser } from "@/types/tUser";

export type EpayclubProfileField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "country";

export function getEpayclubProfileMissing(
  user: tUser | null | undefined,
): EpayclubProfileField[] {
  if (!user) {
    return ["firstName", "lastName", "email", "phone", "country"];
  }

  const missing: EpayclubProfileField[] = [];
  if (!user.firstName?.trim()) missing.push("firstName");
  if (!user.lastName?.trim()) missing.push("lastName");
  if (!user.email?.trim()) missing.push("email");
  if (!user.phone?.trim()) missing.push("phone");
  if (!user.country?.trim()) missing.push("country");
  return missing;
}

export function isEpayclubProfileComplete(user: tUser | null | undefined) {
  return getEpayclubProfileMissing(user).length === 0;
}
