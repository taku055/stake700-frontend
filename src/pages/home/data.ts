import { useTranslations } from "@/context/I18nContext";

// Helper function to get translated promotion cards
export const getBetPromotionCards = (t: (key: string) => string) => [
  {
    title: t("bet_promotion_casino_title") || "Casino",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/cards/casino.webp",
    content: t("bet_promotion_casino_content") || "Top-rated Casino Games from renowned providers in the world!\n venture into the world of unique live casino show games.",
    buttonText: t("Bet on Slots") || "Bet on Slots",
    link: "/casino/slots",
  },
  {
    title: t("bet_promotion_sports_title") || "Sports Bets",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/cards/sports.webp",
    content: t("bet_promotion_sports_content") || "ultimate coverage and unbeatable odds on your matchups!\nExperience sports betting with the best offers and bonuses.",
    buttonText: t("Bet on Sports") || "Bet on Sports",
    link: "/sport",
  },
  {
    title: t("bet_promotion_fast_games_title") || "Fast Games",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/cards/games.webp",
    content: t("bet_promotion_fast_games_content") || "Challenges from waiting until the last possible moment to claim your winnings to guessing the next number displayed.",
    buttonText: t("Bet on Games") || "Bet on Games",
    link: "/casino/games",
  },
];

// Helper function to get translated promotion info cards
export const getPromotionInfoCards = (t: (key: string) => string) => [
  {
    title: t("promotion_info_sports_bonus_title") || "Sports Bonus",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/cards/multibet.png",
    context: t("promotion_info_sports_bonus_context") || "Maximize your bets with our sports bonus!\nEven when luck isn't on your side we can turn it into a victory with our innovative rewards system",
  },
  {
    title: t("promotion_info_casino_bonus_title") || "Casino Bonus",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/cards/weekly.png",
    context: t("promotion_info_casino_bonus_context") || "Unlock Big bonuses that enhance your gaming journey. Boost your chances of winning big and indulge in a world of rewards with our generous bonus offers.",
  },
  {
    title: t("promotion_info_community_title") || "Community",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/cards/community.png",
    context: t("promotion_info_community_context") || "A place to share experiences and ideas, we enhance your journey with diverse insights, be a part of this welcoming community. Your presence can make a real difference.",
  },
];

