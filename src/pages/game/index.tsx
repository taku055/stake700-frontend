import { apiGetGameById } from "@/api/common/apiGetGameById";
import GamePlay from "./GamePlay";
import MoreGameWrapper from "./MoreGameWrapper";
import { useState, useEffect } from "preact/hooks";
import { tGame } from "@/types/tGame";
import Loader from "../../components/Loader";
import TrendingGamesPanel from "@/components/TrendingGamesPanel";
import EmulateBetting from "@/components/EmulateBetting";
import ProviderGroup from "@/components/ProviderGroup";

interface IGamePageComponentProps {
  gameId: string;
}

export default function GamePageComponent({ gameId }: IGamePageComponentProps) {
  const [game, setGame] = useState<tGame | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gameId) {
      setLoading(true);
      apiGetGameById(gameId)
        .then((gameData) => {
          setGame(gameData);
        })
        .catch((error) => {
          console.error("Error loading game:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-[40px] p-2 md:px-[12px] items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-[1200px] w-full mx-auto gap-[40px]">
      <GamePlay game={game} />
      {/* <MoreGameWrapper game={game} /> */}
      <EmulateBetting />
      <TrendingGamesPanel />
      <ProviderGroup />
    </div>
  );
}
