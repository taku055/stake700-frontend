"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { SECTION_META, getSectionCategories, type CatalogSection } from "@/config/catalog";
import { routes } from "@/config/routes";

export type HeaderTab = { key: string; label: string; icon: string; href: string };

interface CasinoHeaderProps {
  /** Section whose tabs are shown; null hides the tab bar (e.g. provider pages). */
  section: CatalogSection | null;
  /** "lobby", "games" or a category slug */
  activeTab?: string;
  title: string;
  /** Small label above the title; defaults to the section name */
  eyebrow?: string;
  icon?: string;
  total?: number;
  loading?: boolean;
}

export function CasinoHeader({ section, activeTab, title, eyebrow, icon, total, loading }: CasinoHeaderProps) {
  const t = useTranslations("CasinoPage");
  const tabsRef = useRef<HTMLDivElement>(null);
  const meta = section ? SECTION_META[section] : null;
  const showCount = loading || total !== undefined;

  const tabs: HeaderTab[] = section
    ? [
        { key: "lobby", label: t("Lobby"), icon: "/images/category_logo/lobby.webp", href: routes.section(section) },
        { key: "games", label: t("all_games"), icon: meta!.icon, href: routes.sectionAll(section) },
        ...getSectionCategories(section, true).map((c) => ({
          key: c.slug,
          label: t(c.titleKey, undefined, c.titleKey),
          icon: c.icon,
          href: routes.category(section, c.slug),
        })),
      ]
    : [];

  // Keep the active tab in view on narrow screens
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeTab]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)]">
      <div className="pointer-events-none absolute -top-24 end-[-10%] h-64 w-[60%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary-color)_28%,transparent),transparent)]" />

      <div className="relative flex items-center gap-4 px-4 py-5 md:px-6 md:py-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--background-secondary)] bg-[var(--background)] md:h-14 md:w-14">
          <img
            src={icon || meta?.icon || "/images/sidebar/casino.webp"}
            alt=""
            className="h-7 w-7 object-contain md:h-8 md:w-8"
          />
        </div>
        <div className="min-w-0 flex-1">
          {(eyebrow || meta) && (
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">
              {eyebrow || t(meta!.titleKey)}
            </p>
          )}
          <h1 className="truncate text-[22px] font-bold leading-tight text-white md:text-[28px]">{title}</h1>
        </div>
        <div
          className={`${showCount ? "sm:flex" : ""} hidden shrink-0 items-center gap-2 rounded-full border border-[var(--background-secondary)] bg-[var(--background)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--text-muted-color)]`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green-color)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green-color)]" />
          </span>
          {loading || total === undefined ? (
            <span className="h-3.5 w-16 animate-pulse rounded bg-[var(--background-secondary)]" />
          ) : (
            <span>{t("games_count", { count: total.toLocaleString() })}</span>
          )}
        </div>
      </div>

      {tabs.length > 0 && (
        <nav
          aria-label={meta ? t(meta.titleKey) : undefined}
          className="relative border-t border-[var(--background-secondary)] bg-[var(--background)]/40"
        >
          <div ref={tabsRef} className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3 md:px-6">
            {tabs.map((tab) => {
              const active = tab.key === activeTab;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  data-active={active}
                  scrollToTop={false}
                  className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-[14px] font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[var(--primary-color)] text-white shadow-[0_6px_16px_-8px_var(--primary-color)]"
                      : "border border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] hover:border-[var(--background-tertiary)] hover:text-white"
                  }`}
                >
                  <img src={tab.icon} alt="" className="h-5 w-5 object-contain" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </section>
  );
}
