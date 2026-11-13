import { tEmulateBet } from "@/types/tEmulateBet";
import { signal } from "@preact/signals-react";

export const emulateBettingState = signal<tEmulateBet[]>([]);