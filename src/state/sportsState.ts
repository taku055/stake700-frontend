import { signal } from "@preact/signals";
import {tSport} from "@/types/tSport";

export const sportsState = signal<tSport[]>([
  {
    id: "1",
    name: "Soccer",
    image: "buffer/soccer-en.png",
    link: "#",
  },
  {
    id: "2",
    name: "Basketball",
    image: "buffer/basketball-en.png",
    link: "#",
  },
  {
    id: "3",
    name: "Cricket",
    image: "buffer/cricket-en.png",
    link: "#",
  },
  {
    id: "4",
    name: "Tennis",
    image: "buffer/tennis-en.png",
    link: "#",
  },
  {
    id: "5",
    name: "American Football",
    image: "buffer/american-football-en.png",
    link: "#",
  },
  {
    id: "6",
    name: "Ice Hockey",
    image: "buffer/ice-hockey-en.png",
    link: "#",
  },
  {
    id: "7",
    name: "Darts",
    image: "buffer/darts-en.png",
    link: "#",
  },
  {
    id: "8",
    name: "Horse Racing",
    image: "buffer/racing-en.png",
    link: "#",
  },
  {
    id: "9",
    name: "Dota 2",
    image: "buffer/dota-2-en.png",
    link: "#",
  },
  {
    id: "10",
    name: "CS2",
    image: "buffer/counter-strike-en.png",
    link: "#",
  }
]);