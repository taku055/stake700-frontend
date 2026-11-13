import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { bannerState } from "@/state/bannerState";
import { customGamesState } from "@/state/customGamesState";
import { searchWidgetState } from "@/state/searchWidgetState";
import { mobilePortraitMediaQuery, placeholderGameImage, RTL_LANGUAGES } from "@/config/constants";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { isVisibleOnValidDays } from "@/helpers/bannerUtils";
import { requireLogin } from "@/helpers/requireAuth";
import { tGame } from "@/types/tGame";
import { tBanner } from "@/types/tBanner";
import { localeState } from "@/state/localeState";

const ROOMS = [
  {
    href: "/?page=lobby-casino",
    labelKey: "Casino",
    image: "/images/sidebar/casino.webp",
  },
  {
    href: "/?page=lobby-live-casino",
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

const SLOT_TAB_GAME_COUNT = 12;

const SLOT_TABS = [
  { key: "lobby", categories: [], labelKey: "Lobby", image: "/images/category_logo/lobby.webp" },
  { key: "popular", categories: ["slot-top-slots", "slot-popular"], labelKey: "Popular", image: "/images/category_logo/popular.webp" },
  { key: "megaways", categories: ["megaways"], labelKey: "Megaways", image: "/images/category_logo/megaways.webp" },
  { key: "jackpots", categories: ["jackpots"], labelKey: "Jackpots", image: "/images/category_logo/jackpots.webp" },
  { key: "new", categories: ["slot-new"], labelKey: "New", image: "/images/category_logo/new.webp" },
  { key: "top", categories: ["top-games"], labelKey: "Top", image: "/images/category_logo/top.webp" },
] as const;

type SlotTabKey = (typeof SLOT_TABS)[number]["key"];

const TABLE_DOORS = [
  { href: "/casino-category?page=roulette-livecasino", labelKey: "Roulette", image: "/images/category_logo/roulette.webp" },
  { href: "/casino-category?page=blackjack-livecasino", labelKey: "Blackjack", image: "/images/category_logo/blackjack.webp" },
  { href: "/casino-category?page=baccarat-livecasino", labelKey: "Baccarat", image: "/images/category_logo/baccarat.webp" },
  { href: "/casino-category?page=shows-livecasino", labelKey: "Game Shows", image: "/images/category_logo/shows.webp" },
] as const;

const HERO_TILES = [
  "/images/category_logo/top.webp",
  "/images/category_logo/new.webp",
  "/images/category_logo/jackpots.webp",
  "/images/category_logo/popular.webp",
];

function takeGames(category: string, limit: number): tGame[] {
  return customGamesState.value
    .filter((entry) => matchesCustomCategory(entry.category, category) && entry.Game)
    .slice(0, limit)
    .map((entry) => entry.Game as tGame);
}

function takeAny(categories: readonly string[], limit: number): tGame[] {
  const seen = new Set<string>();
  const games: tGame[] = [];
  for (const category of categories) {
    for (const game of takeGames(category, limit)) {
      if (seen.has(game.id)) continue;
      seen.add(game.id);
      games.push(game);
      if (games.length >= limit) return games;
    }
  }
  return games;
}

function lobbyGames(limit: number): tGame[] {
  const trending = takeGames("trending", limit);
  if (trending.length >= 8) return trending;
  const fresh = takeGames("slot-new", limit);
  if (fresh.length >= 8) return fresh;
  return customGamesState.value
    .map((entry) => entry.Game)
    .filter((game): game is tGame => Boolean(game))
    .slice(0, limit);
}

function gameImage(game: tGame) {
  return game.img_custom || game.img || placeholderGameImage;
}

const CARD_COVERS = [
  { from: "#ff4d6d", to: "#7a1fa2" },
  { from: "#3dfff3", to: "#1463d6" },
  { from: "#ffe14a", to: "#ff6a00" },
  { from: "#5dff8a", to: "#0b9e6a" },
  { from: "#d9a4ff", to: "#6d28d9" },
  { from: "#ff7a3c", to: "#e11d74" },
  { from: "#7af0ff", to: "#2563eb" },
  { from: "#ffd36b", to: "#e85d04" },
  { from: "#67f7d4", to: "#0e7490" },
  { from: "#ff3d7f", to: "#9f1239" },
  { from: "#c4b5fd", to: "#4338ca" },
  { from: "#facc15", to: "#0284c7" },
] as const;

function SideBanner({ banners }: { banners: tBanner[] }) {
  const slides = banners.length
    ? banners
    : HERO_TILES.map((src, index) => ({
        id: index,
        img: src,
        buttonLink: "/promotions",
        buttonTitle: "",
      }));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index % slides.length];

  return (
    <Link
      href={slide.buttonLink || "/promotions"}
      scrollToTop
      preventDefaultOnClick={false}
      className="absolute inset-0 block overflow-hidden bg-[#0f212e]"
    >
      {slides.map((item, itemIndex) => (
        <img
          key={item.id}
          src={item.img}
          alt={item.buttonTitle || ""}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            itemIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </Link>
  );
}

export default function HomeStage() {
  const tHome = useTranslations("HomePage");
  const tHeader = useTranslations("Header");
  const tCasino = useTranslations("CasinoPage");
  const isMobile = useMediaQuery(mobilePortraitMediaQuery);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const [slotTab, setSlotTab] = useState<SlotTabKey>("popular");

  const banners = useMemo(() => {
    return bannerState.value.filter(
      (banner) =>
        banner.size === (isMobile ? "sm" : "lg") &&
        isVisibleOnValidDays(banner.validDays),
    );
  }, [isMobile, bannerState.value]);

  const picks = useMemo(() => {
    const tab = SLOT_TABS.find((item) => item.key === slotTab) ?? SLOT_TABS[0];
    if (tab.categories.length === 0) return lobbyGames(SLOT_TAB_GAME_COUNT);
    return takeAny(tab.categories, SLOT_TAB_GAME_COUNT);
  }, [customGamesState.value, slotTab]);

  const tables = useMemo(() => {
    const live = takeGames("live-tables", 8);
    if (live.length) return live;
    return takeGames("tablegames", 8);
  }, [customGamesState.value]);

  const openGame = (event: React.MouseEvent) => {
    if (!requireLogin()) event.preventDefault();
  };

  return (
    <div className="w-full px-4 md:px-8 pt-6 pb-16 flex flex-col gap-10">
      <header className="flex flex-col gap-4 border-b border-[#2f4553] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#7eb6ff]">
            {tHome("stage_kicker")}
          </p>
          <h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-[0.95] text-white">
            {tHome("stage_title")}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => (searchWidgetState.value = true)}
          className="flex items-center gap-3 h-12 px-4 bg-[#0f212e] text-[#b1bad3] text-sm font-semibold w-full md:w-[280px]"
        >
          <img src="/images/search.png" alt="" className="w-4 h-4 object-contain" />
          <span>{tHome("stage_search")}</span>
        </button>
      </header>

      <section dir="ltr" className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
        <div className="relative aspect-[16/9] w-full lg:col-span-7 lg:aspect-[2/1]">
          <SideBanner banners={banners} />
        </div>
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:col-span-5 lg:h-full lg:grid-cols-1 lg:grid-rows-4"
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

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/images/sidebar/casino.webp" alt="" className="h-10 w-10 object-contain" />
            <h2 className="text-xl font-extrabold text-white">{tHome("stage_picks")}</h2>
          </div>
          <Link
            href="/?page=lobby-casino"
            scrollToTop
            preventDefaultOnClick={false}
            className="text-sm font-semibold text-[#1475e1]"
          >
            {tHome("stage_open")}
          </Link>
        </div>
        <div
          role="tablist"
          aria-label={tHome("stage_picks")}
          className="mb-4 flex gap-1 overflow-x-auto border-b border-[#2f4553]"
        >
          {SLOT_TABS.map((tab) => {
            const selected = slotTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={`slot-tab-${tab.key}`}
                aria-selected={selected}
                aria-controls="slot-games-panel"
                onClick={() => setSlotTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-[#1475e1] text-white"
                    : "border-transparent text-[#b1bad3] hover:text-white"
                }`}
              >
                <img src={tab.image} alt="" className="h-5 w-5 object-contain" />
                {tCasino(tab.labelKey)}
              </button>
            );
          })}
        </div>
        {picks.length === 0 ? (
          <p id="slot-games-panel" role="tabpanel" aria-labelledby={`slot-tab-${slotTab}`} className="text-sm text-[#b1bad3]">{tHome("stage_empty")}</p>
        ) : (
          <div id="slot-games-panel" role="tabpanel" aria-labelledby={`slot-tab-${slotTab}`} className="grid grid-cols-6 gap-4">
            {picks.map((game, index) => {
              const cover = CARD_COVERS[index % CARD_COVERS.length];
              return (
              <Link
                key={game.id}
                href={game.href || `/game/${game.id}`}
                scrollToTop
                preventDefaultOnClick={false}
                onClick={openGame}
                className="group relative block rounded-2xl p-px shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition duration-300 hover:-translate-y-1.5"
                style={{
                  backgroundImage: `linear-gradient(180deg, ${cover.from}, rgba(255,255,255,0.15) 42%, ${cover.to})`,
                  ["--card-glow" as string]: cover.from,
                }}
              >
                <span className="relative block overflow-hidden rounded-[15px] bg-[#07131c] transition duration-300 group-hover:shadow-[0_0_28px_var(--card-glow)]">
                  <img
                    src={gameImage(game)}
                    alt=""
                    className="aspect-[3/4] w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                  />
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 8%, ${cover.from}55 48%, ${cover.to}e6 100%)`,
                    }}
                  />
                  <span className="pointer-events-none absolute inset-0 bg-[#061018]/0 transition duration-300 group-hover:bg-[#061018]/35" />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white/15 backdrop-blur-md"
                      style={{ boxShadow: `0 0 28px ${cover.from}` }}
                    >
                      <Play className="ml-0.5 h-6 w-6 fill-white text-white" aria-hidden="true" />
                    </span>
                  </span>
                  <span
                    className="absolute inset-x-2 bottom-2 rounded-xl px-2 py-1.5 text-center ring-1 backdrop-blur-md"
                    style={{
                      backgroundColor: `${cover.to}99`,
                      borderColor: `${cover.from}88`,
                      boxShadow: `inset 0 0 0 1px ${cover.from}55`,
                    }}
                  >
                    <span className="line-clamp-2 text-[12px] font-semibold leading-4 text-white">
                      {game.name}
                    </span>
                  </span>
                </span>
              </Link>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-extrabold text-white">{tHome("stage_tables")}</h2>
        {tables.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TABLE_DOORS.map((door) => (
              <Link
                key={door.href}
                href={door.href}
                scrollToTop
                preventDefaultOnClick={false}
                className="bg-[#0f212e] p-3 flex flex-col gap-3"
              >
                <img src={door.image} alt="" className="h-16 w-16 object-contain" />
                <span className="text-sm font-bold text-white">
                  {door.labelKey === "Game Shows" ? tHome(door.labelKey) : tHeader(door.labelKey)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tables.map((game) => (
              <Link
                key={game.id}
                href={game.href || `/game/${game.id}`}
                scrollToTop
                preventDefaultOnClick={false}
                onClick={openGame}
                className="bg-[#0f212e] p-2"
              >
                <img
                  src={gameImage(game)}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="mt-2 flex items-center gap-2 px-1 pb-1">
                  <img src="/images/sidebar/live-casino.webp" alt="" className="w-4 h-4 object-contain" />
                  <span className="truncate text-sm font-bold text-white">{game.name}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
