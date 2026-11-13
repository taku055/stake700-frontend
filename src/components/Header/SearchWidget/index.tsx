import { useState, useEffect, useRef, useCallback, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Loader2, Search, SearchX, X } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import { searchWidgetState } from "@/state/searchWidgetState";
import { useTranslations } from "@/context/I18nContext";
import { mobileMediaQuery } from "@/config/constants";
import GameCard from "@/components/GameCard";

const SEARCH_PAGE_SIZE = 24;
const DEBOUNCE_MS = 350;

/* -------------------------------------------------------------------------- */
/*  Data: debounced, paginated, race-safe game search                         */
/* -------------------------------------------------------------------------- */

function useGameSearch(active: boolean) {
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

  const fetchPage = useCallback(async (q: string, offset: number) => {
    const myId = ++requestId.current;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await apiGetGames({
        keyword: q || undefined,
        limit: SEARCH_PAGE_SIZE,
        offset,
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
  }, []);

  // New query (or widget activated) -> reset and load first page
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
        if (entries[0].isIntersecting && !loadingRef.current) {
          fetchPage(query, games.length);
        }
      },
      { root, rootMargin: "0px 0px 400px 0px" }
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
/*  Presentational pieces                                                     */
/* -------------------------------------------------------------------------- */

function SearchInput({
  inputRef,
  keyword,
  setKeyword,
  busy,
  onFocus,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  keyword: string;
  setKeyword: (v: string) => void;
  busy: boolean;
  onFocus?: () => void;
}) {
  const t = useTranslations("SearchWidget");
  return (
    <div className="group flex h-12 flex-1 items-center gap-2.5 rounded-lg border border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-3.5 transition-[border-color,box-shadow] hover:border-[var(--background-tertiary)] focus-within:border-[var(--primary-color)]! focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary-color)_25%,transparent)]">
      {busy ? (
        <Loader2 size={18} className="shrink-0 animate-spin text-[var(--primary-color)]" />
      ) : (
        <Search
          size={18}
          className="shrink-0 text-[var(--text-muted-color)] transition-colors group-focus-within:text-[var(--primary-color)]"
        />
      )}
      <input
        ref={inputRef}
        type="search"
        value={keyword}
        placeholder={t("placeholder")}
        onChange={(event) => setKeyword(event.target.value)}
        onFocus={onFocus}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        aria-label={t("Search")}
        className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[var(--background-tertiary)] [&::-webkit-search-cancel-button]:hidden"
      />
      {keyword && (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => {
            setKeyword("");
            inputRef.current?.focus();
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--background-secondary)] text-[var(--text-muted-color)] transition-colors hover:text-white"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function SearchResults({
  search,
  onGameClick,
  className = "",
}: {
  search: ReturnType<typeof useGameSearch>;
  onGameClick: () => void;
  className?: string;
}) {
  const t = useTranslations("SearchWidget");
  const { query, games, total, loading, scrollRef, sentinelRef } = search;
  const isSearching = query.length > 0;
  const initialLoading = loading && games.length === 0;
  const isEmpty = !loading && games.length === 0;

  return (
    <div
      ref={scrollRef}
      className={`min-h-0 overflow-y-auto overscroll-contain px-3 pb-4 sm:px-4 ${className}`}
    >
      <div className="sticky top-0 z-20 flex h-11 items-center bg-[var(--background)]">
        <span className="text-[13px] font-semibold text-[var(--text-muted-color)]">
          {isSearching
            ? initialLoading
              ? t("searching")
              : t("results_count", { count: total })
            : t("explore")}
        </span>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bar-background-color)] text-[var(--background-tertiary)]">
            <SearchX size={26} />
          </div>
          <p className="text-[16px] font-semibold text-white">
            {t("no_results", { keyword: query })}
          </p>
          <p className="mt-1 text-[14px] text-[var(--text-muted-color)]">{t("no_results_hint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
          {games.map((game) => (
            <GameCard key={game.id} data={game} onClick={onGameClick} />
          ))}
          {loading &&
            Array.from({ length: initialLoading ? 12 : 6 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="aspect-[136/182] animate-pulse rounded-lg bg-[var(--bar-background-color)]"
              />
            ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-px" />
    </div>
  );
}

function useEscapeAndScrollLock(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [active, onEscape]);
}

/* -------------------------------------------------------------------------- */
/*  Inline search bar (home / casino pages)                                   */
/* -------------------------------------------------------------------------- */

export default function SearchWidget({ className = "py-3 md:py-4" }: { className?: string } = {}) {
  const [open, setOpen] = useState(false);
  const search = useGameSearch(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const { reset } = search;

  const close = useCallback(() => {
    setOpen(false);
    reset();
    inputRef.current?.blur();
  }, [reset]);

  useEscapeAndScrollLock(open, close);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[105] bg-black/60 backdrop-blur-sm"
          onMouseDown={close}
          aria-hidden
        />
      )}
      <div className={`relative w-full ${className} ${open ? "z-[110]" : ""}`}>
        <SearchInput
          inputRef={inputRef}
          keyword={search.keyword}
          setKeyword={search.setKeyword}
          busy={open && search.loading && search.query.length > 0}
          onFocus={() => setOpen(true)}
        />
        {open && (
          <div className="absolute inset-x-0 top-full flex max-h-[min(560px,calc(var(--viewport-height,100vh)-220px))] flex-col overflow-hidden rounded-xl border border-[var(--background-secondary)] bg-[var(--background)] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)]">
            <SearchResults
              search={search}
              onGameClick={() => {
                searchWidgetState.value = false;
                close();
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Header search (command-palette style modal)                               */
/* -------------------------------------------------------------------------- */

export function SearchWidgetHeader() {
  const isOpen = searchWidgetState.value;
  const t = useTranslations("SearchWidget");
  const isMobile = useMediaQuery(mobileMediaQuery);
  const search = useGameSearch(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const { reset } = search;

  useEffect(() => setMounted(true), []);

  const closePanel = useCallback(() => {
    searchWidgetState.value = false;
    reset();
  }, [reset]);

  useEscapeAndScrollLock(isOpen, closePanel);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex justify-center sm:px-4 sm:pt-[72px]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onMouseDown={closePanel} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("Search")}
        className="relative flex h-full w-full flex-col overflow-hidden bg-[var(--background)] text-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] sm:h-auto sm:max-h-[min(760px,calc(100vh-112px))] sm:max-w-[960px] sm:rounded-2xl sm:border sm:border-[var(--background-secondary)]"
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-3 sm:p-4">
          <SearchInput
            inputRef={inputRef}
            keyword={search.keyword}
            setKeyword={search.setKeyword}
            busy={search.loading && search.query.length > 0}
          />
          <button
            type="button"
            onClick={closePanel}
            aria-label="Close"
            className="flex h-12 shrink-0 items-center justify-center rounded-lg px-3 text-[var(--text-muted-color)] transition-colors hover:bg-[var(--background-secondary)] hover:text-white"
          >
            {isMobile ? (
              <X size={20} />
            ) : (
              <kbd className="rounded-md border border-[var(--background-secondary)] px-1.5 py-0.5 font-sans text-[11px] font-semibold">
                ESC
              </kbd>
            )}
          </button>
        </div>
        <SearchResults search={search} onGameClick={closePanel} className="flex-1" />
      </div>
    </div>,
    document.body
  );
}
