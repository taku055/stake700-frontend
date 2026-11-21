import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "@/components/GameCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { bannerState, bannersLoadedState } from "@/state/bannerState";
import { customGamesState } from "@/state/customGamesState";
import SearchWidget from "@/components/Header/SearchWidget";
import SlotPicks from "./SlotPicks";
import { mobilePortraitMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { isVisibleOnValidDays } from "@/helpers/bannerUtils";
import { tGame } from "@/types/tGame";
import { tBanner } from "@/types/tBanner";
import { localeState } from "@/state/localeState";

const ROOMS = [
  {
    href: "/casino",
    labelKey: "Casino",
    image: "/images/sidebar/casino.webp",
  },
  {
    href: "/live-casino",
    labelKey: "Live Casino",
    image: "/images/sidebar/live-casino.webp",
  },
  {
    href: "/promotions",
    labelKey: "Promotions",
    image: "/images/sidebar/promotions.webp",
  },
  {
    href: "/vip",
    labelKey: "VIP",
    image: "/images/sidebar/vip.webp",
  },
] as const;

const TABLE_DOORS = [
  { href: "/live-casino/roulette", labelKey: "Roulette", image: "/images/category_logo/roulette.webp" },
  { href: "/live-casino/blackjack", labelKey: "Blackjack", image: "/images/category_logo/blackjack.webp" },
  { href: "/live-casino/baccarat", labelKey: "Baccarat", image: "/images/category_logo/baccarat.webp" },
  { href: "/live-casino/game-shows", labelKey: "Game Shows", image: "/images/category_logo/shows.webp" },
] as const;

function takeGames(category: string, limit: number): tGame[] {
  return customGamesState.value
    .filter((entry) => matchesCustomCategory(entry.category, category) && entry.Game)
    .slice(0, limit)
    .map((entry) => entry.Game as tGame);
}

const BANNER_INTERVAL_MS = 5000;
const SWIPE_MIN_PX = 40;

const bannerArrow =
  "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full " +
  "bg-black/45 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-black/75 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] " +
  "md:h-11 md:w-11";

function SideBanner({ banners }: { banners: tBanner[] }) {
  const tHome = useTranslations("HomePage");
  const slides = banners;
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped on manual navigation so autoplay waits a full interval again
  const [manualTick, setManualTick] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, BANNER_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, manualTick]);

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
      setManualTick((t) => t + 1);
    },
    [count],
  );

  // Real banners only: an empty frame until the API answers
  if (count === 0) {
    return <div aria-hidden className="absolute inset-0 animate-pulse bg-[#0f212e]" />;
  }

  const active = index % count;
  const slide = slides[active];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={tHome("banner_label")}
      className="group absolute inset-0 overflow-hidden bg-[#0f212e]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null || count < 2) return;
        const dx = end - start;
        if (Math.abs(dx) >= SWIPE_MIN_PX) goTo(active + (dx < 0 ? 1 : -1));
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goTo(active - 1);
        else if (e.key === "ArrowRight") goTo(active + 1);
      }}
    >
      <Link
        href={slide.buttonLink || "/promotions"}
        scrollToTop
        preventDefaultOnClick={false}
        className="absolute inset-0 block"
      >
        {slides.map((item, itemIndex) => (
          <img
            key={item.id}
            src={item.img}
            alt={itemIndex === active ? item.buttonTitle || "" : ""}
            aria-hidden={itemIndex !== active}
            draggable={false}
            className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-700 ease-in-out ${
              itemIndex === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </Link>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label={tHome("banner_prev")}
            onClick={() => goTo(active - 1)}
            className={`${bannerArrow} left-2 md:left-3`}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label={tHome("banner_next")}
            onClick={() => goTo(active + 1)}
            className={`${bannerArrow} right-2 md:right-3`}
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute inset-x-0 bottom-2.5 z-10 flex justify-center gap-1.5 md:bottom-3">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={tHome("banner_go_to", { n: String(itemIndex + 1), total: String(count) })}
                aria-current={itemIndex === active}
                onClick={() => goTo(itemIndex)}
                className="flex h-5 items-center px-0.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    itemIndex === active ? "w-5 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function HomeStage() {
  const tHome = useTranslations("HomePage");
  const tHeader = useTranslations("Header");
  const tCasino = useTranslations("CasinoPage");
  const isMobile = useMediaQuery(mobilePortraitMediaQuery);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  const banners = useMemo(() => {
    const visible = bannerState.value.filter(
      (banner) =>
        banner.size === (isMobile ? "sm" : "lg") &&
        isVisibleOnValidDays(banner.validDays),
    );
    // Banners in the visitor's language; fall back to English (then any) when none exist.
    const lang = String(localeState.value);
    const inLang = visible.filter((b) => b.language === lang);
    if (inLang.length) return inLang;
    const inEnglish = visible.filter((b) => b.language === "en");
    return inEnglish.length ? inEnglish : visible;
  }, [isMobile, bannerState.value, localeState.value]);

  // Loaded but nothing for this size / language: drop the banner slot
  const noBanners = bannersLoadedState.value && banners.length === 0;

  const tables = useMemo(() => {
    // The same title can exist under several providers; show each table once
    const unique = (games: tGame[]) =>
      games.filter((g, i) => games.findIndex((x) => x.name.trim().toLowerCase() === g.name.trim().toLowerCase()) === i);
    const live = unique(takeGames("live-tables", 16));
    return (live.length ? live : unique(takeGames("tablegames", 16))).slice(0, 8);
  }, [customGamesState.value]);

  return (
    <div className="w-full px-4 md:px-8 pt-6 pb-16 flex flex-col gap-10">
      <header className="flex flex-col gap-4 border-b border-[#2f4553] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#7eb6ff]">
            {tHome("stage_kicker")}
          </h1>
          <p className="mt-2 text-4xl md:text-6xl font-extrabold leading-[0.95] text-white">
            {tHome("stage_title")}
          </p>
        </div>
        <div className="w-full md:w-[340px]">
          <SearchWidget />
        </div>
      </header>

      <section dir="ltr" className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
        {!noBanners && (
          <div className="relative aspect-[16/9] w-full lg:col-span-7 lg:aspect-[2/1]">
            <SideBanner banners={banners} />
          </div>
        )}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className={
            noBanners
              ? "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-12"
              : "grid grid-cols-2 gap-3 sm:grid-cols-2 lg:col-span-5 lg:h-full lg:grid-cols-1 lg:grid-rows-4"
          }
        >
          {ROOMS.map((room) => (
            <Link
              key={room.href}
              href={room.href}
              scrollToTop
              preventDefaultOnClick={false}
              className="flex h-full items-center gap-4 bg-[#0f212e] px-4 py-3 transition-colors hover:bg-[#213743]"
            >
              <img src={room.image} alt="" className="h-11 w-11 object-contain" />
              <span className="text-base font-bold text-white">
                {tHeader(room.labelKey)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SlotPicks />

      <section aria-labelledby="home-tables">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-6 w-1 shrink-0 rounded-full bg-[var(--primary-color)] shadow-[0_0_12px_var(--primary-color)]" />
          <h2 id="home-tables" className="text-[20px] font-extrabold text-white">{tHome("stage_tables")}</h2>
          <Link
            href={"/live-casino"}
            scrollToTop
            preventDefaultOnClick={false}
            className="group ms-auto inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[var(--text-muted-color)] transition-colors hover:bg-[var(--bar-background-color)] hover:text-white"
          >
            {tCasino("view_all")}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </Link>
        </div>
        {tables.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {TABLE_DOORS.map((door) => (
              <Link
                key={door.href}
                href={door.href}
                scrollToTop
                preventDefaultOnClick={false}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-4 transition-colors hover:border-[var(--primary-color)]"
              >
                <img src={door.image} alt="" className="h-14 w-14 object-contain" />
                <span className="text-sm font-bold text-white">
                  {door.labelKey === "Game Shows" ? tHome(door.labelKey) : tHeader(door.labelKey)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-4 md:grid-cols-4 md:gap-x-3">
            {tables.map((game) => (
              <GameCard key={game.id} data={game} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
