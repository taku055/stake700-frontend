import { vipData } from "@/config/vipData";

export function getVipProgress(vipLevel: number, wagered: number) {
  const currentLevelData =
    vipData.find((v) => v.level === vipLevel) || vipData[0];
  const nextLevelData = vipData.find((v) => v.level === vipLevel + 1);

  const progressPercent = nextLevelData
    ? Math.min(100, (wagered / nextLevelData.wagerAmount) * 100)
    : 100;

  return {
    currentLevelData,
    nextLevelData,
    progressPercent,
    wagered,
  };
}
