"use client";

import { apiGetGameById } from "@/api/common/apiGetGameById";
import GamePlay from "./GamePlay";
import { useState, useEffect } from "react";
import { tGame } from "@/types/tGame";
import Loader from "../../components/Loader";
import EmulateBetting from "@/components/EmulateBetting";
import ProviderGroup from "@/components/ProviderGroup";

interface IGamePageComponentProps {
  gameId: string;
  /** Game fetched on the server — renders immediately, no client round-trip */
  initialGame?: tGame | null;
}

export default function GamePageComponent({ gameId, initialGame }: IGamePageComponentProps) {
  const [game, setGame] = useState<tGame | undefined>(initialGame ?? undefined);
  const [loading, setLoading] = useState(!initialGame);

  useEffect(() => {
    if (initialGame && initialGame.id === gameId) {
      setGame(initialGame);
      setLoading(false);
      return;
    }
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
  }, [gameId, initialGame]);

  if (loading) {
    return (
      <div className="flex flex-col gap-[40px] p-2 md:px-[12px] items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mx-auto gap-6 bg-[#1a2c38]">
      <GamePlay game={game} />
      {/* <EmulateBetting /> */}
      <ProviderGroup />
    </div>
  );
}
