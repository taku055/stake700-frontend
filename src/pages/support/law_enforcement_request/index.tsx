/** LawEnforcementRequestPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 */
import { FunctionalComponent, h } from "preact";
import { useMemo } from "preact/hooks";

export const BRAND_NAME = "Betalarab";

type Section = {
  title: string;
  body: string;
  bullets?: string[];
};

const LawEnforcementRequestPage: FunctionalComponent = () => {
  const sections = useMemo<Section[]>(
    () => [
      {
        title: "Overview",
        body:
          `This page explains how law enforcement and authorized government agencies can request user data from ${BRAND_NAME}. ` +
          "We review each request for validity and scope, and we disclose information only when legally required.",
      },
      {
        title: "Where to send requests",
        body:
          "Send requests from an official government or agency email address whenever possible. If you must send by another method, " +
          "include clear contact details so we can verify authenticity.",
        bullets: [
          "Email: legal@betalarab.com (replace with your legal inbox)",
          "Emergency: emergency@betalarab.com (replace with your emergency inbox)",
          "Mail: [Company Legal Address] (replace with your address)",
        ],
      },
      {
        title: "What to include",
        body: "To help us process quickly, include the following information:",
        bullets: [
          "Agency name, case number, and requestor contact details",
          "Legal process type (e.g., subpoena/court order/search warrant) and issuing jurisdiction",
          "Identifiers (username, account ID, email, phone, transaction IDs, wallet addresses, IPs, timestamps)",
          "Date range and specific data categories requested",
          "Preferred response format and any deadline stated by the legal process",
        ],
      },
      {
        title: "Types of data we may have",
        body: "Availability varies by service use and retention policy. Examples may include:",
        bullets: [
          "Basic account information (profile details, verification status)",
          "Login and security logs (IP addresses, device/session metadata)",
          "Payment and transaction records (deposits, withdrawals, chargebacks)",
          "Gameplay activity (timestamps, game/provider identifiers, results metadata)",
          "Customer support communications",
        ],
      },
      {
        title: "Emergency requests",
        body:
          "If you believe there is an imminent threat to life or serious physical harm, mark your request as an emergency and " +
          "include details supporting the emergency. We may disclose limited information when permitted by law.",
        bullets: [
          "Describe the emergency and why it is time-sensitive",
          "Provide identifying information and any relevant timestamps",
          "Include a callback number for verification",
        ],
      },
      {
        title: "International requests",
        body:
          "Requests outside our operating jurisdiction may require additional legal process (e.g., MLAT/letters rogatory) or " +
          "local legal validation. We will respond according to applicable laws.",
      },
      {
        title: "Response process",
        body: "We verify the requesting authority, review legal sufficiency, limit disclosures to what is required, and may push back on overly broad requests.",
        bullets: [
          "Verification of requestor identity and authority",
          "Legal review for validity, jurisdiction, and scope",
          "Production of responsive records (if any) in a secure manner",
          "Notice to users where required or permitted (exceptions may apply)",
        ],
      },
      {
        title: "Preservation requests",
        body: "We can preserve certain records for a limited period when we receive a valid preservation request. Preservation does not mean production.",
        bullets: [
          "Include identifiers and date range",
          "Include legal basis for preservation and the preservation period requested",
          "Follow up with formal legal process for production",
        ],
      },
      {
        title: "Cost, format, and timing",
        body:
          "We aim to respond promptly. Timing depends on request completeness, scope, and legal review. We may provide records electronically and securely. " +
          "Fees may apply where permitted by law.",
      },
      {
        title: "Important notes",
        body: "This page is for informational purposes only and does not constitute legal advice. ${BRAND_NAME} will interpret and apply this process consistent with applicable laws.",
        bullets: [
          "Do not send sensitive data about minors unless specifically required and lawful",
          "Narrow requests reduce processing time",
          "We do not provide access or “live monitoring” of user accounts",
        ],
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
                ⚖️
              </div>
              <div>
                <div class="text-base font-extrabold tracking-wide">
                  Law Enforcement Requests
                </div>
                <div class="text-sm text-zinc-400">
                  Data request guidelines for{" "}
                  <span class="font-semibold text-zinc-200">{BRAND_NAME}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <a
                href="/privacy"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                Privacy
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
              Requesting user data
            </h1>
            <p class="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              We take user privacy seriously. We disclose user information only
              in response to valid legal process or where permitted by law for
              emergency situations.
            </p>

            <div class="mt-5 grid gap-3 md:grid-cols-3">
              <QuickCard
                title="Be specific"
                text="Include identifiers, date ranges, and exact data categories."
              />
              <QuickCard
                title="Use official channels"
                text="Send from an agency email whenever possible."
              />
              <QuickCard
                title="Emergency help"
                text="Clearly mark emergencies and provide justification."
              />
            </div>
          </div>
        </section>

        {/* content */}
        <section class="grid gap-3">
          {sections.map((s) => (
            <article
              key={s.title}
              class="rounded-3xl border border-white/10 bg-zinc-900/35 p-6"
            >
              <h2 class="text-xl font-extrabold tracking-wide">{s.title}</h2>
              <p class="mt-2 text-base leading-relaxed text-zinc-300">
                {s.body}
              </p>

              {s.bullets?.length ? (
                <ul class="mt-4 space-y-2 text-base text-zinc-200">
                  {s.bullets.map((b) => (
                    <li key={b} class="flex gap-3">
                      <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400/40" />
                      <span class="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        {/* disclaimer */}
        <section class="mt-6">
          <div class="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <div class="text-base font-extrabold text-amber-200/90">
              Disclaimer
            </div>
            <div class="mt-2 text-sm leading-relaxed text-amber-200/80">
              This page is general information and does not replace legal
              advice. Processes and requirements may vary by jurisdiction.
              Replace placeholder contact details (emails/address) with your
              real legal contacts.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LawEnforcementRequestPage;

/* ---------------- small components ---------------- */

const QuickCard = ({ title, text }: { title: string; text: string }) => (
  <div class="rounded-3xl border border-white/10 bg-zinc-950/15 p-5">
    <div class="text-lg font-extrabold">{title}</div>
    <div class="mt-2 text-sm leading-relaxed text-zinc-300">{text}</div>
  </div>
);
