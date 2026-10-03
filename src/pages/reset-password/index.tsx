import { useCallback, useMemo, useState } from "preact/hooks";
import axios from "axios";
import { useLocation } from "preact-iso";
import { useTranslations } from "@/context/I18nContext";
import { apiResetPassword } from "@/api/account/apiResetPassword";
import { Input } from "@/components/common";
import { loginOpenedState } from "@/state/loginOpenedState";
import { forgotOpenedState } from "@/state/forgotOpenedState";

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPasswordPage");
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = useMemo(() => {
    return (
      (location.query.token as string) ||
      new URLSearchParams(window.location.search).get("token") ||
      ""
    );
  }, [location.query.token]);

  const onSubmit = useCallback(
    async (e: Event) => {
      e.preventDefault();
      if (loading || !token) return;
      if (!password.trim()) {
        setError(t("password_required"));
        return;
      }

      setLoading(true);
      setError("");
      try {
        await apiResetPassword(token, password);
        setSuccess(true);
      } catch (ex) {
        if (axios.isAxiosError(ex)) {
          const message = ex.response?.data?.message as string | undefined;
          if (message === "token.not-found") setError(t("token_not_found"));
          else if (message === "token.expired") setError(t("token_expired"));
          else setError(t("request_failed"));
        } else {
          setError(t("request_failed"));
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, password, t, token]
  );

  const openLogin = () => {
    loginOpenedState.value = true;
    location.route("/");
  };

  const openForgot = () => {
    forgotOpenedState.value = true;
    location.route("/");
  };

  return (
    <div className="w-full px-4 py-12 md:px-24 max-w-xl mx-auto">
      <div className="rounded-lg border border-white/10 bg-[var(--background-secondary)] p-6 md:p-8">
        <h1 className="text-white text-2xl font-semibold mb-2 text-center">
          {t("title")}
        </h1>
        <p className="text-white/70 text-sm text-center mb-6">
          {t("description")}
        </p>

        {!token ? (
          <div className="space-y-4 text-center">
            <p className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-red-300">
              {t("missing_token")}
            </p>
            <button
              type="button"
              onClick={openForgot}
              className="text-[var(--green-color)] hover:underline"
            >
              {t("request_new_link")}
            </button>
          </div>
        ) : success ? (
          <div className="space-y-4 text-center">
            <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-300">
              {t("success_message")}
            </p>
            <button
              type="button"
              onClick={openLogin}
              className="w-full rounded-lg bg-[var(--green-color)] px-6 py-3 font-semibold text-white hover:opacity-90"
            >
              {t("login_now")}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              label={t("password_label")}
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full rounded-lg bg-[var(--green-color)] px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? t("submitting") : t("submit")}
            </button>
            {error ? (
              <p className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-center text-red-300">
                {error}
              </p>
            ) : null}
            <div className="text-center">
              <button
                type="button"
                onClick={openForgot}
                className="text-sm text-[var(--green-color)] hover:underline"
              >
                {t("request_new_link")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
