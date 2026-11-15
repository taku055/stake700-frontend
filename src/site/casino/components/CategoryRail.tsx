"use client";

import { useEffect, useLayoutEffect, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollArrows } from "@/hooks/useScrollArrows";
import { Link } from "@/components/common/Link";
import { useTranslations } from "@/context/I18nContext";
import { SECTION_META, type CatalogSection } from "@/config/catalog";
import { routes } from "@/config/routes";
import { useSectionCategories } from "../hooks/useSectionCategories";
import { categoryLook, type CategoryLook } from "../categoryIcons";

export type RailItem = { key: string; label: string; href: string } & CategoryLook;

/** Lobby, all games and every category of a section, in display order. */
export function useRailItems(section: CatalogSection, active?: string): RailItem[] {
  const t = useTranslations("CasinoPage");
  const categories = useSectionCategories(section, active);
  return [
    { key: "lobby", label: t("Lobby"), href: routes.section(section), ...categoryLook("lobby") },
    { key: "games", label: t("all_games"), href: routes.sectionAll(section), ...categoryLook("games") },
    ...categories.map((c) => ({
      key: c.slug,
      label: t(c.titleKey, undefined, c.titleKey),
      href: routes.category(section, c.slug),
      ...categoryLook(c.slug),
    })),
  ];
}

// useLayoutEffect warns during SSR; fall back to useEffect there
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Sticky category track: rounded pill bar with line icons, a sliding active
 * indicator, and prev/next buttons when it overflows.
 */
export function CategoryRail({ section, active }: { section: CatalogSection; active: string }) {
  const t = useTranslations("CasinoPage");
  const items = useRailItems(section, active);
  const { ref: scrollerRef, atStart, atEnd, canScroll, scroll } = useScrollArrows([items.length]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Position the sliding pill under the active tab
  useIsoLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const measure = () => {
      const tab = el.querySelector<HTMLElement>('[data-active="true"]');
      setIndicator(tab ? { left: tab.offsetLeft, width: tab.offsetWidth } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, items.length]);

  // Keep the active tab in view
  useEffect(() => {
    const el = scrollerRef.current;
    const tab = el?.querySelector<HTMLElement>('[data-active="true"]');
    if (!el || !tab) return;
    const a = tab.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    el.scrollBy({ left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: "smooth" });
  }, [active]);

  const arrow =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] transition-colors hover:border-[var(--background-tertiary)] hover:text-white disabled:pointer-events-none disabled:opacity-35 max-md:h-9 max-md:w-9";

  return (
    <nav
      aria-label={t(SECTION_META[section].titleKey)}
      className="sticky top-0 z-40 -mx-2 bg-[color-mix(in_srgb,var(--background)_86%,transparent)] px-2 py-2.5 backdrop-blur-md"
    >
      <div className="flex items-center gap-2">
        {canScroll && (
          <button type="button" aria-label="Previous" disabled={atStart} onClick={() => scroll(false)} className={arrow}>
            <ChevronLeft size={18} className="rtl:rotate-180" />
          </button>
        )}

        <div className="min-w-0 flex-1 rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div
            ref={scrollerRef}
            className="relative flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* sliding active pill */}
            {indicator && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 rounded-xl bg-[linear-gradient(135deg,#2f8bff,var(--primary-color)_55%,#0f5fc0)] shadow-[0_8px_20px_-10px_var(--primary-color),inset_0_1px_0_rgba(255,255,255,0.25)] transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ left: indicator.left, width: indicator.width }}
              />
            )}

            {items.map(({ key, label, href, Icon, accent }) => {
              const on = key === active;
              return (
                <Link
                  key={key}
                  href={href}
                  scrollToTop={false}
                  data-active={on}
                  aria-current={on ? "page" : undefined}
                  style={{ "--accent": accent } as CSSProperties}
                  className={`group relative z-10 flex h-10 shrink-0 items-center gap-2 rounded-xl px-3.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors ${
                    on
                      ? `text-white ${indicator ? "" : "bg-[var(--primary-color)]"}`
                      : "text-[var(--text-muted-color)] hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={2.25}
                    className={`shrink-0 transition-colors ${on ? "text-white" : "text-[var(--accent)] opacity-80 group-hover:opacity-100"}`}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {canScroll && (
          <button type="button" aria-label="Next" disabled={atEnd} onClick={() => scroll(true)} className={arrow}>
            <ChevronRight size={18} className="rtl:rotate-180" />
          </button>
        )}
      </div>
    </nav>
  );
}
