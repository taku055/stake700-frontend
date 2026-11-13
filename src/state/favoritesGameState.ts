import { tGame } from "@/types/tGame";
import { signal } from "@preact/signals-react";

export const favoritesGameState = signal<tGame[]>([]);
