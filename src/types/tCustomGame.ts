import { tGame } from "./tGame";

export type tCustomGame = {
  id: number;
  gameId: number;
  category: string;
  order: number;

  Game?: tGame;
};
