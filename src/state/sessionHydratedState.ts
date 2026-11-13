import { signal } from "@preact/signals-react";

/** True after the first app bootstrap (incl. getAccount) has finished — before splash min duration ends. */
export const sessionHydratedState = signal(false);
