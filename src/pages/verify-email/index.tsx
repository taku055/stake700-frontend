import { useEffect, useMemo, useState } from "preact/hooks";
import axios from "axios";
import { useLocation } from "preact-iso";
import { useTranslations } from "@/context/I18nContext";
import { apiVerifyEmail } from "@/api/account/apiVerifyEmail";
import { loginOpenedState } from "@/state/loginOpenedState";
import { Link } from "@/components/common";

type Status = "loading" | "success" | "error" | "missing";

export default function VerifyEmailPage() {
  const t = useTranslations("VerifyEmailPage");
  const location = useLocation();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  const token = useMemo(() => {
    return (
      (location.query.token as string) ||
      new URLSearchParams(window.location.search).get("token") ||
      ""
    );
  }, [location.query.token]);

  useEffect(() => {
    if (!token) {
      setStatus("missing");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await apiVerifyEmail(token);
        if (!cancelled) setStatus("success");
      } catch (ex) {
        if (cancelled) return;
        setStatus("error");
        if (axios.isAxiosError(ex)) {
          const message = ex.response?.data?.message;
          setError(
            typeof message === "string" ? message : t("request_failed")
          );
        } else {
          setError(t("request_failed"));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, t]);

  const openLogin = () => {
    loginOpenedState.value = true;
    location.route("/");
  };

  return (
    <div className="w-full px-4 py-12 md:px-24 max-w-xl mx-auto">
      <div className="rounded-lg border border-white/10 bg-[var(--background-secondary)] p-6 md:p-8 text-center">
        <h1 className="text-white text-2xl font-semibold mb-4">
          {t("title")}
        </h1>

        {status === "loading" ? (
          <p className="text-white/70">{t("verifying")}</p>
        ) : null}

        {status === "missing" ? (
          <div className="space-y-4">
            <p className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-red-300">
              {t("missing_token")}
            </p>
            <Link href="/" className="text-[var(--green-color)] hover:underline">
              {t("go_home")}
            </Link>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="space-y-4">
            <p className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-red-300">
              {error || t("request_failed")}
            </p>
            <Link href="/" className="text-[var(--green-color)] hover:underline">
              {t("go_home")}
            </Link>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="space-y-4">
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
        ) : null}
      </div>
    </div>
  );
}
