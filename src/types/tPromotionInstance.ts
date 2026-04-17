export type tPromotionInstance = {
  id: bigint;
  promotionId: bigint;
  userId: string;
  deposit: number;
  bonus: number;
  wageredAmount: number;
  createdAt: Date;
  startedAt?: Date | null;
  finishedAt?: Date | null;
  freespinBonusIds: string[];
  status:
    | "ON"
    | "READY"
    | "FINISHED"
    | "EXPIRED"
    | "CANCELED_BY_ADMIN"
    | "CANCELED_BY_USER";
};
