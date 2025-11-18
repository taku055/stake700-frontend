export interface tPromotionInformation {
  title: string;
  description: string;
  image: string;
};

export const promotionsData : Array<tPromotionInformation> = [
  {
    title: "Blackjack Boost",
    description: "Get a 10% bonus on your Blackjack winnings every day!",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/winbet/promos/Blackjack.jpg",
  },
  {
    title: "Roulette Wheel Rush",
    description: "Spin the wheel and enjoy a daily bonus on your Roulette wins!",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/winbet/promos/Roulette.jpg",
  },
  {
    title: "Non-Stop Drops",
    description: "Random rewards drop 24/7 while you play - no opt-in required!",
    image: "https://tekio.s3.eu-north-1.amazonaws.com/winbet/promos/Non-stop.jpg",
  },
];