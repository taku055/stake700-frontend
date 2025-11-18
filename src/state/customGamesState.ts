import { tCustomGame } from "@/types/tCustomGame";
import { signal } from "@preact/signals";

export const customGamesState = signal<tCustomGame[]>([]);
