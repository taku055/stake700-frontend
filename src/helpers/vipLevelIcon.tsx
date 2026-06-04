import { getVipLevelIconUrl } from "@/config/constants";

/** @deprecated Use getVipLevelIconUrl — returns S3 PNG URL for VIP tier id (0–6). */
export function getVipIconForLevel(level: { id: number }) {
  return getVipLevelIconUrl(level.id);
}
