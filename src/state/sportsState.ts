import { signal } from "@preact/signals";
import { tGame } from "@/types/tGame";

const imgData: Array<{ name: string; img: string; href?: string }> = [
  {
    name: "Soccer",
    img: "buffer/soccer-en.png",
  },
  {
    name: "Basketball",
    img: "buffer/basketball-en.png",
  },
  {
    name: "Cricket",
    img: "buffer/cricket-en.png",
  },
  {
    name: "Tennis",
    img: "buffer/tennis-en.png",
  },
  {
    name: "American Football",
    img: "buffer/american-football-en.png",
  },
  {
    name: "Ice Hockey",
    img: "buffer/ice-hockey-en.png",
  },
  {
    name: "Darts",
    img: "buffer/darts-en.png",
  },
  // Horse Racing hidden for now.
  {
    name: "Dota 2",
    img: "buffer/dota-2-en.png",
  },
  {
    name: "CS2",
    img: "buffer/counter-strike-en.png",
  },
];

export const sportsState = signal<tGame[]>(
  imgData.map((item) => ({
    id: item.name,
    name: item.name,
    img: item.img,
    href: item.href,
    providerId: "",
    soft_categories: [],
    gameSource: "SOFT",
  }))
);
