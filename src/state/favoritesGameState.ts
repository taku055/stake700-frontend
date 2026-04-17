import { tGame } from "@/types/tGame";
import { signal } from "@preact/signals";

export const favoritesGameState = signal<tGame[]>([]);
