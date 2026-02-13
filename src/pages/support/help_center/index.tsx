/** HelpCenterPage.tsx
 * Preact + TypeScript + TailwindCSS (dark theme)
 * Brand name is a variable: BRAND_NAME
 */
import { FunctionalComponent, h } from "preact";
import { useMemo, useState } from "preact/hooks";
import { BRAND_NAME, HELP_CATEGORY_DATA, HelpArticle } from "./data";

const HelpCenterPage: FunctionalComponent = () => {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const q = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!q) return HELP_CATEGORY_DATA;

    const matches = (a: HelpArticle) => {
      const inTitle = a.title.toLowerCase().includes(q);
      const inBody = a.body.toLowerCase().includes(q);
      const inTags = (a.tags || []).some((t) => t.toLowerCase().includes(q));
      return inTitle || inBody || inTags;
    };

    return HELP_CATEGORY_DATA.map((c) => ({
      ...c,
      articles: c.articles.filter(matches),
    })).filter((c) => c.articles.length > 0);
  }, [q]);

  const activeCategory = useMemo(() => {
    if (!activeCategoryId) return null;
    return filteredCategories.find((c) => c.id === activeCategoryId) || null;
  }, [filteredCategories, activeCategoryId]);

  const visibleCategories = useMemo(() => {
    if (activeCategory) return [activeCategory];
    return filteredCategories;
  }, [filteredCategories, activeCategory]);

  const toggle = (id: string) => setOpenIds((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background glow */}
      <div class="pointer-events-none fixed inset-0 -z-10">
        <div class="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-violet-500/15 blur-3xl" />
        <div class="absolute right-[-10%] top-[5%] h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* Sticky header */}
      <header class="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 text-zinc-950 font-black shadow-lg shadow-violet-500/10">
              ♠
            </div>
            <div>
              <div class="text-sm font-extrabold tracking-wide">
                Help Center
              </div>
              <div class="text-xs text-zinc-400">
                Support and answers for{" "}
                <span class="font-semibold text-zinc-200">{BRAND_NAME}</span>
              </div>
            </div>
          </div>

          <div
            class="flex w-full items-center gap-2 sm:w-[520px]"
            role="search"
          >
            <label class="sr-only" for="hc-search">
              Search help articles
            </label>
            <input
              id="hc-search"
              type="search"
              value={query}
              onInput={(e) =>
                setQuery((e.currentTarget as HTMLInputElement).value)
              }
              placeholder="Search: withdrawals, bonus, verification…"
              class="w-full rounded-full border border-white/10 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/15"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                class="rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-900/70"
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 pb-10">
        {/* Hero */}
        <section class="py-5">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-900/40 p-5 shadow-2xl shadow-black/40">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:justify-between">
              <div class="flex-1">
                <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  How can we help?
                </h1>
                <p class="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                  Browse common topics below or search for a specific question.
                  If you still need help, contact support.
                </p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <a
                    href="#contact"
                    class="inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-sm font-extrabold text-zinc-950 shadow-lg shadow-violet-500/15 hover:brightness-110"
                  >
                    Contact support
                  </a>
                  <a
                    href="/faq"
                    class="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm font-extrabold text-zinc-100 hover:bg-zinc-900/70"
                  >
                    View FAQs
                  </a>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
                <Stat title="24/7" label="Chat support" />
                <Stat title="Safe" label="Secure payments" />
                <Stat title="Fast" label="Quick answers" />
              </div>
            </div>
          </div>
        </section>

        {/* Content grid */}
        <section class="grid gap-4 lg:grid-cols-[380px_1fr]">
          {/* Left: categories */}
          <aside>
            <div class="mb-3">
              <h2 class="text-base font-extrabold tracking-wide">Topics</h2>
              <p class="mt-1 text-xs leading-relaxed text-zinc-400">
                Pick a category to narrow down answers.
              </p>
            </div>

            <div class="flex flex-col gap-2">
              {filteredCategories.map((c) => {
                const selected = c.id === activeCategoryId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      setActiveCategoryId((prev) =>
                        prev === c.id ? null : c.id
                      )
                    }
                    aria-pressed={selected}
                    class={
                      "w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 " +
                      (selected
                        ? "border-violet-400/60 bg-zinc-900/70 ring-4 ring-violet-500/10"
                        : "border-white/10 bg-zinc-900/40 hover:border-violet-400/30 hover:bg-zinc-900/60")
                    }
                  >
                    <div class="flex items-start gap-3">
                      <div class="grid h-10 w-10 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                        <span aria-hidden="true">{c.icon}</span>
                      </div>

                      <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-3">
                          <div class="truncate text-sm font-extrabold">
                            {c.title}
                          </div>
                          <span class="shrink-0 rounded-full border border-white/10 bg-zinc-950/30 px-2.5 py-0.5 text-xs text-zinc-400">
                            {c.articles.length}
                          </span>
                        </div>
                        <div class="mt-1 text-xs leading-relaxed text-zinc-400">
                          {c.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredCategories.length === 0 ? (
                <div class="rounded-3xl border border-dashed border-white/15 bg-zinc-900/30 p-4">
                  <div class="text-sm font-extrabold">No results</div>
                  <div class="mt-1 text-xs leading-relaxed text-zinc-400">
                    Try a different search term (e.g., “KYC”, “bonus”,
                    “withdrawal”).
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          {/* Right: FAQ */}
          <section>
            <div class="mb-3" id="faq">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h2 class="text-base font-extrabold tracking-wide">
                  {activeCategory ? activeCategory.title : "Top answers"}
                </h2>
                {activeCategoryId ? (
                  <button
                    type="button"
                    onClick={() => setActiveCategoryId(null)}
                    class="rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2 text-xs font-extrabold hover:bg-zinc-900/70"
                  >
                    Show all topics
                  </button>
                ) : null}
              </div>
              <p class="mt-1 text-xs leading-relaxed text-zinc-400">
                {q
                  ? `Showing results for “${query.trim()}”.`
                  : "Popular questions and detailed articles."}
              </p>
            </div>

            <div class="flex flex-col gap-3">
              {visibleCategories.map((c) => (
                <div
                  key={c.id}
                  class="rounded-3xl border border-white/10 bg-zinc-900/30 p-4"
                >
                  {!activeCategory ? (
                    <div class="mb-3 flex items-center gap-2">
                      <div class="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-zinc-950/20">
                        <span aria-hidden="true">{c.icon}</span>
                      </div>
                      <div class="text-sm font-extrabold">{c.title}</div>
                    </div>
                  ) : null}

                  <div class="flex flex-col gap-2">
                    {c.articles.map((a) => {
                      const open = !!openIds[a.id];
                      return (
                        <div
                          key={a.id}
                          class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/20"
                        >
                          <button
                            type="button"
                            onClick={() => toggle(a.id)}
                            aria-expanded={open}
                            aria-controls={`article-${a.id}`}
                            class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-violet-500/5"
                          >
                            <span class="text-sm font-extrabold">
                              {a.title}
                            </span>
                            <span class="text-zinc-400" aria-hidden="true">
                              {open ? "▾" : "▸"}
                            </span>
                          </button>

                          {open ? (
                            <div
                              id={`article-${a.id}`}
                              role="region"
                              class="px-4 pb-4"
                            >
                              <p class="text-sm leading-relaxed text-zinc-400">
                                {a.body}
                              </p>

                              {a.tags?.length ? (
                                <div
                                  class="mt-3 flex flex-wrap gap-2"
                                  aria-label="Article tags"
                                >
                                  {a.tags.map((t) => (
                                    <span
                                      key={t}
                                      class="rounded-full border border-white/10 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <section id="contact" class="mt-4">
              <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 p-5">
                <h2 class="text-base font-extrabold tracking-wide">
                  Still need help?
                </h2>
                <p class="mt-1 text-xs leading-relaxed text-zinc-400">
                  Our team can assist with account issues, transactions, and
                  promotions. Please don’t share your password.
                </p>

                <div class="mt-4 grid gap-3 lg:grid-cols-3">
                  <div class="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
                    <div class="text-sm font-extrabold">Live chat</div>
                    <div class="mt-1 text-xs leading-relaxed text-zinc-400">
                      Fastest way to reach us (recommended).
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Open live chat…")}
                      class="mt-3 inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2.5 text-xs font-extrabold text-zinc-950 hover:brightness-110"
                    >
                      Start chat
                    </button>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
                    <div class="text-sm font-extrabold">Email</div>
                    <div class="mt-1 text-xs leading-relaxed text-zinc-400">
                      Best for documents and detailed requests.
                    </div>
                    <a
                      class="mt-3 inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-xs font-extrabold hover:bg-zinc-900/70"
                      href="mailto:support@vistabet777.com"
                    >
                      Email support
                    </a>
                    <div class="mt-2 text-[11px] text-zinc-500">
                      support@vistabet777.com
                    </div>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
                    <div class="text-sm font-extrabold">Security note</div>
                    <div class="mt-1 text-xs leading-relaxed text-zinc-400">
                      Enable 2FA and contact support immediately if you suspect
                      account compromise.
                    </div>
                    <a
                      class="mt-3 inline-flex text-xs font-extrabold text-zinc-200 hover:underline"
                      href="#faq"
                    >
                      Review security FAQs →
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </section>
      </main>
    </div>
  );
};

export default HelpCenterPage;

const Stat = ({ title, label }: { title: string; label: string }) => (
  <div class="rounded-2xl border border-white/10 bg-zinc-950/20 p-4">
    <div class="text-lg font-black">{title}</div>
    <div class="mt-1 text-xs text-zinc-400">{label}</div>
  </div>
);
