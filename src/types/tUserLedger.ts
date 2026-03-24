
export interface tLedgerPromotion {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  validFrom: string;
  validTo: string;
  expiresAfterhours: number;
  type: string;
  forWhom: string;
  isPercentBonus: boolean;
  bonusValue: number;
  maxBonusLimit: number;
  wageringMultiplier: number;
  freeSpins: number;
  perSpinCost: number;
  currency: string;
  createdBy: string;
}

export interface tUserBalance {
  userId: string;
  cash: {
    balance: number;
    wageringCompleted: number;
    wageringRequired: number;
  };
  bonus: {
    balance: number;
    game: string[]; // game list that bonus can be used for
    isActive: boolean;
    wageringCompleted: number;
    wageringRequired: number;
    wageringMultiplier: number;
  };
  freespin: {
    count: number;
    cost: number;
    expireHours: number; // hours until the freespin expires
  };
  currencyCode: string;
}
