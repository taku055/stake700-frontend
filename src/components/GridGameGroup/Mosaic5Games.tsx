import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import styles from "./GridGameGroup.module.scss";

type Props = {
  games: tGame[];
};

export default function Mosaic5Games({ games }: Props) {
  const slice = games.slice(0, 5);
  const big = slice[0];
  const small = slice.slice(1);

  return (
    <div className={styles.mosaic5}>
      {big ? (
        <div className={styles.mosaicBig}>
          <GameCard data={big} />
        </div>
      ) : null}

      <div className={styles.mosaicRight}>
        {small.map((game) => (
          <div className={styles.mosaicSmall} key={game.id}>
            <GameCard data={game} />
          </div>
        ))}
      </div>
    </div>
  );
}

