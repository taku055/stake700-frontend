/**
 * Brand name from NEXT_PUBLIC_SITE_NAME, with a fallback so a missing
 * deployment variable can never crash the app at import time.
 */
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Stake700";

/** Lower-case brand key, used in asset paths (S3 folder) and the sign-up token. */
export const SITE_KEY = SITE_NAME.toLowerCase();
