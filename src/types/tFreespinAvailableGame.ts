export type tFreespinAvailableGame = {
  gameId: string;
  remaining: number;
  perSpinCost: number;
  expireAt: string;
  game: {
    id: string;
    name: string;
    img: string | null;
    img_custom: string | null;
    providerId: string;
    gameSource: string;
  } | null;
};

export type tFreespinAvailableGamesResponse = {
  hasError: boolean;
  errorCode?: string;
  message?: string;
  data: tFreespinAvailableGame[];
};
