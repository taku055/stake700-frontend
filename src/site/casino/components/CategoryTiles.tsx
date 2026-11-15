"use client";

import type React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/components/common/Link";
import { useTranslations } from "@/context/I18nContext";
import type { CatalogSection } from "@/config/catalog";
import { routes } from "@/config/routes";
import { pickCustomGames } from "@/helpers/customGames";
import { useScrollArrows } from "@/hooks/useScrollArrows";
import type { tGame } from "@/types/tGame";
import { useSectionCategories } from "../hooks/useSectionCategories";
import { categoryLook, type CategoryLook } from "../categoryIcons";

type Tile = {
  key: string;
  label: string;
  look: CategoryLook;
  href: string;
  covers: tGame[];
  count?: number;
  featured?: boolean;
};

const withArt = (games: tGame[]) => games.filter((g) => g.img || g.img_custom);
const art = (g: tGame) => g.img || g.img_custom || "";

/** Lobby category strip: one rich tile per category, scrollable with arrow buttons. */
export function CategoryTiles({
  section,
  counts,
  total,
}: {
  section: CatalogSection;
  /** Games per category slug (from the server) */
  counts?: Record<string, number>;
  /** Games in the whole section */
  total?: number;
}) {
  const t = useTranslations("CasinoPage");
  const categories = useSectionCategories(section);

  const categoryTiles: Tile[] = categories.map((c) => ({
    key: c.slug,
    label: t(c.titleKey, undefined, c.titleKey),
    look: categoryLook(c.slug),
    href: routes.category(section, c.slug),
    covers: withArt(pickCustomGames(c.category, 6)).slice(0, 3),
    count: counts?.[c.slug],
  }));
  // The "all games" tile borrows a game from each of the first categories
  // (their second one, so it doesn't repeat the neighbouring tiles' fronts)
  const allCovers = categoryTiles
    .map((tile) => tile.covers[1] ?? tile.covers[0])
    .filter((g, i, list) => g && list.findIndex((x) => x?.id === g.id) === i)
    .slice(0, 3);
  const tiles: Tile[] = [
    {
      key: "games",
      label: t("all_games"),
      look: categoryLook("games"),
      href: routes.sectionAll(section),
      covers: allCovers,
      count: total,
      featured: true,
    },
    ...categoryTiles,
  ];

  const { ref, atStart, atEnd, canScroll, scroll } = useScrollArrows<HTMLUListElement>([tiles.length]);
  const navBtn =
    "flex h-full w-9 items-center justify-center text-[var(--text-muted-color)] transition-colors hover:bg-[var(--background-secondary)] hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <section aria-labelledby={`browse-${section}`}>
      <div className="mb-3 flex items-center gap-3 md:mb-4">
        <span className="h-5 w-1 shrink-0 rounded-full bg-[var(--primary-color)] shadow-[0_0_12px_var(--primary-color)] md:h-6" />
        <h2 id={`browse-${section}`} className="text-[17px] font-bold leading-tight text-white md:text-[20px]">
          {t("browse_categories")}
        </h2>
        {canScroll && (
          <div className="ms-auto flex h-9 items-stretch overflow-hidden rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)]">
            <button type="button" aria-label="Previous" className={navBtn} disabled={atStart} onClick={() => scroll(false)}>
              <ChevronLeft size={17} className="rtl:rotate-180" />
            </button>
            <span className="w-px self-stretch bg-[var(--background-secondary)]" />
            <button type="button" aria-label="Next" className={navBtn} disabled={atEnd} onClick={() => scroll(true)}>
              <ChevronRight size={17} className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>

      <ul
        ref={ref}
        className="-mx-2 flex snap-x snap-mandatory scroll-px-2 gap-3 overflow-x-auto px-2 pt-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tiles.map((tile) => (
          <li key={tile.key} className="w-[232px] shrink-0 snap-start md:w-[264px]">
            <CategoryTile tile={tile} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CategoryTile({ tile }: { tile: Tile }) {
  const t = useTranslations("CasinoPage");
  const bg = tile.covers[0];

  return (
    <Link
      href={tile.href}
      className={`group relative flex h-[148px] overflow-hidden rounded-2xl border transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 ${
        tile.featured
          ? "border-[color-mix(in_srgb,var(--primary-color)_70%,transparent)] bg-[linear-gradient(135deg,#1a5fb4,#0f2f55_55%,var(--bar-background-color))] hover:shadow-[0_18px_36px_-18px_var(--primary-color)]"
          : "border-[var(--background-secondary)] bg-[var(--bar-background-color)] hover:border-[color-mix(in_srgb,var(--primary-color)_60%,transparent)] hover:shadow-[0_18px_36px_-20px_rgba(0,0,0,0.9)]"
      }`}
    >
      {/* Soft artwork backdrop */}
      {bg && !tile.featured && (
        <img
          src={art(bg)}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-2xl transition-opacity duration-300 group-hover:opacity-45"
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,33,46,0.95)_30%,rgba(15,33,46,0.35)_75%,transparent)] rtl:bg-[linear-gradient(270deg,rgba(15,33,46,0.95)_30%,rgba(15,33,46,0.35)_75%,transparent)]"
        style={tile.featured ? { opacity: 0.35 } : undefined}
      />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />

      {/* Text */}
      <span className="relative z-10 flex w-[56%] flex-col justify-between p-4">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur ${
            tile.featured ? "border-white/25 bg-white/15 text-white" : "border-white/10 text-[var(--accent)]"
          }`}
          style={
            tile.featured
              ? undefined
              : ({
                  "--accent": tile.look.accent,
                  background: `color-mix(in srgb, ${tile.look.accent} 16%, transparent)`,
                } as React.CSSProperties)
          }
        >
          <tile.look.Icon size={20} strokeWidth={2.25} />
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-[16px] font-extrabold leading-tight text-white">{tile.label}</span>
          <span className="relative h-4 text-[12px] font-semibold">
            <span className="absolute inset-0 text-[var(--text-muted-color)] transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0">
              {typeof tile.count === "number" && tile.count > 0
                ? t("games_count", { count: tile.count.toLocaleString() })
                : " "}
            </span>
            <span className="absolute inset-0 flex translate-y-1 items-center gap-1 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {t("explore")}
              <ArrowRight size={13} className="rtl:rotate-180" />
            </span>
          </span>
        </span>
      </span>

      {/* Fanned covers */}
      {tile.covers.length > 0 && (
        <span aria-hidden className="pointer-events-none absolute end-1 top-1/2 h-[112px] w-[112px] -translate-y-1/2">
          {tile.covers.map((g, i) => {
            const pose = [
              "z-30 left-[26px] top-[4px] rotate-[2deg] group-hover:rotate-0 group-hover:-translate-y-1",
              "z-20 left-[2px] top-[14px] -rotate-[12deg] group-hover:-translate-x-2 group-hover:-rotate-[16deg]",
              "z-10 left-[50px] top-[14px] rotate-[14deg] group-hover:translate-x-2 group-hover:rotate-[18deg]",
            ][i];
            return (
              <img
                key={g.id}
                src={art(g)}
                alt=""
                loading="lazy"
                decoding="async"
                className={`absolute h-[96px] w-[64px] rounded-lg border border-white/15 object-cover shadow-[0_12px_24px_-10px_rgba(0,0,0,0.9)] transition-transform duration-300 ${pose}`}
              />
            );
          })}
        </span>
      )}
    </Link>
  );
}
