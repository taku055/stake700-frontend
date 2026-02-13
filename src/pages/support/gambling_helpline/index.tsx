/** GamblingHelplinePage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Bigger font sizing + simpler content
 * Brand name is a variable: BRAND_NAME
 */
import { FunctionalComponent, h } from "preact";
import { useMemo } from "preact/hooks";

export const BRAND_NAME = "Betalarab";

type Helpline = {
  region: string;
  name: string;
  phone?: string;
  text?: string;
  websiteLabel?: string;
  websiteHref?: string; // put your real URL here
  hours?: string;
};

const GamblingHelplinePage: FunctionalComponent = () => {
  const helplines = useMemo<Helpline[]>(
    () => [
      {
        region: "United States",
        name: "National Problem Gambling Helpline (NCPG)",
        phone: "1-800-GAMBLER",
        text: "Text: 800GAM",
        websiteLabel: "Visit help site",
        websiteHref: "https://www.ncpgambling.org/help-treatment/",
        hours: "24/7 (availability may vary by state)",
      },
      {
        region: "United Kingdom",
        name: "GamCare",
        phone: "0808 8020 133",
        websiteLabel: "Visit help site",
        websiteHref: "https://www.gamcare.org.uk/",
        hours: "24/7",
      },
      {
        region: "Canada",
        name: "Canada gambling help (provincial services)",
        websiteLabel: "Find provincial resources",
        websiteHref: "https://www.problemgambling.ca/",
        hours: "Varies by province",
      },
      {
        region: "Australia",
        name: "Gambling Help Online",
        phone: "1800 858 858",
        websiteLabel: "Visit help site",
        websiteHref: "https://www.gamblinghelponline.org.au/",
        hours: "24/7",
      },
      {
        region: "New Zealand",
        name: "Gambling Helpline NZ",
        phone: "0800 654 655",
        websiteLabel: "Visit help site",
        websiteHref: "https://gamblinghelpline.co.nz/",
        hours: "24/7",
      },
      {
        region: "International",
        name: "Find local support",
        websiteLabel: "Search international resources",
        websiteHref: "https://www.gamblersanonymous.org/",
        hours: "Varies by location",
      },
    ],
    []
  );

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      {/* background glow */}
      <div class="pointer-events-none fixed inset-0 -z-10">
        <div class="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />
        <div class="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* header */}
      <header class="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div class="mx-auto max-w-6xl px-4 py-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 text-zinc-950 text-xl font-black shadow-lg shadow-violet-500/10">
                ☎
              </div>
              <div>
                <div class="text-base font-extrabold tracking-wide">
                  Gambling Helplines
                </div>
                <div class="text-sm text-zinc-400">
                  Confidential help for{" "}
                  <span class="font-semibold text-zinc-200">{BRAND_NAME}</span>{" "}
                  players
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <a
                href="/responsible-gaming"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                Responsible Gaming
              </a>
              <a
                href="/help"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 pb-12">
        {/* hero */}
        <section class="py-7">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/35 p-6 shadow-2xl shadow-black/40">
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Need help with gambling?
            </h1>
            <p class="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              You’re not alone. Free, confidential support is available. If you
              feel out of control, please contact a helpline below or talk to
              someone you trust.
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <a
                href="#list"
                class="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-base font-extrabold text-zinc-950 hover:brightness-110"
              >
                View helplines
              </a>
              <a
                href="/responsible-gaming"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-5 py-3 text-base font-extrabold hover:bg-zinc-900/70"
              >
                Safer play tools
              </a>
            </div>

            <div class="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
              <div class="text-base font-extrabold text-rose-200/90">
                Emergency
              </div>
              <div class="mt-1 text-sm leading-relaxed text-rose-200/80">
                If you are in immediate danger or feel unsafe, contact local
                emergency services right now.
              </div>
            </div>
          </div>
        </section>

        {/* list */}
        <section id="list" class="py-3">
          <div class="mb-3">
            <h2 class="text-xl font-extrabold tracking-wide">
              Helplines by region
            </h2>
            <p class="mt-1 text-base leading-relaxed text-zinc-300">
              Choose a service in your country/region. Links below go to
              external websites.
            </p>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            {helplines.map((hLine) => (
              <div
                key={`${hLine.region}-${hLine.name}`}
                class="rounded-3xl border border-white/10 bg-zinc-900/35 p-5"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-sm font-extrabold text-zinc-400">
                      {hLine.region}
                    </div>
                    <div class="mt-1 text-lg font-extrabold">{hLine.name}</div>
                  </div>
                  <span class="rounded-full border border-white/10 bg-zinc-950/20 px-3 py-1 text-xs text-zinc-400">
                    Confidential
                  </span>
                </div>

                <div class="mt-4 space-y-2 text-base text-zinc-200">
                  {hLine.phone ? (
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-zinc-400">Phone:</span>
                      <a
                        class="font-extrabold hover:underline"
                        href={`tel:${normalizeTel(hLine.phone)}`}
                      >
                        {hLine.phone}
                      </a>
                    </div>
                  ) : null}

                  {hLine.text ? (
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-zinc-400">Text:</span>
                      <span class="font-semibold">{hLine.text}</span>
                    </div>
                  ) : null}

                  {hLine.hours ? (
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-zinc-400">Hours:</span>
                      <span class="font-semibold">{hLine.hours}</span>
                    </div>
                  ) : null}
                </div>

                {hLine.websiteHref ? (
                  <a
                    class="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-base font-extrabold text-zinc-950 hover:brightness-110"
                    href={hLine.websiteHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {hLine.websiteLabel || "Visit website"}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* simple steps */}
        <section class="py-8">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/55 to-zinc-900/25 p-6">
            <h2 class="text-xl font-extrabold tracking-wide">3 quick steps</h2>

            <div class="mt-4 grid gap-3 md:grid-cols-3">
              <StepCard
                num="1"
                title="Pause"
                text="Take a break. Close the game. Breathe."
              />
              <StepCard
                num="2"
                title="Reach out"
                text="Call or chat with a helpline (confidential)."
              />
              <StepCard
                num="3"
                title="Protect yourself"
                text="Use limits or self-exclusion in your account."
              />
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <a
                href="/responsible-gaming"
                class="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-base font-extrabold text-zinc-950 hover:brightness-110"
              >
                Open safer play tools
              </a>
              <a
                href="/help"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-5 py-3 text-base font-extrabold hover:bg-zinc-900/70"
              >
                Contact support
              </a>
            </div>

            <div class="mt-4 text-sm text-zinc-400">
              Tip: If you’re worried about your spending, consider setting a
              deposit limit today.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GamblingHelplinePage;

/* ---------------- helpers ---------------- */

const StepCard = ({
  num,
  title,
  text,
}: {
  num: string;
  title: string;
  text: string;
}) => (
  <div class="rounded-3xl border border-white/10 bg-zinc-950/20 p-5">
    <div class="flex items-center gap-3">
      <div class="grid h-10 w-10 place-items-center rounded-2xl bg-violet-500 text-zinc-950 text-lg font-black">
        {num}
      </div>
      <div class="text-lg font-extrabold">{title}</div>
    </div>
    <div class="mt-3 text-base leading-relaxed text-zinc-300">{text}</div>
  </div>
);

function normalizeTel(input: string): string {
  // Keep digits and leading +
  const trimmed = input.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  const digits = trimmed.replace(/[^\d]/g, "");
  return plus + digits;
}
