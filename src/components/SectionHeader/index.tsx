import { useEffect, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";

interface SectionHeaderProps {
  title: string;
  icon?: string;
  viewallLink?: string;
  swiper?: SwiperInstance | null;
  isRTL?: boolean;
}

/**
 * Header for horizontally scrolling game rows: accent + title on one side,
 * "View all" and a segmented prev/next control on the other.
 * Arrow state is derived from the Swiper instance (disabled at the edges,
 * hidden when everything already fits).
 */
export default function SectionHeader({ title, icon, viewallLink, swiper, isRTL }: SectionHeaderProps) {
  const t = useTranslations("GameGroup");
  const [edges, setEdges] = useState({ begin: true, end: false, locked: false });

  useEffect(() => {
    if (!swiper) return;
    const sync = () =>
      setEdges({ begin: swiper.isBeginning, end: swiper.isEnd, locked: !!swiper.isLocked });
    sync();
    const events = ["slideChange", "reachBeginning", "reachEnd", "fromEdge", "resize", "update", "lock", "unlock"] as const;
    events.forEach((e) => swiper.on(e as any, sync));
    return () => {
      events.forEach((e) => swiper.off(e as any, sync));
    };
  }, [swiper]);

  const navBtn =
    "flex h-full w-9 items-center justify-center text-[var(--text-muted-color)] transition-colors hover:bg-[var(--background-secondary)] hover:text-white disabled:pointer-events-none disabled:opacity-30";

  const prev = (
    <button
      key="prev"
      type="button"
      aria-label="Previous"
      className={navBtn}
      disabled={edges.begin}
      onClick={() => swiper?.slidePrev()}
    >
      <ChevronLeft size={17} />
    </button>
  );
  const next = (
    <button
      key="next"
      type="button"
      aria-label="Next"
      className={navBtn}
      disabled={edges.end}
      onClick={() => swiper?.slideNext()}
    >
      <ChevronRight size={17} />
    </button>
  );
  const divider = <span key="div" className="w-px self-stretch bg-[var(--background-secondary)]" />;

  return (
    <div className="mb-3 flex items-center gap-3 md:mb-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="h-5 w-1 shrink-0 rounded-full bg-[var(--primary-color)] shadow-[0_0_12px_var(--primary-color)] md:h-6" />
        {icon && <img src={icon} alt="" className="h-6 w-6 shrink-0 object-contain" />}
        <h2 className="truncate text-[17px] font-bold leading-tight text-white md:text-[20px]">{title}</h2>
      </div>

      <div className="ms-auto flex shrink-0 items-center gap-2">
        {viewallLink && (
          <Link
            href={viewallLink.trim()}
            className="group inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[var(--text-muted-color)] transition-colors hover:bg-[var(--bar-background-color)] hover:text-white"
          >
            {t("More")}
            <ArrowRight
              size={15}
              className={`transition-transform group-hover:translate-x-0.5 ${isRTL ? "rotate-180 group-hover:-translate-x-0.5" : ""}`}
            />
          </Link>
        )}
        {swiper && !edges.locked && (
          <div className="flex h-9 items-stretch overflow-hidden rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)]">
            {isRTL ? [next, divider, prev] : [prev, divider, next]}
          </div>
        )}
      </div>
    </div>
  );
}
