/** ResponsibleGamblingPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 */
import { FunctionalComponent, h } from "preact";
import { useMemo, useState } from "preact/hooks";

export const BRAND_NAME = "Vistabet777";

type ToolCard = {
  id: string;
  title: string;
  desc: string;
  points: string[];
  ctaLabel: string;
  onCta: () => void;
};

type Faq = { q: string; a: string };

const ResponsibleGamblingPage: FunctionalComponent = () => {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const tools = useMemo<ToolCard[]>(
    () => [
      {
        id: "deposit-limits",
        title: "Deposit limits",
        desc: "Set a cap on how much you can deposit over a given period.",
        points: [
          "Choose daily / weekly / monthly limits",
          "Helps keep spending predictable",
          "Changes may take effect after a cooling-off period (policy-dependent)",
        ],
        ctaLabel: "Set deposit limits",
        onCta: () => alert("Open deposit limits settings…"),
      },
      {
        id: "loss-limits",
        title: "Loss limits",
        desc: "Limit how much you can lose within a time window.",
        points: [
          "Useful if you tend to chase losses",
          "Works alongside deposit limits",
          "Can be adjusted responsibly as needed",
        ],
        ctaLabel: "Set loss limits",
        onCta: () => alert("Open loss limits settings…"),
      },
      {
        id: "session-timer",
        title: "Session timer",
        desc: "Get reminders to take breaks while playing.",
        points: [
          "Time-based reminders",
          "Encourages breaks",
          "Helps you stay aware of play time",
        ],
        ctaLabel: "Enable timer",
        onCta: () => alert("Enable session timer…"),
      },
      {
        id: "cooling-off",
        title: "Cooling-off",
        desc: "Take a short break from gambling for a fixed period.",
        points: [
          "24 hours to several weeks",
          "Account access restricted during period",
          "Instant step to reset habits",
        ],
        ctaLabel: "Start cooling-off",
        onCta: () => alert("Start cooling-off period…"),
      },
      {
        id: "self-exclusion",
        title: "Self-exclusion",
        desc: "Block access for a longer period if you need stronger protection.",
        points: [
          "Months to years (jurisdiction-dependent)",
          "Prevents gambling during the exclusion window",
          "Support team can help if you’re unsure what to choose",
        ],
        ctaLabel: "Self-exclude",
        onCta: () => alert("Open self-exclusion flow…"),
      },
      {
        id: "reality-check",
        title: "Reality check",
        desc: "Regular pop-ups showing time spent and net results.",
        points: [
          "Promotes informed decisions",
          "Helps stop ‘autopilot’ play",
          "Custom interval reminders",
        ],
        ctaLabel: "Turn on reality checks",
        onCta: () => alert("Enable reality checks…"),
      },
    ],
    []
  );

  const faqs = useMemo<Faq[]>(
    () => [
      {
        q: "What is responsible gambling?",
        a:
          "Responsible gambling means playing for entertainment, within affordable limits, and taking steps to prevent harm. " +
          "It includes setting boundaries, taking breaks, and asking for help early if gambling stops feeling fun.",
      },
      {
        q: "How do I know if gambling is becoming a problem?",
        a:
          "Warning signs can include chasing losses, hiding gambling, borrowing money to play, feeling anxious or irritable when not gambling, " +
          "or spending more time/money than intended. If any of these sound familiar, consider using limits or taking a break and contacting support.",
      },
      {
        q: "Can I reverse a self-exclusion or cooling-off period?",
        a:
          "In many jurisdictions, self-exclusion is not reversible until the period ends. Cooling-off may also be non-reversible once started. " +
          "Exact rules depend on your region and operator policy—choose the option that best supports your wellbeing.",
      },
      {
        q: "Do limits guarantee I won’t lose money?",
        a: "No. Limits are tools to help you control time and spending, but gambling always involves risk. Only play with money you can afford to lose.",
      },
      {
        q: "What if I’m worried about someone else?",
        a:
          "If you’re concerned about a friend or family member, encourage them to take a break and seek professional help. " +
          "You can also share support resources and suggest they enable limits or self-exclusion.",
      },
    ],
    []
  );

  const toggleFaq = (idx: number) => setOpen((p) => ({ ...p, [idx]: !p[idx] }));

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background glow */}
      <div class="pointer-events-none fixed inset-0 -z-10">
        <div class="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />
        <div class="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* Header */}
      <header class="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 text-zinc-950 font-black shadow-lg shadow-violet-500/10">
              ♥
            </div>
            <div>
              <div class="text-base font-extrabold tracking-wide">
                Responsible Gambling
              </div>
              <div class="text-sm text-zinc-400">
                Safer play tools and support for{" "}
                <span class="font-semibold text-zinc-200">{BRAND_NAME}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <a
              href="#tools"
              class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
            >
              Safer play tools
            </a>
            <a
              href="#self-check"
              class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
            >
              Self-check
            </a>
            <a
              href="#support"
              class="inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:brightness-110"
            >
              Get support
            </a>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 pb-12">
        {/* Hero */}
        <section class="py-6">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/40 p-6 shadow-2xl shadow-black/40">
            <div class="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-center">
              <div>
                <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Play for fun. Stay in control.
                </h1>
                <p class="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
                  Gambling should be entertainment—not a way to make money or
                  cope with stress. {BRAND_NAME} offers tools to help you set
                  limits, take breaks, and get support when you need it.
                </p>

                <div class="mt-5 flex flex-wrap gap-2">
                  <a
                    href="#tools"
                    class="inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-base font-extrabold text-zinc-950 shadow-lg shadow-violet-500/15 hover:brightness-110"
                  >
                    Explore safer play tools
                  </a>
                  <a
                    href="#support"
                    class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-base font-extrabold hover:bg-zinc-900/70"
                  >
                    Find support resources
                  </a>
                </div>

                <div class="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-base text-amber-200/90">
                  <div class="font-extrabold">Important note</div>
                  <div class="mt-1 text-sm leading-relaxed text-amber-200/80">
                    If you feel at risk of harm, consider starting a cooling-off
                    period or self-exclusion and contacting professional
                    support.
                  </div>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <InfoCard
                  title="Set limits"
                  text="Control spending and time with deposit, loss, and session limits."
                />
                <InfoCard
                  title="Take breaks"
                  text="Use cooling-off or self-exclusion when you need space."
                />
                <InfoCard
                  title="Get support"
                  text="Access resources for confidential help anytime."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" class="py-4">
          <div class="mb-3">
            <h2 class="text-lg font-extrabold tracking-wide">
              Safer play tools
            </h2>
            <p class="mt-1 text-sm leading-relaxed text-zinc-400">
              These controls can be offered in your account settings. Some
              availability depends on your region.
            </p>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            {tools.map((t) => (
              <div
                key={t.id}
                class="rounded-3xl border border-white/10 bg-zinc-900/35 p-5"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-base font-extrabold">{t.title}</div>
                    <div class="mt-1 text-sm leading-relaxed text-zinc-400">
                      {t.desc}
                    </div>
                  </div>
                  <span class="rounded-full border border-white/10 bg-zinc-950/20 px-3 py-1 text-xs text-zinc-400">
                    Account
                  </span>
                </div>

                <ul class="mt-4 space-y-2">
                  {t.points.map((p) => (
                    <li
                      key={p}
                      class="flex gap-2 text-sm leading-relaxed text-zinc-300"
                    >
                      <span class="mt-[2px] h-4 w-4 shrink-0 rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/20" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={t.onCta}
                  class="mt-5 inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:brightness-110"
                >
                  {t.ctaLabel}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Self-check */}
        <section id="self-check" class="py-8">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/55 to-zinc-900/25 p-6">
            <h2 class="text-lg font-extrabold tracking-wide">
              Quick self-check
            </h2>
            <p class="mt-1 text-sm leading-relaxed text-zinc-400">
              If you answer “yes” to any of these often, consider using limits
              or taking a break.
            </p>

            <div class="mt-5 grid gap-3 md:grid-cols-2">
              <CheckItem text="Do I gamble longer than I planned?" />
              <CheckItem text="Do I chase losses to try to win back money?" />
              <CheckItem text="Do I hide my gambling or feel guilty about it?" />
              <CheckItem text="Has gambling affected my mood, sleep, work, or relationships?" />
              <CheckItem text="Do I gamble with money I can’t afford to lose?" />
              <CheckItem text="Do I feel stressed or restless when I can’t gamble?" />
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <a
                href="#support"
                class="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:brightness-110"
              >
                I want help
              </a>
              <a
                href="#tools"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                Set limits now
              </a>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section class="py-2">
          <div class="mb-3">
            <h2 class="text-lg font-extrabold tracking-wide">FAQs</h2>
            <p class="mt-1 text-sm leading-relaxed text-zinc-400">
              Common questions about safer gambling and controls.
            </p>
          </div>

          <div class="flex flex-col gap-2">
            {faqs.map((f, idx) => {
              const isOpen = !!open[idx];
              return (
                <div
                  key={idx}
                  class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/30"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-violet-500/5"
                  >
                    <span class="text-base font-extrabold">{f.q}</span>
                    <span class="text-zinc-400" aria-hidden="true">
                      {isOpen ? "▾" : "▸"}
                    </span>
                  </button>
                  {isOpen ? (
                    <div class="px-4 pb-4 text-base leading-relaxed text-zinc-400">
                      {f.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* Support */}
        <section id="support" class="py-8">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/65 to-zinc-900/30 p-6">
            <h2 class="text-lg font-extrabold tracking-wide">Get support</h2>
            <p class="mt-1 text-sm leading-relaxed text-zinc-400">
              If gambling is causing harm, reach out. Support is confidential.
              You can also contact {BRAND_NAME} support to activate limits or
              self-exclusion.
            </p>

            <div class="mt-5 grid gap-3 lg:grid-cols-3">
              <SupportCard
                title="Contact site support"
                desc="Help with limits, account access, and safer play tools."
                actionLabel="Chat with support"
                onAction={() => alert("Open support chat…")}
                hint="Don’t share your password."
              />
              <SupportCard
                title="Professional help (recommended)"
                desc="Talk to a qualified counselor or local support service."
                actionLabel="Find local resources"
                onAction={() => alert("Open resources directory…")}
                hint="Replace with jurisdiction-specific links."
              />
              <SupportCard
                title="Concerned about someone else?"
                desc="Encourage them to pause and seek help. Share this page and resources."
                actionLabel="Share resources"
                onAction={() =>
                  navigator
                    ?.share?.({
                      title: "Responsible Gambling",
                      text: "Support resources",
                    })
                    .catch(() => alert("Copy/share…"))
                }
                hint="You’re not alone."
              />
            </div>

            <div class="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
              <div class="text-base font-extrabold text-rose-200/90">
                Urgent safety
              </div>
              <div class="mt-1 text-sm leading-relaxed text-rose-200/80">
                If you’re in immediate danger or feel unsafe, contact local
                emergency services right away.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResponsibleGamblingPage;

/* ---------- Small components ---------- */

const InfoCard = ({ title, text }: { title: string; text: string }) => (
  <div class="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
    <div class="text-base font-extrabold">{title}</div>
    <div class="mt-1 text-sm leading-relaxed text-zinc-400">{text}</div>
  </div>
);

const CheckItem = ({ text }: { text: string }) => (
  <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
    <div class="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/20" />
    <div class="text-sm leading-relaxed text-zinc-200">{text}</div>
  </div>
);

const SupportCard = ({
  title,
  desc,
  actionLabel,
  onAction,
  hint,
}: {
  title: string;
  desc: string;
  actionLabel: string;
  onAction: () => void;
  hint?: string;
}) => (
  <div class="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
    <div class="text-base font-extrabold">{title}</div>
    <div class="mt-1 text-sm leading-relaxed text-zinc-400">{desc}</div>
    <button
      type="button"
      onClick={onAction}
      class="mt-3 inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 hover:brightness-110"
    >
      {actionLabel}
    </button>
    {hint ? <div class="mt-2 text-xs text-zinc-500">{hint}</div> : null}
  </div>
);
