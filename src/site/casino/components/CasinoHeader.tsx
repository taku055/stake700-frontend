import { useEffect, useRef } from "react";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import {
  CASINO_CATEGORY_PAGES,
  LIVE_CATEGORY_PAGES,
  SLOTS_CATEGORY_PAGES,
} from "@/site/casino-category/data";

export type CasinoSection = "slots" | "live-casino";

const SECTION_META: Record<
  CasinoSection,
  { allHref: string; icon: string; titleKey: string }
> = {
  slots: {
    allHref: "/casino/slots",
    icon: "/images/sidebar/casino.webp",
    titleKey: "Casino",
  },
  "live-casino": {
    allHref: "/casino/live-casino",
    icon: "/images/sidebar/live-casino.webp",
    titleKey: "Live Casino",
  },
};

interface CasinoHeaderProps {
  /** Which section's category tabs to show (null hides the tab bar). */
  section: CasinoSection | null;
  /** "all" for the section root, otherwise a casino-category page key. */
  activeTab?: string;
  title: string;
  icon?: string;
  total?: number;
  loading?: boolean;
  /** Custom tabs (e.g. in-page lobby tabs). Overrides the section's default category links. */
  tabs?: HeaderTab[];
  onTabSelect?: (key: string) => void;
}

export type HeaderTab = { key: string; label: string; icon: string; href?: string };

export function CasinoHeader({
  section,
  activeTab = "all",
  title,
  icon,
  total,
  loading,
  tabs: customTabs,
  onTabSelect,
}: CasinoHeaderProps) {
  const t = useTranslations("CasinoPage");
  const tabsRef = useRef<HTMLDivElement>(null);

  const meta = section ? SECTION_META[section] : null;
  const pageKeys = section === "slots" ? SLOTS_CATEGORY_PAGES : section === "live-casino" ? LIVE_CATEGORY_PAGES : [];
  const showCount = loading || total !== undefined;

  const tabs: HeaderTab[] = customTabs
    ? customTabs
    : meta
    ? [
        { key: "all", label: t("all_games"), icon: meta.icon, href: meta.allHref },
        ...pageKeys.map((key) => {
          const cfg = CASINO_CATEGORY_PAGES[key];
          return {
            key,
            label: t(cfg.tab.name, undefined, cfg.tab.name),
            icon: cfg.tab.icon,
            href: `/casino-category?page=${key}`,
          };
        }),
      ]
    : [];

  // Keep the active tab in view on narrow screens
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeTab]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)]">
      {/* brand glow */}
      <div className="pointer-events-none absolute -top-24 end-[-10%] h-64 w-[60%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary-color)_28%,transparent),transparent)]" />

      <div className="relative flex items-center gap-4 px-4 py-5 md:px-6 md:py-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--background-secondary)] bg-[var(--background)] md:h-14 md:w-14">
          <img
            src={icon || meta?.icon || "/images/sidebar/casino.webp"}
            alt=""
            className="h-7 w-7 object-contain md:h-8 md:w-8"
          />
        </div>
        <div className="min-w-0 flex-1">
          {meta && (
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted-color)]">
              {t(meta.titleKey)}
            </p>
          )}
          <h1 className="truncate text-[22px] font-bold leading-tight text-white md:text-[28px]">
            {title}
          </h1>
        </div>
        <div className={`${showCount ? "sm:flex" : ""} hidden shrink-0 items-center gap-2 rounded-full border border-[var(--background-secondary)] bg-[var(--background)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--text-muted-color)]`}>
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
        <div className="relative border-t border-[var(--background-secondary)] bg-[var(--background)]/40">
          <div
            ref={tabsRef}
            role="tablist"
            className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3 md:px-6"
          >
            {tabs.map((tab) => {
              const active = tab.key === activeTab;
              const cls = `flex h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-[14px] font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "bg-[var(--primary-color)] text-white shadow-[0_6px_16px_-8px_var(--primary-color)]"
                  : "border border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] hover:border-[var(--background-tertiary)] hover:text-white"
              }`;
              const content = (
                <>
                  <img src={tab.icon} alt="" className="h-5 w-5 object-contain" />
                  {tab.label}
                </>
              );
              return tab.href ? (
                <Link
                  key={tab.key}
                  href={tab.href}
                  role="tab"
                  aria-selected={active}
                  data-active={active}
                  scrollToTop={false}
                  className={cls}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-active={active}
                  onClick={() => onTabSelect?.(tab.key)}
                  className={cls}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
