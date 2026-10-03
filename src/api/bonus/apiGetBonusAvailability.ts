import { instance } from "../instance";

export type tBonusAvailabilityRow = {
  gameSource: string;
  providerId: string;
  livecasino: boolean;
  slot: boolean;
  sport: boolean;
};

export type tBonusAvailabilityPublic = {
  defaultLivecasino: boolean;
  defaultSlot: boolean;
  defaultSport: boolean;
  settings: Record<string, tBonusAvailabilityRow>;
};

export const apiGetBonusAvailability = async () => {
  const res = await instance.get<tBonusAvailabilityPublic>(
    "/bonus-availability",
  );
  return res.data;
};
