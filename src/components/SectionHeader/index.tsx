import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";

interface SectionHeaderProps {
  title: string;
  /** Badge content: a category icon, provider monogram, … */
  icon?: ReactNode;
  /** Accent colour for the badge, divider and "View all" hover (defaults to brand blue) */
  accent?: string;
  /** Small line under the title, e.g. "34 games" */
  subtitle?: string;
  viewallLink?: string;
  swiper?: SwiperInstance | null;
  isRTL?: boolean;
}

/**
 * Header for horizontally scrolling game rows: accent badge + title/subtitle,
 * a fading divider, a "View all" pill and round prev/next buttons. Arrow state
 * comes from the Swiper instance (disabled at the edges, hidden when it all fits).
 */
export default function SectionHeader({ title, icon, accent, subtitle, viewallLink, swiper, isRTL }: SectionHeaderProps) {
  const t = useTranslations("CasinoPage");
  const [edges, setEdges] = useState({ begin: true, end: false, locked: false });

  useEffect(() => {
    if (!swiper) return;
    const sync = () => setEdges({ begin: swiper.isBeginning, end: swiper.isEnd, locked: !!swiper.isLocked });
    sync();
    const events = ["slideChange", "reachBeginning", "reachEnd", "fromEdge", "resize", "update", "lock", "unlock"] as const;
    events.forEach((e) => swiper.on(e as any, sync));
    return () => {
      events.forEach((e) => swiper.off(e as any, sync));
    };
  }, [swiper]);

  const navBtn =
    "flex h-9 w-9 items-center justify-center rounded-full border max-sm:h-8 max-sm:w-8 border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] transition-colors hover:border-[var(--accent)] hover:text-white disabled:pointer-events-none disabled:opacity-30";

  const prev = (
    <button key="prev" type="button" aria-label="Previous" className={navBtn} disabled={edges.begin} onClick={() => swiper?.slidePrev()}>
      <ChevronLeft size={17} />
    </button>
  );
  const next = (
    <button key="next" type="button" aria-label="Next" className={navBtn} disabled={edges.end} onClick={() => swiper?.slideNext()}>
      <ChevronRight size={17} />
    </button>
  );

  return (
    <div
      className="mb-3 flex items-center gap-3 max-sm:gap-2 md:mb-4"
      style={{ "--accent": accent || "var(--primary-color)" } as CSSProperties}
    >
      {icon ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl max-sm:h-9 max-sm:w-9 border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,var(--bar-background-color))] text-[var(--accent)] shadow-[0_8px_20px_-12px_var(--accent)] md:h-11 md:w-11">
          {icon}
        </span>
      ) : (
        <span className="h-8 w-1 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
      )}

      <div className="min-w-0 max-sm:flex-1">
        <h2 className="truncate text-[17px] font-extrabold leading-tight text-white md:text-[20px]">{title}</h2>
        {subtitle && <p className="mt-0.5 truncate text-[12px] font-semibold text-[var(--text-muted-color)]">{subtitle}</p>}
      </div>

      {/* divider fading away from the title */}
      <span
        aria-hidden
        className="mx-1 h-px min-w-4 flex-1 max-sm:hidden bg-[linear-gradient(to_right,color-mix(in_srgb,var(--accent)_45%,transparent),transparent)] rtl:bg-[linear-gradient(to_left,color-mix(in_srgb,var(--accent)_45%,transparent),transparent)]"
      />

      <div className="flex shrink-0 items-center gap-2 max-sm:gap-1.5">
        {viewallLink && (
          <Link
            href={viewallLink.trim()}
            className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-3.5 text-[13px] max-sm:h-8 max-sm:px-2.5 max-sm:text-[12px] font-semibold text-white transition-colors hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_16%,var(--bar-background-color))]"
          >
            {t("view_all")}
            <ArrowRight size={14} className={`transition-transform group-hover:translate-x-0.5 ${isRTL ? "rotate-180 group-hover:-translate-x-0.5" : ""}`} />
          </Link>
        )}
        {swiper && !edges.locked && <div className="flex items-center gap-1.5 max-sm:gap-1">{isRTL ? [next, prev] : [prev, next]}</div>}
      </div>
    </div>
  );
}
