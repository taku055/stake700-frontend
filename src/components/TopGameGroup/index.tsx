import styles from "./TopGameGroup.module.scss";
import { useEffect, useState } from "preact/hooks";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { customGamesState } from "@/state/customGamesState";
import { useTranslations } from "@/context/I18nContext";

interface GameGroupProps {
  title: string;
  category?: string;
  isCustom?: boolean;
  viewallLink?: string;
  provider?: string;
  exceptGameId?: string;
}

export default function TopGameGroup({
  title,
  category,
  isCustom,
  viewallLink,
  provider,
  exceptGameId,
}: GameGroupProps) {
  const [games, setGames] = useState<tGame[]>([]);
  const t = useTranslations("GameGroup");

  useEffect(() => {
    (async () => {
      const data = isCustom
        ? customGamesState.value
            .filter((c) => c.category === category)
            .slice(0, 18)
            .map((e) => e.Game as tGame)
        : (
            await apiGetGames({
              category: category,
              limit: 18,
              provider: provider,
            })
          ).data;
      setGames(data.filter((e) => e.id !== exceptGameId));
    })();
  }, [category, isCustom, customGamesState.value, provider, exceptGameId]);

  return (
    <div className={styles.gameGroup}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <div className={styles.text}>{t(title)}</div>
        </div>

        <a href={viewallLink || "#"} className={styles.view}>
          {t("View All")}
        </a>
      </div>

      <div className="grid md:grid-cols-8 md:gap-[8px] gap-[6px] grid-cols-3">
        {games.map((e, index) =>
          index === 0 || index == 10 ? (
            <div key={index} className="row-span-2 col-span-2 self-stretch">
              <GameCard data={e} />
            </div>
          ) : (
            <div key={index}>
              <GameCard data={e} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
