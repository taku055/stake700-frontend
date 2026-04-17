import { signal } from "@preact/signals";

// Cache for category game counts - keyed by category path
export const categoryCountsCache = signal<Record<string, number>>({});

// Flag to track if counts have been loaded
export const categoryCountsLoaded = signal<boolean>(false);
