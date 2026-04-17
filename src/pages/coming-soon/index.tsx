import { OFFICIAL_LINKS } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import { useEffect, useMemo, useState } from "preact/hooks";

// If you're using Preact, make sure your tsconfig has:
// "jsxImportSource": "preact",
// and your bundler is set up for Preact (e.g., Vite's preact plugin).
// TailwindCSS is optional but recommended for styles used below.

export type ComingSoonProps = {
  /** Display name of your product or brand */
  productName?: string;
  /** Target launch date/time (local time). Omit for no countdown */
  launchDate?: Date;
  /** Optional callback when a user submits an email */
  onNotify?: (email: string) => Promise<void> | void;
  /** Optional hero illustration/img URL */
  heroUrl?: string;
};

/**
 * A polished, accessible Coming Soon page for Preact + TypeScript.
 * - Responsive layout
 * - Optional live countdown (set `launchDate`)
 * - Email notify form with validation
 * - Keyboard & screen-reader friendly
 * - Tailwind styling (feel free to swap for your own CSS)
 */
export default function ComingSoon({
  productName = "Your Product",
  launchDate,
  onNotify,
  heroUrl,
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const t = useTranslations("ComingSoon");
  const [error, setError] = useState<string | null>(null);

  // Countdown state
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!launchDate) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [launchDate]);

  const remaining = useMemo(() => {
    if (!launchDate) return null;
    const totalMs = launchDate.getTime() - now.getTime();
    const clamped = Math.max(0, totalMs);

    const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
    const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((clamped / (1000 * 60)) % 60);
    const seconds = Math.floor((clamped / 1000) % 60);

    return { totalMs: clamped, days, hours, minutes, seconds };
  }, [launchDate, now]);

  function validateEmail(val: string) {
    // Simple RFC5322-like check; replace with your own as needed
    return /\S+@\S+\.\S+/.test(val);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("submitting");
      if (onNotify) {
        await onNotify(email);
      } else {
        // You can replace this with a real request:
        await new Promise((r) => setTimeout(r, 800));
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-[var(--background)] text-slate-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        {/* Card */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
          {/* Glow */}
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-fuchsia-400/20 blur-2xl" />

          <div className="relative grid gap-8 p-8 md:p-12 md:grid-cols-5">
            {/* Left (content) */}
            <div className="md:col-span-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium tracking-wide text-slate-200">
                <DotPulse />
                {t("Coming soon")}
              </span>

              <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                {productName}
              </h1>
              <p className="mt-3 max-w-prose text-slate-300">
                {t("coming_soon_description")}
              </p>

              {/* Countdown */}
              {remaining && (
                <div className="mt-6" aria-live="polite">
                  <h2 className="sr-only">Countdown to launch</h2>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    <TimeBox label="Days" value={remaining.days} />
                    <TimeBox label="Hours" value={remaining.hours} />
                    <TimeBox label="Minutes" value={remaining.minutes} />
                    <TimeBox label="Seconds" value={remaining.seconds} />
                  </div>
                  {remaining.totalMs === 0 && (
                    <p className="mt-2 text-sm text-emerald-300">We’re live!</p>
                  )}
                </div>
              )}

              {/* Email form */}
              <form onSubmit={handleSubmit} className="mt-8" noValidate>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative grow">
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      placeholder="Enter your email"
                      required
                      aria-invalid={!!error}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none ring-0 focus:border-sky-400/50"
                    />
                    {error && (
                      <p className="mt-2 text-sm text-rose-300" role="alert">
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="rounded-xl bg-sky-500/90 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none disabled:opacity-60"
                  >
                    {status === "submitting" ? t("Submitting") : t("Notify me")}
                  </button>
                </div>
                {status === "success" && (
                  <p
                    className="mt-3 text-sm text-emerald-300"
                    aria-live="polite"
                  >
                    Thanks! We’ll be in touch.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-3 text-sm text-rose-300" aria-live="polite">
                    {error}
                  </p>
                )}
              </form>

              {/* Social proof / links */}
              <ul className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-300/90">
                <li>
                  <a
                    href={OFFICIAL_LINKS.twitter}
                    aria-label="Follow us on X / Twitter"
                    className="underline-offset-4 hover:underline"
                  >
                    X / Twitter
                  </a>
                </li>
                <li>•</li>
                <li>
                  <a
                    href={OFFICIAL_LINKS.facebook}
                    aria-label="Follow us on Facebook"
                    className="underline-offset-4 hover:underline"
                  >
                    Facebook
                  </a>
                </li>
                <li>•</li>
                <li>
                  <a
                    href={"mailto:" + OFFICIAL_LINKS.supportEmail}
                    aria-label="Email support"
                    className="underline-offset-4 hover:underline"
                  >
                    {OFFICIAL_LINKS.supportEmail}
                  </a>
                </li>
              </ul>
            </div>

            {/* Right (art) */}
            <div className="md:col-span-2 flex items-center justify-center">
              {heroUrl ? (
                <img
                  src={heroUrl}
                  alt="Illustration"
                  className="max-h-64 w-auto rounded-xl border border-white/10 bg-white/5 p-2"
                  loading="lazy"
                />
              ) : (
                <HeroShape />
              )}
            </div>
          </div>
        </section>

        <footer className="mx-auto mt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} {productName}. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
      <div className="text-2xl font-extrabold tabular-nums">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-slate-300">
        {label}
      </div>
    </div>
  );
}

function HeroShape() {
  return (
    <svg
      className="h-48 w-48 md:h-56 md:w-56"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abstract brand shape"
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M52.3,-59.1C65.8,-49.5,73.3,-32.3,76.9,-14.7C80.6,2.9,80.5,21,72.8,36.2C65.1,51.4,49.8,63.7,33.1,69.3C16.4,75,-1.7,74.1,-18.9,68.5C-36.2,62.9,-52.6,52.7,-62.7,38.1C-72.7,23.5,-76.4,4.6,-72.3,-11.1C-68.1,-26.7,-56.1,-38.9,-42.1,-48.4C-28.1,-57.9,-14.1,-64.7,2.2,-67.4C18.5,-70.1,37,-68.8,52.3,-59.1Z"
        transform="translate(100 100)"
        fill="url(#g1)"
      />
    </svg>
  );
}

function DotPulse() {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-2 w-2 items-center justify-center"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
    </span>
  );
}
