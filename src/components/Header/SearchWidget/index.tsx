import { useState, useEffect, useRef, useCallback, useMemo, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Clock, Loader2, Search, SearchX, X } from "lucide-react";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import {
  openSearch,
  searchScopeState,
  searchWidgetState,
  type SearchScope,
} from "@/state/searchWidgetState";
import { providerState } from "@/state/providerState";
import { customGamesState } from "@/state/customGamesState";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { useTranslations } from "@/context/I18nContext";
import { Link } from "@/components/common/Link";
import GameCard, { GameCardSkeleton } from "@/components/GameCard";
import { ProviderMonogram } from "@/components/ProviderCard";
import { CATALOG, type CatalogCategory } from "@/config/catalog";
import { routes } from "@/config/routes";
import { providerHref } from "@/helpers/providerHref";
import { categoryLook } from "@/site/casino/categoryIcons";

const SEARCH_PAGE_SIZE = 24;
const DEBOUNCE_MS = 300;
const RECENT_KEY = "search:recent";
const RECENT_MAX = 8;

const SCOPE_GAME_TYPE: Record<SearchScope, "SLOT" | "LIVECASINO" | undefined> = {
  all: undefined,
  SLOT: "SLOT",
  LIVECASINO: "LIVECASINO",
};

/* -------------------------------------------------------------------------- */
/*  Data: debounced, paginated, race-safe game search                         */
/* -------------------------------------------------------------------------- */

function useGameSearch(active: boolean, scope: SearchScope) {
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<tGame[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const loadingRef = useRef(false);

  const hasMore = games.length < total;

  useEffect(() => {
    const id = window.setTimeout(() => setQuery(keyword.trim()), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [keyword]);

  const fetchPage = useCallback(
    async (q: string, offset: number) => {
      const myId = ++requestId.current;
      loadingRef.current = true;
      setLoading(true);
      try {
        const res = await apiGetGames({
          keyword: q || undefined,
          limit: SEARCH_PAGE_SIZE,
          offset,
          gameType: SCOPE_GAME_TYPE[scope],
        });
        if (myId !== requestId.current) return; // a newer request superseded this one
        setGames((prev) => {
          if (offset === 0) return res.data;
          const seen = new Set(prev.map((g) => g.id));
          return [...prev, ...res.data.filter((g) => !seen.has(g.id))];
        });
        // Stop paging if the backend returns an empty page before reaching `total`
        setTotal(res.data.length === 0 ? offset : res.total);
      } catch (err) {
        if (myId === requestId.current) setTotal(offset);
        console.error(err);
      } finally {
        if (myId === requestId.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    [scope],
  );

  // New query / scope (or dialog opened) -> reset and load the first page
  useEffect(() => {
    if (!active) return;
    setGames([]);
    setTotal(0);
    scrollRef.current?.scrollTo({ top: 0 });
    fetchPage(query, 0);
  }, [query, active, fetchPage]);

  // Infinite scroll inside the results container
  useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!active || !root || !target || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) fetchPage(query, games.length);
      },
      { root, rootMargin: "0px 0px 400px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [active, hasMore, games.length, query, fetchPage]);

  const reset = useCallback(() => {
    requestId.current++;
    loadingRef.current = false;
    setKeyword("");
    setQuery("");
    setGames([]);
    setTotal(0);
    setLoading(false);
  }, []);

  return { keyword, setKeyword, query, games, total, loading, scrollRef, sentinelRef, reset };
}

/* -------------------------------------------------------------------------- */
/*  Recent searches (per browser)                                             */
/* -------------------------------------------------------------------------- */

function readRecent(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(value) ? value.filter((v) => typeof v === "string").slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode) — recent searches are a convenience */
  }
}

function useRecentSearches(active: boolean) {
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    if (active) setRecent(readRecent());
  }, [active]);

  const remember = useCallback((term: string) => {
    const value = term.trim();
    if (value.length < 2) return;
    setRecent((prev) => {
      const next = [value, ...prev.filter((v) => v.toLowerCase() !== value.toLowerCase())].slice(0, RECENT_MAX);
      writeRecent(next);
      return next;
    });
  }, []);
  const remove = useCallback((term: string) => {
    setRecent((prev) => {
      const next = prev.filter((v) => v !== term);
      writeRecent(next);
      return next;
    });
  }, []);
  const clear = useCallback(() => {
    writeRecent([]);
    setRecent([]);
  }, []);

  return { recent, remember, remove, clear };
}

/* -------------------------------------------------------------------------- */
/*  Inline search entry (casino pages, home): opens the dialog                */
/* -------------------------------------------------------------------------- */

/**
 * Looks like a search field but opens the shared search dialog, so search
 * behaves the same everywhere. `scope` pre-filters the dialog.
 */
export default function SearchWidget({
  className = "",
  scope = "all",
}: {
  className?: string;
  scope?: SearchScope;
} = {}) {
  const t = useTranslations("SearchWidget");
  return (
    <button
      type="button"
      onClick={() => openSearch(scope)}
      aria-haspopup="dialog"
      className={`group flex h-12 w-full items-center gap-3 rounded-xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] ps-4 pe-2 text-start transition-[border-color,box-shadow] hover:border-[color-mix(in_srgb,var(--primary-color)_60%,transparent)] hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary-color)_15%,transparent)] ${className}`}
    >
      <Search size={18} className="shrink-0 text-[var(--text-muted-color)] transition-colors group-hover:text-[var(--primary-color)]" />
      <span className="min-w-0 flex-1 truncate text-[15px] text-[var(--background-tertiary)]">{t("placeholder")}</span>
      <kbd className="flex h-7 min-w-7 items-center justify-center rounded-md border border-[var(--background-secondary)] bg-[var(--background)] px-1.5 font-sans text-[12px] font-bold text-[var(--text-muted-color)] max-sm:hidden">
        /
      </kbd>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  The search dialog (opened from the header and every search entry)         */
/* -------------------------------------------------------------------------- */

const SCOPES: { key: SearchScope; labelKey: string }[] = [
  { key: "all", labelKey: "scope_all" },
  { key: "SLOT", labelKey: "scope_slots" },
  { key: "LIVECASINO", labelKey: "scope_live" },
];

/** Categories to suggest for a scope, skipping curated ones that have no games yet. */
function categoriesFor(scope: SearchScope): CatalogCategory[] {
  const list =
    scope === "SLOT"
      ? CATALOG.filter((c) => c.section === "casino")
      : scope === "LIVECASINO"
        ? CATALOG.filter((c) => c.section === "live-casino")
        : CATALOG.filter((c) => c.tab);
  const custom = customGamesState.value; // client-only dialog, so no hydration concerns
  if (custom.length === 0) return list;
  return list.filter((c) => !c.isCustom || custom.some((e) => e.Game && matchesCustomCategory(e.category, c.category)));
}

export function SearchWidgetHeader() {
  const isOpen = searchWidgetState.value;
  const scope = searchScopeState.value;
  const t = useTranslations("SearchWidget");
  const tc = useTranslations("CasinoPage");
  const search = useGameSearch(isOpen, scope);
  const { recent, remember, remove, clear } = useRecentSearches(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const { reset, query, keyword, setKeyword } = search;

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    searchWidgetState.value = false;
    reset();
  }, [reset]);

  // "/" or Ctrl/⌘+K opens search from anywhere (except while typing elsewhere)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (searchWidgetState.value) close();
        else openSearch(searchScopeState.value);
      } else if (e.key === "/" && !typing && !searchWidgetState.value) {
        e.preventDefault();
        openSearch("all");
      } else if (e.key === "Escape" && searchWidgetState.value) {
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  // Lock page scroll while open, focus the field
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(id);
    };
  }, [isOpen]);

  const q = query.toLowerCase();
  const matchedProviders = useMemo(
    () =>
      q.length >= 2
        ? providerState.value.array
            .filter((p) => p.added_slot && p.name.toLowerCase().includes(q))
            .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
            .slice(0, 6)
        : [],
    [q, providerState.value.array],
  );
  const matchedCategories = useMemo(
    () =>
      q.length >= 2
        ? categoriesFor(scope).filter((c) => tc(c.titleKey).toLowerCase().includes(q)).slice(0, 6)
        : [],
    [q, scope, tc],
  );

  if (!isOpen || !mounted) return null;

  const isSearching = query.length > 0;
  const initialLoading = search.loading && search.games.length === 0;
  const noGames = !search.loading && search.games.length === 0;
  const onPick = () => {
    if (keyword.trim()) remember(keyword);
    close();
  };

  return createPortal(
    <div className="fixed inset-0 z-[6500] flex justify-center sm:px-4 sm:pt-[min(10vh,96px)]">
      <div className="absolute inset-0 bg-[rgba(4,10,16,0.72)] backdrop-blur-md" onMouseDown={close} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("Search")}
        className="relative flex h-full w-full flex-col overflow-hidden bg-[var(--background)] text-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.85)] sm:h-auto sm:max-h-[min(780px,calc(100vh-120px))] sm:max-w-[1000px] sm:rounded-3xl sm:border sm:border-[var(--background-secondary)]"
      >
        {/* brand glow */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_srgb,var(--primary-color)_22%,transparent),transparent)]" />

        {/* Field */}
        <div className="relative flex shrink-0 items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
          {search.loading && isSearching ? (
            <Loader2 size={22} className="shrink-0 animate-spin text-[var(--primary-color)]" />
          ) : (
            <Search size={22} className="shrink-0 text-[var(--primary-color)]" />
          )}
          <input
            ref={inputRef}
            type="search"
            value={keyword}
            placeholder={t("dialog_placeholder")}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") remember(keyword);
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-label={t("Search")}
            className="h-12 min-w-0 flex-1 bg-transparent text-[18px] font-semibold text-white outline-none placeholder:font-medium placeholder:text-[var(--background-tertiary)] sm:text-[20px] [&::-webkit-search-cancel-button]:hidden"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                inputRef.current?.focus();
              }}
              className="shrink-0 rounded-md px-2 py-1 text-[13px] font-semibold text-[var(--text-muted-color)] transition-colors hover:text-white"
            >
              {t("clear")}
            </button>
          )}
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-[var(--background-secondary)] px-2.5 text-[var(--text-muted-color)] transition-colors hover:border-[var(--background-tertiary)] hover:text-white"
          >
            <X size={18} className="sm:hidden" />
            <span className="font-sans text-[11px] font-bold max-sm:hidden">ESC</span>
          </button>
        </div>

        {/* Scope */}
        <div className="relative flex shrink-0 items-center gap-2 border-b border-[var(--background-secondary)] px-4 pb-3 pt-3 sm:px-6">
          {SCOPES.map((s) => {
            const on = scope === s.key;
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={on}
                onClick={() => (searchScopeState.value = s.key)}
                className={`h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
                  on
                    ? "bg-[var(--primary-color)] text-white shadow-[0_6px_16px_-8px_var(--primary-color)]"
                    : "bg-white/[0.05] text-[var(--text-muted-color)] hover:bg-white/[0.09] hover:text-white"
                }`}
              >
                {t(s.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div ref={search.scrollRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5 sm:px-6">
          {!isSearching && (
            <>
              {recent.length > 0 && (
                <Block
                  title={t("recent")}
                  action={
                    <button type="button" onClick={clear} className="text-[12px] font-semibold text-[var(--text-muted-color)] transition-colors hover:text-white">
                      {t("clear_recent")}
                    </button>
                  }
                >
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <span key={term} className="group inline-flex h-9 items-center rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)] ps-3 pe-1 text-[13px] font-semibold text-white">
                        <button type="button" onClick={() => setKeyword(term)} className="flex items-center gap-2">
                          <Clock size={13} className="text-[var(--text-muted-color)]" />
                          {term}
                        </button>
                        <button
                          type="button"
                          aria-label={t("remove")}
                          onClick={() => remove(term)}
                          className="ms-1 flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-muted-color)] transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </Block>
              )}

              <Block title={t("browse")}>
                <CategoryChips categories={categoriesFor(scope)} onPick={close} />
              </Block>
            </>
          )}

          {isSearching && (matchedProviders.length > 0 || matchedCategories.length > 0) && (
            <Block title={t("quick_links")}>
              <div className="flex flex-wrap gap-2">
                {matchedProviders.map((p) => (
                  <Link
                    key={p.id}
                    href={providerHref(p.id)}
                    onClick={onPick}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)] ps-1.5 pe-3.5 text-[13px] font-semibold text-white transition-colors hover:border-[var(--primary-color)]"
                  >
                    <ProviderMonogram name={p.name} size="xs" />
                    {p.name}
                    <span className="text-[11px] font-medium text-[var(--text-muted-color)]">{t("provider")}</span>
                  </Link>
                ))}
                <CategoryChips categories={matchedCategories} onPick={onPick} inline />
              </div>
            </Block>
          )}

          <Block
            sticky
            title={
              isSearching
                ? initialLoading
                  ? t("searching")
                  : t("results_count", { count: search.total.toLocaleString() })
                : t("popular_now")
            }
          >
            {noGames ? (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bar-background-color)] text-[var(--background-tertiary)]">
                  <SearchX size={26} />
                </div>
                <p className="text-[16px] font-semibold text-white">{t("no_results", { keyword: query })}</p>
                <p className="mt-1 text-[14px] text-[var(--text-muted-color)]">{t("no_results_hint")}</p>
                {scope !== "all" && (
                  <button
                    type="button"
                    onClick={() => (searchScopeState.value = "all")}
                    className="mt-4 h-9 rounded-full bg-[var(--primary-color)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover-color)]"
                  >
                    {t("search_everywhere")}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {search.games.map((game) => (
                  <GameCard key={game.id} data={game} onClick={onPick} />
                ))}
                {search.loading &&
                  Array.from({ length: initialLoading ? 12 : 6 }).map((_, i) => <GameCardSkeleton key={`sk-${i}`} />)}
              </div>
            )}
          </Block>
          <div ref={search.sentinelRef} className="h-px" />
        </div>

        {/* Hints (desktop) */}
        <div className="relative flex shrink-0 items-center gap-4 border-t border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-6 py-2.5 text-[12px] text-[var(--text-muted-color)] max-sm:hidden">
          <span className="flex items-center gap-1.5">
            <Kbd>/</Kbd>
            <Kbd>Ctrl K</Kbd>
            {t("hint_open")}
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>Esc</Kbd>
            {t("hint_close")}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                    */
/* -------------------------------------------------------------------------- */

function Block({
  title,
  action,
  sticky,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  sticky?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-4">
      <div className={`mb-3 flex items-center gap-3 ${sticky ? "sticky top-0 z-20 -mx-1 bg-[var(--background)] px-1 py-1.5" : ""}`}>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">{title}</h3>
        <span className="h-px flex-1 bg-[var(--background-secondary)]" />
        {action}
      </div>
      {children}
    </section>
  );
}

function CategoryChips({
  categories,
  onPick,
  inline,
}: {
  categories: CatalogCategory[];
  onPick: () => void;
  inline?: boolean;
}) {
  const tc = useTranslations("CasinoPage");
  const t = useTranslations("SearchWidget");
  const chips = categories.map((c) => {
    const { Icon, accent } = categoryLook(c.slug);
    return (
      <Link
        key={`${c.section}-${c.slug}`}
        href={routes.category(c.section, c.slug)}
        onClick={onPick}
        style={{ "--accent": accent } as CSSProperties}
        className="group inline-flex h-10 items-center gap-2 rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)] ps-1.5 pe-3.5 text-[13px] font-semibold text-white transition-colors hover:border-[var(--accent)]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]">
          <Icon size={14} strokeWidth={2.4} />
        </span>
        {tc(c.titleKey)}
        {inline ? (
          <span className="text-[11px] font-medium text-[var(--text-muted-color)]">{t("category")}</span>
        ) : (
          <ArrowUpRight size={14} className="text-[var(--text-muted-color)] transition-colors group-hover:text-white rtl:-scale-x-100" />
        )}
      </Link>
    );
  });
  return inline ? <>{chips}</> : <div className="flex flex-wrap gap-2">{chips}</div>;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-[var(--background-secondary)] bg-[var(--background)] px-1.5 py-0.5 font-sans text-[11px] font-bold text-white">
      {children}
    </kbd>
  );
}
