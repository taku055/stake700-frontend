import { tEmulateBet } from "@/types/tEmulateBet";

const baseImg =
  `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/cards/emulate-betting.webp`;

const pad2 = (n: number) => String(n).padStart(2, "0");

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20251218);

// 50% chance multiplier is < 1, otherwise 1..100
const randomMultiplier = () => {
  const belowOne = rand() < 0.5;
  const value = belowOne ? rand() * 0.99 : 1 + rand() * 99; // [0,0.99) or [1,100)
  return Number(value.toFixed(2));
};

const humanNames = [
  "James Wilson",
  "Sophia Martinez",
  "Liam Anderson",
  "Emma Thompson",
  "Noah Johnson",
  "Olivia Brown",
  "Ethan Davis",
  "Mia Garcia",
  "Lucas Miller",
  "Ava Taylor",
];

export const EmulateBettingData: tEmulateBet[] = Array.from({ length: 10 }, (_, i) => {
  const id = i + 1;

  // 1..500
  const betAmount = Math.floor(rand() * 500) + 1;

  const multiplier = randomMultiplier();

  // if multiplier < 1 this will be smaller than betAmount (loss-like), which seems intended
  const payout = Math.round(betAmount * multiplier);

  const hour = 10 + i; // 10..19
  const minute = Math.floor(rand() * 60);
  const hhmm = `${pad2(hour % 24)}:${pad2(minute)}`;

  const time = new Date(Date.now() - i * 2 * 60_000).toISOString();

  return {
    gameId: String(id),
    name: `Emulate Betting #${id}`,
    userName: humanNames[i] ?? `Player ${id}`,
    img: baseImg,
    time,
    betAmount,
    currency: "BTC",
    payout,
    multiplier,
    hhmm,
  };
});
