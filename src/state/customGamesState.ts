import { tCustomGame } from "@/types/tCustomGame";
import { signal } from "@preact/signals-react";

export const customGamesState = signal<tCustomGame[]>([]);
