import { signal } from "@preact/signals";
import { tGame } from "@/types/tGame";

const imgData = [
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
  {
    name: "Horse Racing",
    img: "buffer/racing-en.png",
  },
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
    providerId: "",
    soft_categories: [],
    gameSource: "SOFT",
  }))
);
