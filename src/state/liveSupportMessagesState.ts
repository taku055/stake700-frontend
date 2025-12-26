import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { signal } from "@preact/signals";

export const liveSupportMessagesState = signal<tLiveSupportMessage[]>([]);
