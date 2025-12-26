import AboutHeroSection from "./components/AboutHeroSection";
import AboutCardGroup from "./components/AboutCardGroup";
import { useTranslations } from "@/context/I18nContext";

export default function AboutUs() {
  const t = useTranslations("AboutUs");

  // Card data for the three cards
  const cards = [
    {
      image: "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/cards/fast-games.webp",
      title: t("fast_games_title") || "Fast Games",
      explanation: t("fast_games_explanation") || "Experience lightning-fast gameplay with our optimized platform designed for speed and performance.",
    },
    {
      image: "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/cards/casino-games.webp",
      title: t("casino_games_title") || "Casino Games",
      explanation: t("casino_games_explanation") || "Enjoy a wide variety of casino games including slots, table games, and live dealer options.",
    },
    {
      image: "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/cards/sports-betting.webp",
      title: t("sports_betting_title") || "Sports Betting",
      explanation: t("sports_betting_explanation") || "Place bets on your favorite sports with competitive odds and live betting options.",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 px-0 md:px-24">
      {/* Hero Section with hover effect */}
      <AboutHeroSection
        desktopImage="https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/desktop/about-betalarab.webp"
        mobileImage="https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/mobile/about-betalarab-mobile.webp"
        title={t("title") || "About betalarab?"}
        content={t("content") || "betalarab is a modern online casino betting and gaming platform created in 2023, offering a new closer gaming experience that makes placing bets with cryptocurrencies or Visa and Major Cards more entertaining. Created with a community-focused style, betalarab stands out as a platform that connects people with the same passion for gaming. betalarab aims to provide the best services in the field and create a safe environment and gaming experience. Responsible to customers."}
      />

      {/* Card Group */}
      <AboutCardGroup cards={cards} />
    </div>
  );
}
