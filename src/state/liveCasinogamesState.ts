import { signal } from "@preact/signals-react";
import { tGame } from "@/types/tGame";

export const liveCasinoGamesState = signal<tGame[]>([]);