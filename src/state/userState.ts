import { tUser } from "@/types/tUser";
import { signal } from "@preact/signals-react";

export const userState = signal<tUser | null>(null);
