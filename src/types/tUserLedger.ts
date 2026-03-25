
export interface ActivePromotion {
  id: number;
  name: string;
  code: string;
  description: string;
  type: string;
  isPercentBonus: boolean;
  bonusValue: number;
  maxBonusLimit: number;
  wageringMultiplier: number;
  wageringBase: string;
  wageringMaxWithdrawMultiplier: number;
  freeSpins: number;
  perSpinCost: number;
  validFrom: string;
  validTo: string;
  expiresAfterhours: number;
  currency: string;
}

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
  bonusValue: string;
  maxBonusLimit: string;
  wageringMultiplier: number;
  wageringBase: string;
  wageringMaxWithdrawMultiplier: number;
  freeSpins: number;
  perSpinCost: string;
  currency: string;
  createdBy: string;
  validDays: string[];
  eligibility: string;
  available: boolean;
}

export interface WageringProgress {
  required: number;
  completed: number;
  remaining: number;
  progress: number; // 0–100
  isMet: boolean;
}

export interface tUserBalance {
  userId: string;
  cash: {
    balance: number;
    wagering: WageringProgress;
  };
  bonus: {
    balance: number;
    game: string[]; // game list that bonus can be used for
    isActive: boolean;
    wagering: WageringProgress;
    wageringMultiplier: number;
    maxWithdraw: number;
  };
  freespin: {
    count: number;
    cost: number;
    expireHours: number; // hours until the freespin expires
  };
  promotion: ActivePromotion | null;
  currencyCode: string;
}
