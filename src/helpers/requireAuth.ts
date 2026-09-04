import { loginOpenedState } from "@/state/loginOpenedState";
import { userState } from "@/state/userState";

export function isLoggedIn(): boolean {
  return Boolean(userState.value?.id);
}

/** Opens the login modal when the user is not authenticated. Returns true if logged in. */
export function requireLogin(): boolean {
  if (isLoggedIn()) return true;
  loginOpenedState.value = true;
  return false;
}
