import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./GameGroup.module.scss";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ASSET_BASE_URL, mobilePortraitMediaQuery } from "@/config/constants";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import SectionHeader from "@/components/SectionHeader";
import { customGamesState } from "@/state/customGamesState";
import { useTranslations } from "@/context/I18nContext";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

interface IGameGroupProps {
  title: string;
  category?: string;
  isCustom?: boolean;
  useImgCustom?: boolean;
  viewallLink?: string;
  provider?: string;
  exceptGameId?: string;
  bigMode?: boolean;
  animated?: boolean;
  template?: number;
  icon?: string;
  gameList?: tGame[];
}

export default function GameGroup({
  title,
  category,
  isCustom,
  useImgCustom = true,
  viewallLink,
  provider,
  exceptGameId,
  bigMode,
  animated,
  icon,
  template = 0,
  gameList,
}: IGameGroupProps) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const [games, setGames] = useState<tGame[]>([]);
  const t = useTranslations("GameGroup");
  const [swiper, setSwiper] = useState<any>(null);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);



  useEffect(() => {
    (async () => {
      if (gameList) {
        setGames(gameList);
        return;
      }

      const data = isCustom
        ? customGamesState.value
          .filter((c) => matchesCustomCategory(c.category, category ?? ""))
          .slice(0, 30)
          .map((e) => e.Game as tGame)
        : (
          await apiGetGames({
            category: category,
            limit: 30,
            provider: provider,
            randomOrderby: true,
          })
        ).data;
      setGames(data.filter((e) => e.id !== exceptGameId));
    })();
  }, [
    category,
    isCustom,
    customGamesState.value,
    provider,
    exceptGameId,
    gameList,
  ]);

  return (
    <div className={styles.gameGroup}>
      <SectionHeader
        title={title}
        icon={icon}
        viewallLink={viewallLink}
        swiper={swiper}
        isRTL={isRTL}
      />
      <Swiper
        key={`game-group-${isRTL ? "rtl" : "ltr"}-${localeState.value}`}
        modules={[Mousewheel, Navigation]}
        className={styles.games}
        dir={isRTL ? "rtl" : "ltr"}
        loop={false}
        loopAddBlankSlides={false}
        spaceBetween={isMobilePortrait ? 6 : 12}
        slidesPerView={
          isMobilePortrait ? (bigMode ? 2 : 3) : bigMode ? 6 : "auto"
        }
        slidesPerGroup={isMobilePortrait ? 3 : 4}
        onSwiper={setSwiper}
        autoplay={
          animated ? { delay: 5000, disableOnInteraction: false } : undefined
        }
      >
        {games.map((e) => (
          <SwiperSlide key={e.id} className={styles.game}>
            <GameCard data={e} {...(useImgCustom ? { useImgCustom: true } : {})} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
