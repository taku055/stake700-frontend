/** AMLPolicyPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 *
 * NOTE: Replace placeholders (company name/entity, contact emails, jurisdictions, retention periods)
 * with your real details and have counsel/MLRO review before publishing.
 */
import { FunctionalComponent, h } from "preact";
import { useMemo } from "preact/hooks";

export const BRAND_NAME = "Betalarab";

type Section = { title: string; body: string; bullets?: string[] };

const AMLPolicyPage: FunctionalComponent = () => {
  const sections = useMemo<Section[]>(
    () => [
      {
        title: "Purpose",
        body:
          `${BRAND_NAME} is committed to preventing money laundering, terrorist financing, and other financial crime. ` +
          "This Anti–Money Laundering (AML) Policy describes the controls we use to identify and mitigate risk.",
      },
      {
        title: "Scope",
        body:
          "This policy applies to users, transactions (deposits/withdrawals), payments, promotions, and internal operations. " +
          "Where local law is stricter than this policy, we follow local law.",
      },
      {
        title: "Our approach",
        body: "We use a risk-based approach, meaning we apply stronger checks to higher-risk customers and activity.",
        bullets: [
          "Customer due diligence (CDD) and identity verification",
          "Ongoing monitoring of accounts and transactions",
          "Enhanced due diligence (EDD) where required",
          "Recordkeeping and reporting where legally required",
        ],
      },
      {
        title: "Customer due diligence (CDD)",
        body: "We may verify identity and eligibility before allowing certain activity (especially withdrawals). Verification helps us protect users and comply with AML rules.",
        bullets: [
          "Identity: government ID (where required)",
          "Address: proof of address (where required)",
          "Age/eligibility: checks to prevent underage or restricted access",
          "Source of funds/wealth: requested for higher-risk cases or large volumes",
        ],
      },
      {
        title: "Enhanced due diligence (EDD)",
        body: "We may apply enhanced checks if risk is elevated (for example: unusual transaction patterns, high-value activity, high-risk jurisdictions, or adverse media signals).",
        bullets: [
          "Additional verification documents",
          "Source of funds / source of wealth information",
          "Additional review and approval steps before withdrawals",
        ],
      },
      {
        title: "Prohibited activity",
        body: "Examples of activity we may restrict, suspend, or report (where required) include:",
        bullets: [
          "Using someone else’s payment method or identity",
          "Structuring deposits/withdrawals to avoid checks",
          "Rapid in/out movement of funds with minimal gameplay",
          "Suspicious third-party transfers or coordinated accounts",
          "Chargeback abuse or suspected fraud",
        ],
      },
      {
        title: "Transaction monitoring",
        body: "We monitor transactions and behavior for unusual patterns. Monitoring may include automated and manual review.",
        bullets: [
          "Deposit/withdrawal velocity and frequency",
          "Multiple accounts, shared devices, or linked payment instruments",
          "Unusual gameplay patterns combined with cash movements",
          "Country/IP/device inconsistencies",
        ],
      },
      {
        title: "Sanctions and restricted jurisdictions",
        body: "We may screen customers and activity against sanctions lists and may restrict access from certain countries/regions. Availability depends on applicable law and licensing.",
        bullets: [
          "Sanctions screening (where required)",
          "Geo/IP checks and residency controls",
          "Blocking or limiting transactions involving restricted regions",
        ],
      },
      {
        title: "Reporting and cooperation with authorities",
        body:
          "Where required by law, we may file reports of suspicious activity and comply with valid requests from law enforcement or regulators. " +
          "We aim to protect user privacy and disclose information only when legally required.",
      },
      {
        title: "Account actions we may take",
        body: "To manage risk and comply with AML requirements, we may take actions such as:",
        bullets: [
          "Requesting additional verification or information",
          "Delaying, limiting, or rejecting withdrawals pending review",
          "Restricting deposits or payment methods",
          "Suspending or closing accounts in line with Terms and applicable law",
          "Confiscating bonuses or winnings where fraud/abuse is proven and permitted by law (per Terms)",
        ],
      },
      {
        title: "Recordkeeping",
        body: "We maintain records related to identity verification, transactions, and investigations for the period required by law and our retention policy.",
        bullets: [
          "Verification records (KYC) and related communications",
          "Transaction records and payment confirmations",
          "Account and security logs relevant to compliance",
          "Retention period: [X years] (replace with your requirement)",
        ],
      },
      {
        title: "User responsibilities",
        body: "To keep the platform safe, users must provide accurate information and use only payment methods they are authorized to use.",
        bullets: [
          "Keep account details up to date",
          "Do not share accounts or payment methods",
          "Respond to verification requests promptly",
          "Play fairly and follow Terms",
        ],
      },
      {
        title: "Contact",
        body: "For AML or compliance questions, contact our compliance team (replace with your real contact details).",
        bullets: [
          "Compliance email: compliance@betalarab.com",
          "MLRO contact: mlro@betalarab.com",
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
                🧾
              </div>
              <div>
                <div class="text-base font-extrabold tracking-wide">
                  AML Policy
                </div>
                <div class="text-sm text-zinc-400">
                  Anti–Money Laundering policy for{" "}
                  <span class="font-semibold text-zinc-200">{BRAND_NAME}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <a
                href="/terms"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                Terms
              </a>
              <a
                href="/privacy"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                Privacy
              </a>
              <a
                href="/law-enforcement-request"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold hover:bg-zinc-900/70"
              >
                Law enforcement
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
              Anti–Money Laundering (AML) Policy
            </h1>
            <p class="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
              We use a risk-based program to help detect and prevent money
              laundering and other financial crime. We may request verification
              or additional information to meet legal and licensing obligations.
            </p>

            <div class="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div class="text-base font-extrabold text-amber-200/90">
                Important
              </div>
              <div class="mt-1 text-sm leading-relaxed text-amber-200/80">
                This policy is general information. Replace placeholders
                (emails, retention period, effective date) and have your
                compliance team or legal counsel review before publishing.
              </div>
            </div>
          </div>
        </section>

        {/* sections */}
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

        {/* contact block */}
        <section class="mt-6">
          <div class="rounded-3xl border border-white/10 bg-zinc-900/35 p-6">
            <div class="text-xl font-extrabold tracking-wide">
              Compliance contacts (replace)
            </div>
            <div class="mt-2 text-base leading-relaxed text-zinc-300">
              Compliance:{" "}
              <span class="font-extrabold text-zinc-100">
                compliance@betalarab.com
              </span>
            </div>
            <div class="mt-1 text-base leading-relaxed text-zinc-300">
              MLRO:{" "}
              <span class="font-extrabold text-zinc-100">mlro@betalarab.com</span>
            </div>
            <div class="mt-1 text-sm text-zinc-400">
              Tip: Use addresses under your domain and keep them consistent
              across policies.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AMLPolicyPage;
