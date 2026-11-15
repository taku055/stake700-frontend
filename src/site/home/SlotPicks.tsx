"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "@/components/GameCard";
import { Link } from "@/components/common/Link";
import { useTranslations } from "@/context/I18nContext";
import { routes } from "@/config/routes";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { useScrollArrows } from "@/hooks/useScrollArrows";
import { customGamesState } from "@/state/customGamesState";
import { categoryLook } from "@/site/casino/categoryIcons";
import { useSectionCategories } from "@/site/casino/hooks/useSectionCategories";
import type { tGame } from "@/types/tGame";

const GAME_COUNT = 12;

function takeGames(category: string, limit: number): tGame[] {
  return customGamesState.value
    .filter((entry) => entry.Game && matchesCustomCategory(entry.category, category))
    .slice(0, limit)
    .map((entry) => entry.Game as tGame);
}

/**
 * Home page "Slots" block: one tab per casino category (same list, names and
 * icons as the casino pages), showing that category's games.
 */
export default function SlotPicks() {
  const tHome = useTranslations("HomePage");
  const tCasino = useTranslations("CasinoPage");
  const categories = useSectionCategories("casino");
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const active = categories.find((c) => c.slug === selected) ?? categories[0];

  const picks = useMemo(
    () => (active ? takeGames(active.category, GAME_COUNT) : []),
    // customGamesState is read inside takeGames
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, customGamesState.value],
  );

  const { ref, atStart, atEnd, canScroll, scroll } = useScrollArrows([categories.length]);
  const arrow =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] transition-colors hover:border-[var(--background-tertiary)] hover:text-white disabled:pointer-events-none disabled:opacity-35";

  if (!active) return null;

  return (
    <section aria-labelledby="home-slots">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-6 w-1 shrink-0 rounded-full bg-[var(--primary-color)] shadow-[0_0_12px_var(--primary-color)]" />
        <h2 id="home-slots" className="text-[20px] font-extrabold text-white">
          {tHome("stage_picks")}
        </h2>
        <Link
          href={routes.category("casino", active.slug)}
          className="group ms-auto inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[var(--text-muted-color)] transition-colors hover:bg-[var(--bar-background-color)] hover:text-white"
        >
          {tCasino("view_all")}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </Link>
      </div>

      <div className="mb-5 flex items-center gap-2">
        {canScroll && (
          <button type="button" aria-label="Previous" disabled={atStart} onClick={() => scroll(false)} className={arrow}>
            <ChevronLeft size={18} className="rtl:rotate-180" />
          </button>
        )}
        <div
          ref={ref}
          role="tablist"
          aria-label={tHome("stage_picks")}
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => {
            const on = c.slug === active.slug;
            const { Icon, accent } = categoryLook(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                role="tab"
                id={`slot-tab-${c.slug}`}
                aria-selected={on}
                aria-controls="slot-games-panel"
                onClick={() => setSelected(c.slug)}
                style={{ "--accent": accent } as CSSProperties}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-full border ps-1.5 pe-4 text-[14px] font-semibold whitespace-nowrap transition-colors ${
                  on
                    ? "border-transparent bg-[linear-gradient(135deg,#2f8bff,var(--primary-color)_55%,#0f5fc0)] text-white shadow-[0_8px_20px_-10px_var(--primary-color),inset_0_1px_0_rgba(255,255,255,0.25)]"
                    : "border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] hover:border-[color-mix(in_srgb,var(--accent)_60%,transparent)] hover:text-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    on ? "bg-white/20 text-white" : "bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent)]"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.4} />
                </span>
                {tCasino(c.titleKey)}
              </button>
            );
          })}
        </div>
        {canScroll && (
          <button type="button" aria-label="Next" disabled={atEnd} onClick={() => scroll(true)} className={arrow}>
            <ChevronRight size={18} className="rtl:rotate-180" />
          </button>
        )}
      </div>

      {picks.length === 0 ? (
        <p id="slot-games-panel" role="tabpanel" aria-labelledby={`slot-tab-${active.slug}`} className="text-sm text-[var(--text-muted-color)]">
          {tHome("stage_empty")}
        </p>
      ) : (
        <div
          id="slot-games-panel"
          role="tabpanel"
          aria-labelledby={`slot-tab-${active.slug}`}
          className="grid grid-cols-3 gap-x-2.5 gap-y-4 md:grid-cols-4 md:gap-x-3 xl:grid-cols-6"
        >
          {picks.map((game) => (
            <GameCard key={game.id} data={game} />
          ))}
        </div>
      )}
    </section>
  );
}
