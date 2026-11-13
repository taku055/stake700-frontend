import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { signal } from "@preact/signals-react";

export const liveSupportMessagesState = signal<tLiveSupportMessage[]>([]);
