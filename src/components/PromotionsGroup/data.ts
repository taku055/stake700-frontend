import { capitalize } from "@/helpers/capitalize";

export interface tPromotionInformation {
  title: string;
  description: string;
  image: string;
  label?: string;
  readMoreLink?: string;
};

export const promotionsData : Array<tPromotionInformation> = [
  {
    title: "Blackjack Boost",
    description: "Get a 10% bonus",
    image: "buffer/promotion1.png",
    label: `Only on ${capitalize(import.meta.env.VITE_SITE_NAME)}`,
    readMoreLink: "#",
  },
  {
    title: "Roulette Wheel Rush",
    description: "enjoy a daily bonus",
    image: "buffer/promotion2.png",
    label: "Promotion",
    readMoreLink: "#",
  },
  {
    title: "Non-Stop Drops",
    description: " no opt-in required!",
    image: "buffer/promotion3.png",
    label: "Streaming",
    readMoreLink: "#",
  },
  {
    title: "Non-Stop Drops",
    description: "no opt-in required!",
    image: "buffer/promotion4.png",
    label: "Streaming",
    readMoreLink: "#",
  },
  {
    title: "Non-Stop Drops",
    description: "No opt-in required!",
    image: "buffer/promotion5.png",
    label: "Streaming",
    readMoreLink: "#",
  },
  {
    title: "Non-Stop Drops",
    description: "No opt-in required!",
    image: "buffer/promotion6.png",
    label: "Streaming",
    readMoreLink: "#",
  },
];