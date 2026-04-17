import { tEmulateBet } from "@/types/tEmulateBet";
import { signal } from "@preact/signals";

export const emulateBettingState = signal<tEmulateBet[]>([]);