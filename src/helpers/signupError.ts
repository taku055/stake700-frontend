import axios from "axios";

/**
 * What to tell a player whose sign-up failed. Returns a `ToastMessages` key
 * (`{ key }`) or a server-provided sentence (`{ text }`). Shared by both
 * sign-up forms so neither falls back to a bare "Something went wrong".
 */
export function signupError(ex: unknown): { key: string } | { text: string } {
  if (!axios.isAxiosError(ex)) {
    // Failed before the request was sent (e.g. sign-up keys not configured)
    return { key: "error.signup_unavailable" };
  }
  if (!ex.response) return { key: "error.signup_network" };

  const message = (ex.response.data as { message?: unknown } | undefined)?.message;
  const code = typeof message === "string" ? message : "";
  if (code === "user.already-exist") return { key: "error.email_taken" };
  if (code === "username.error") return { key: "error.signup_username" };
  if (code === "token.error") return { key: "error.signup_check_failed" };
  // Field validation from the server (e.g. "email must be an email")
  if (Array.isArray(message) && message.length) return { text: String(message[0]) };
  if (ex.response.status === 400) return { key: "error.email_taken" };
  return { key: "error.signup_server" };
}
