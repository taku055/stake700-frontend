import { tUser } from "@/types/tUser";
import { signal } from "@preact/signals";

export const userState = signal<tUser | null>(null);
