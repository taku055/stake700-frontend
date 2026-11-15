"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "@/components/common/Link";
import { useTranslations } from "@/context/I18nContext";
import { SECTION_META, type CatalogSection } from "@/config/catalog";
import { routes } from "@/config/routes";
import { SECTION_LOOK } from "../categoryIcons";
import type { tGame } from "@/types/tGame";

export type HeroStat = { label: string; /** undefined renders a skeleton */ value?: string };
export type HeroCrumb = { label: string; href?: string };

interface SectionHeroProps {
  /** Section for theming and the section switcher; null for provider pages */
  section: CatalogSection | null;
  /** "lobby": tall banner with section switcher and artwork; "page": compact with breadcrumbs */
  variant: "lobby" | "page";
  title: string;
  subtitle?: string;
  /** Category icon or provider logo, shown when there is no cover artwork */
  icon?: string | null;
  /** Custom artwork for the right-hand side (e.g. a provider monogram); wins over `icon` */
  iconNode?: ReactNode;
  /** Up to three games fanned out as artwork (lobby) */
  covers?: tGame[];
  stats?: HeroStat[];
  crumbs?: HeroCrumb[];
  /** Rendered under the text, e.g. the search bar */
  children?: ReactNode;
}

const SECTIONS: CatalogSection[] = ["casino", "live-casino"];

/**
 * Banner at the top of the casino / live-casino pages. Decorative layers sit in
 * their own clipped box so dropdowns rendered in `children` (search results)
 * are not cut off.
 */
export function SectionHero({ section, variant, title, subtitle, icon, iconNode, covers = [], stats, crumbs, children }: SectionHeroProps) {
  const t = useTranslations("CasinoPage");
  const isLobby = variant === "lobby";
  const isLive = section === "live-casino";
  const art = covers.filter((g) => g.img || g.img_custom).slice(0, 3);

  return (
    <section className="relative rounded-3xl border border-[var(--background-secondary)]">
      {/* Decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#123a63_0%,#0f2a40_38%,var(--bar-background-color)_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="absolute -top-32 start-[-10%] h-80 w-80 rounded-full bg-[var(--primary-color)] opacity-25 blur-[90px]" />
        {isLive && (
          <div className="absolute -bottom-24 end-[8%] h-64 w-64 rounded-full bg-[var(--fire-color)] opacity-[0.12] blur-[90px]" />
        )}
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />
      </div>

      <div className={`relative flex items-stretch gap-6 ${isLobby ? "p-5 md:p-8 lg:p-10" : "p-5 md:p-7"}`}>
        <div className="flex min-w-0 flex-1 flex-col">
          {isLobby && section ? (
            <SectionSwitch active={section} />
          ) : (
            crumbs && crumbs.length > 0 && <Breadcrumbs crumbs={crumbs} />
          )}

          <div className={isLobby ? "mt-6 md:mt-8" : "mt-4"}>
            {isLive && (
              <span className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--fire-color)_40%,transparent)] bg-[color-mix(in_srgb,var(--fire-color)_12%,transparent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--fire-color)] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--fire-color)]" />
                </span>
                {t("live_now")}
              </span>
            )}
            <h1
              className={`font-extrabold leading-[1.1] tracking-[-0.02em] text-white ${
                isLobby ? "text-[30px] md:text-[42px]" : "text-[26px] md:text-[34px]"
              }`}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-[var(--text-muted-color)] md:text-[15px]">
                {subtitle}
              </p>
            )}
          </div>

          {stats && stats.length > 0 && <Stats stats={stats} />}

          {children && <div className={isLobby ? "mt-6 md:mt-8 md:max-w-[560px]" : "mt-5"}>{children}</div>}
        </div>

        {art.length > 0 ? (
          <CoverFan games={art} />
        ) : iconNode ? (
          <div className="flex shrink-0 items-center max-sm:hidden">{iconNode}</div>
        ) : (
          icon && (
            <div className="flex shrink-0 items-center max-sm:hidden">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur md:h-28 md:w-28">
                <img src={icon} alt="" className="max-h-14 max-w-[70%] object-contain md:max-h-16" />
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function SectionSwitch({ active }: { active: CatalogSection }) {
  const t = useTranslations("CasinoPage");
  return (
    <nav aria-label={t("Casino")} className="inline-flex self-start rounded-xl border border-white/10 bg-black/25 p-1 backdrop-blur">
      {SECTIONS.map((s) => {
        const on = s === active;
        return (
          <Link
            key={s}
            href={routes.section(s)}
            aria-current={on ? "page" : undefined}
            className={`flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-bold transition-colors md:h-10 md:px-4 md:text-[14px] ${
              on
                ? "bg-[var(--primary-color)] text-white shadow-[0_8px_20px_-10px_var(--primary-color)]"
                : "text-[var(--text-muted-color)] hover:text-white"
            }`}
          >
            {(() => {
              const { Icon, accent } = SECTION_LOOK[s];
              return <Icon size={16} strokeWidth={2.25} style={on ? undefined : { color: accent }} />;
            })()}
            {t(SECTION_META[s].titleKey)}
          </Link>
        );
      })}
    </nav>
  );
}

function Breadcrumbs({ crumbs }: { crumbs: HeroCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-[13px] font-semibold text-[var(--text-muted-color)]">
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="opacity-50 rtl:rotate-180" aria-hidden />}
            {c.href ? (
              <Link href={c.href} className="rounded px-1 py-0.5 transition-colors hover:text-white">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="px-1 py-0.5 text-white">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Stats({ stats }: { stats: HeroStat[] }) {
  return (
    <ul className="mt-5 flex flex-wrap items-stretch gap-x-6 gap-y-3">
      {stats.map((s, i) => (
        <li key={s.label} className="flex items-stretch gap-6">
          {i > 0 && <span aria-hidden className="w-px bg-white/10" />}
          <span className="flex flex-col">
            <span className="text-[20px] font-extrabold tabular-nums leading-tight text-white md:text-[22px]">
              {s.value ?? <span className="my-1 block h-5 w-14 animate-pulse rounded bg-white/10" />}
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted-color)]">
              {s.label}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Three game covers fanned out like a hand of cards; each is a link to the game. */
function CoverFan({ games }: { games: tGame[] }) {
  const layout = [
    { x: "-50%", rotate: 0, top: 0, z: 30, scale: 1 },
    { x: "-118%", rotate: -10, top: 18, z: 20, scale: 0.9 },
    { x: "18%", rotate: 10, top: 18, z: 10, scale: 0.9 },
  ];
  return (
    <div className="relative block h-[220px] w-[280px] shrink-0 self-center max-md:hidden lg:h-[250px] lg:w-[340px]" dir="ltr">
      {games.map((g, i) => {
        const l = layout[i];
        return (
          <Link
            key={g.id}
            href={routes.game(g.id, g.name)}
            aria-label={g.name}
            className="group absolute left-1/2 block w-[118px] lg:w-[138px]"
            style={{ top: l.top, zIndex: l.z, transform: `translateX(${l.x}) rotate(${l.rotate}deg) scale(${l.scale})` }}
          >
            <span className="block overflow-hidden rounded-2xl border border-white/15 bg-[var(--background)] shadow-[0_24px_40px_-16px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:-translate-y-2">
              <img
                src={g.img || g.img_custom || ""}
                alt=""
                className="block aspect-[136/182] w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
