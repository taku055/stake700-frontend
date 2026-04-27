import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import styles from "./TwoRowGameGroup.module.scss";

type Props = {
  games: tGame[];
};

export default function TwoRowMosaic4Games({ games }: Props) {
  const slice = games.slice(0, 4);

  return (
    <div className={styles.mosaic4}>
      {slice.map((game) => (
        <div className={styles.mosaicCard} key={game.id}>
          <GameCard data={game} />
        </div>
      ))}
    </div>
  );
}

