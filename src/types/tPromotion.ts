export type tPromotion = {
  id: bigint;
  name: string;
  createdAt: Date;
  startedAt?: Date | null;
  finishedAt: Date | null;
  startDate: Date;
  endDate: Date;
  maxAmount: number;
  maxPercent: number;
  finishCriteria: number;
  withdrawalLimit: number;
  expirationDuration: number;
  freespinCount: number;
  freespinGameIds: string[];
  freespinCampaignIds: string[];
  freespinCost: number;
  status: "ON" | "OFF" | "FINISHED" | "CANCELED";
};