declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_NAME: string;
    NEXT_PUBLIC_BACKEND_URL: string;
    NEXT_PUBLIC_SITE_DOMAIN: string;
    NEXT_PUBLIC_DEFAULT_CURRENCY?: string;
    NEXT_PUBLIC_AFFILIATE_COMMISSION_PERCENTAGE?: string;
  }
}