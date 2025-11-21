export const SOLANA_CHAIN_ID = 900;
export const BITCOIN_CHAIN_ID = 8086;
export const TRON_CHAIN_ID = 728126428;

export const RTL_LANGUAGES = ["ar", "he", "fa"];

export const mobileMediaQuery =
  "screen and ((max-width: 599px) or ((max-width: 1023px) and (orientation: landscape)))";

export const mobileLandscapeMediaQuery =
  "screen and ((max-width: 1023px) and (orientation: landscape))";

export const mobilePortraitMediaQuery =
  "screen and ((max-width: 1023px) and (orientation: portrait))";

export const placeholderGameImage = "/images/placeholder-gamecard.png";

export const OFFICIAL_LINKS = {
  telegram: "https://t.me/ichancyofc",
  whatsapp: "#",
  instagram: "https://www.instagram.com/ichancyofc",
  facebook: "https://www.facebook.com/ichancyofc",
  twitter: "https://x.com/ichancyofc",
  youtube: "https://www.youtube.com/ichancyofc",
  tiktok: "https://www.tiktok.com/@ichancyofc",
  twitch: "https://www.twitch.tv/ichancyofc",
  discord: "https://discord.gg/ichancyofc",
  officialWebsite: "https://www.ichancy.com",
  supportEmail: "support@ichancy.com",
};

export const PAYMENT_METHOD_LIST = [
  {
    key: "aninda-havale",
    title: "Aninda Havale",
    logo: "/images/payments/aninda-havale.png",
  },
  {
    key: "aninda-papara",
    title: "Aninda Papara",
    logo: "/images/payments/aninda-papara.png",
  },
  {
    key: "aninda-paratim",
    title: "Aninda Paratim",
    logo: "/images/payments/aninda-paratim.png",
  },
  {
    key: "barkod-havale",
    title: "Barkod Havale",
    logo: "/images/payments/barkod-havale.png",
  },
  {
    key: "barkod-optomatik-havale",
    title: "Barkod Optomatik Havale",
    logo: "/images/payments/barkod-optomatik-havale.png",
  },
  {
    key: "crypto-currency",
    title: "Crypto Currency",
    logo: "/images/payments/crypto-currency.png",
  },
  {
    key: "flex-cuzdan",
    title: "Flex Cuzdan",
    logo: "/images/payments/flex-cuzdan.png",
  },
  {
    key: "flex-kart",
    title: "Flex Kart",
    logo: "/images/payments/flex-kart.png",
  },
  {
    key: "fulgur-pay",
    title: "Fulgur Pay",
    logo: "/images/payments/fulgur-pay.png",
  },
  {
    key: "jet-havale",
    title: "Jet Havale",
    logo: "/images/payments/jet-havale.png",
  },
  {
    key: "king-havale",
    title: "King Havale",
    logo: "/images/payments/king-havale.png",
  },
  {
    key: "mini-havale",
    title: "Mini Havale",
    logo: "/images/payments/mini-havale.png",
  },
  {
    key: "mini-kredi-karti",
    title: "Mini Kredi Karti",
    logo: "/images/payments/mini-kredi-karti.png",
  },
  {
    key: "oley-havale",
    title: "Oley Havale",
    logo: "/images/payments/oley-havale.png",
  },
  {
    key: "papara-tr-key",
    title: "Papara Tr Key",
    logo: "/images/payments/papara-tr-key.png",
  },
  { key: "paybol", title: "Paybol", logo: "/images/payments/paybol.png" },
  { key: "pay-co", title: "Pay Co", logo: "/images/payments/pay-co.png" },
  {
    key: "popy-para",
    title: "Popy Para",
    logo: "/images/payments/popy-para.png",
  },
  {
    key: "sky-havale",
    title: "Sky Havale",
    logo: "/images/payments/sky-havale.png",
  },
  {
    key: "tr-banktransfer",
    title: "Tr Banktransfer",
    logo: "/images/payments/tr-banktransfer.png",
  },
  { key: "tr-net", title: "Tr Net", logo: "/images/payments/tr-net.png" },
  { key: "tr-papel", title: "Tr Papel", logo: "/images/payments/tr-papel.png" },
  {
    key: "tr-paratim",
    title: "Tr Paratim",
    logo: "/images/payments/tr-paratim.png",
  },
  {
    key: "tr-paycell",
    title: "Tr Paycell",
    logo: "/images/payments/tr-paycell.png",
  },
  { key: "tr-payco", title: "Tr Payco", logo: "/images/payments/tr-payco.png" },
  {
    key: "trpays-papara-plus",
    title: "Trpays Papara Plus",
    logo: "/images/payments/trpays-papara-plus.png",
  },
  {
    key: "trpays-parolapara",
    title: "Trpays Parolapara",
    logo: "/images/payments/trpays-parolapara.png",
  },
  {
    key: "tr-popypara",
    title: "Tr Popypara",
    logo: "/images/payments/tr-popypara.png",
  },
  {
    key: "turbohavale",
    title: "Turbohavale",
    logo: "/images/payments/turbohavale.png",
  },
  {
    key: "ecomm-bx.svg",
    title: "Ecomm Bx",
    logo: "/images/payments/ecomm-bx.svg",
  },
  { key: "jeton", title: "Jeton", logo: "/images/payments/jeton.svg" },
];

const currencies: {
  symbol: string;
  name: string;
  unit: string;
}[] = [
  {
    symbol: "₺",
    name: "Turkish Lira",
    unit: "TRY",
  },
  { symbol: "$", name: "US Dollar", unit: "USD" },
  { symbol: "€", name: "Euro", unit: "EUR" },
  {
    symbol: "£",
    name: "British Pound",
    unit: "GBP",
  },
  {
    symbol: "¥",
    name: "Japanese Yen",
    unit: "JPY",
  },
  {
    symbol: "₹",
    name: "Indian Rupee",
    unit: "INR",
  },
  {
    symbol: "₦",
    name: "Nigerian Naira",
    unit: "NGN",
  },
];

export const DEFAULT_CURRENCY_SYMBOL =
  currencies.find(
    (currency) => currency.unit === import.meta.env.VITE_DEFAULT_CURRENCY
  )?.symbol || "$";

export const AFFILIATE_COMMISSION_PERCENTAGE = import.meta.env.VITE_AFFILIATE_COMMISSION_PERCENTAGE;

export const PRELOAD_IMAGE_URLS = [
];
