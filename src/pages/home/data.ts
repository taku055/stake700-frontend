import { useTranslations } from "@/context/I18nContext";

// Helper function to get translated promotion cards
export const getBetPromotionCards = (t: (key: string) => string) => [
  {
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/desktop/promotion-cashback.webp",
    content: t("slots_content") || "Experience the thrill of slots with amazing bonuses and jackpots!",
    buttonText: t("Bet on Slots") || "Bet on Slots",
    link: "/casino/slots",
  },
  {
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/desktop/promotion-loyalty.webp",
    content: t("sports_content") || "Place your bets on sports and enjoy competitive odds!",
    buttonText: t("Bet on Sports") || "Bet on Sports",
    link: "/sport",
  },
  {
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/desktop/promotion-cashback.webp",
    content: t("games_content") || "Discover exciting games and win big prizes!",
    buttonText: t("Bet on Games") || "Bet on Games",
    link: "/casino/games",
  },
];

// Helper function to get translated promotion info cards
export const getPromotionInfoCards = (t: (key: string) => string) => [
  {
    title: t("Welcome Bonus") || "Welcome Bonus",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotion_cards/Welcome bonus.png",
    context: t("welcome_bonus_content") || "Get started with our amazing welcome bonus and boost your gaming experience!",
  },
  {
    title: t("Loyalty Program") || "Loyalty Program",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotion_cards/Loyalty Program.png",
    context: t("loyalty_program_content") || "Join our loyalty program and earn rewards with every bet you place!",
  },
  {
    title: t("Cashback Offer") || "Cashback Offer",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotion_cards/10% Cashback.png",
    context: t("cashback_content") || "Get cashback on your losses and keep playing with extra credits!",
  },
];

