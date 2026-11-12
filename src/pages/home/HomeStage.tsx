import { useMemo, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { bannerState } from "@/state/bannerState";
import { customGamesState } from "@/state/customGamesState";
import { searchWidgetState } from "@/state/searchWidgetState";
import { mobilePortraitMediaQuery, placeholderGameImage } from "@/config/constants";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { isVisibleOnValidDays } from "@/helpers/bannerUtils";
import { requireLogin } from "@/helpers/requireAuth";
import { tGame } from "@/types/tGame";

const ROOMS = [
  {
    href: "/?page=lobby-casino",
    labelKey: "Casino",
    image: "/images/sidebar/casino.png",
    index: "01",
  },
  {
    href: "/?page=lobby-live-casino",
    labelKey: "Live Casino",
    image: "/images/sidebar/live-casino.png",
    index: "02",
  },
  {
    href: "/sports",
    labelKey: "Sports",
    image: "/images/sidebar/sportsbook.svg",
    index: "03",
  },
  {
    href: "/vip",
    labelKey: "VIP",
    image: "/images/sidebar/missions.png",
    index: "04",
  },
] as const;

const TABLE_DOORS = [
  { href: "/casino-category?page=roulette-livecasino", labelKey: "Roulette", image: "/images/category_logo/roulette.png" },
  { href: "/casino-category?page=blackjack-livecasino", labelKey: "Blackjack", image: "/images/category_logo/blackjack.png" },
  { href: "/casino-category?page=baccarat-livecasino", labelKey: "Baccarat", image: "/images/category_logo/baccarat.png" },
  { href: "/casino-category?page=shows-livecasino", labelKey: "Game Shows", image: "/images/category_logo/shows.png" },
] as const;

const HERO_TILES = [
  "/images/category_logo/top.png",
  "/images/category_logo/new.png",
  "/images/category_logo/jackpots.png",
  "/images/category_logo/popular.png",
];

function takeGames(category: string, limit: number): tGame[] {
  return customGamesState.value
    .filter((entry) => matchesCustomCategory(entry.category, category) && entry.Game)
    .slice(0, limit)
    .map((entry) => entry.Game as tGame);
}

function gameImage(game: tGame) {
  return game.img_custom || game.img || placeholderGameImage;
}

export default function HomeStage() {
  const tHome = useTranslations("HomePage");
  const tHeader = useTranslations("Header");
  const isMobile = useMediaQuery(mobilePortraitMediaQuery);
  const [bannerFailed, setBannerFailed] = useState(false);

  const feature = useMemo(() => {
    const banners = bannerState.value.filter((banner) =>
      isVisibleOnValidDays(banner.validDays),
    );
    const sized = banners.find((banner) => banner.size === (isMobile ? "sm" : "lg"));
    return sized ?? banners[0];
  }, [isMobile, bannerState.value]);

  const picks = useMemo(() => {
    const trending = takeGames("trending", 6);
    if (trending.length) return trending;
    const fresh = takeGames("slot-new", 6);
    if (fresh.length) return fresh;
    return customGamesState.value
      .map((entry) => entry.Game)
      .filter((game): game is tGame => Boolean(game))
      .slice(0, 6);
  }, [customGamesState.value]);

  const tables = useMemo(() => {
    const live = takeGames("live-tables", 4);
    if (live.length) return live;
    return takeGames("tablegames", 4);
  }, [customGamesState.value]);

  const openGame = (event: Event) => {
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

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <Link
          href={feature?.buttonLink || "/promotions"}
          scrollToTop
          preventDefaultOnClick={false}
          className="lg:col-span-7 relative min-h-[280px] overflow-hidden bg-[#0f212e] block"
        >
          {feature?.img && !bannerFailed ? (
            <img
              src={feature.img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setBannerFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 grid grid-cols-2">
              {HERO_TILES.map((src) => (
                <img key={src} src={src} alt="" className="h-full w-full object-cover opacity-80" />
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f212e] via-[#0f212e]/55 to-[#0f212e]/20" />
          <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7eb6ff]">
              {tHome("Welcome Bonus")}
            </p>
            <p className="mt-2 max-w-md text-2xl font-extrabold text-white">
              {feature?.buttonTitle || tHome("slots_content")}
            </p>
          </div>
        </Link>

        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {ROOMS.map((room) => (
            <Link
              key={room.href}
              href={room.href}
              scrollToTop
              preventDefaultOnClick={false}
              className="flex items-center gap-4 bg-[#0f212e] px-4 py-3 hover:bg-[#213743] transition-colors"
            >
              <span className="text-xs font-bold text-[#557086] w-6">{room.index}</span>
              <img src={room.image} alt="" className="w-10 h-10 object-contain" />
              <span className="text-base font-bold text-white">
                {tHeader(room.labelKey)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-extrabold text-white">{tHome("stage_picks")}</h2>
          <Link
            href="/?page=lobby-casino"
            scrollToTop
            preventDefaultOnClick={false}
            className="text-sm font-semibold text-[#1475e1]"
          >
            {tHome("stage_open")}
          </Link>
        </div>
        {picks.length === 0 ? (
          <p className="text-sm text-[#b1bad3]">{tHome("stage_empty")}</p>
        ) : (
          <ol className="border-t border-[#2f4553]">
            {picks.map((game, index) => (
              <li key={game.id} className="border-b border-[#2f4553]">
                <Link
                  href={game.href || `/game/${game.id}`}
                  scrollToTop
                  preventDefaultOnClick={false}
                  onClick={openGame}
                  className="flex items-center gap-4 py-3 hover:bg-[#0f212e] px-2"
                >
                  <span className="w-6 text-xs font-bold text-[#557086]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <img
                    src={gameImage(game)}
                    alt=""
                    className="h-14 w-14 object-cover bg-[#0f212e]"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">
                    {game.name}
                  </span>
                  <img src="/images/sidebar/casino.png" alt="" className="w-5 h-5 object-contain opacity-70" />
                </Link>
              </li>
            ))}
          </ol>
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
                  <img src="/images/sidebar/live-casino.png" alt="" className="w-4 h-4 object-contain" />
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
