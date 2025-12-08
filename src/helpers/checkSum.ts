import { numberRound } from "./numberRound";

export const checkSum = (e: any, cash: number) => {
  if (!e) return 0;

  return numberRound(
    (e.depositVisa || 0) +
      (e.depositCrypto || 0) +
      (e.depositManual || 0) +
      (e.depositCashback || 0) +
      (e.depositAgent || 0) +
      (e.depositBonus || 0) -
      (e.withdrawCrypto || 0) -
      (e.withdrawAgent || 0) -
      (e.withdrawManual || 0) -
      (e.withdrawRequested || 0) +
      (e.withdrawCancelled || 0) -
      (e.withdrawBonus || 0) -
      (e.withdrawCashback || 0) -
      (e.withdrawBanned || 0) +
      (e.levelupBonus || 0) +
      (e.referralBonus || 0) +
      (e.leaderboardBonus || 0) +
      (e.rakeback || 0) +
      (e.transferIn || 0) -
      (e.transferOut || 0) -
      (e.casinoBet || 0) +
      (e.casinoWin || 0) -
      (e.sportBet || 0) +
      (e.sportWin || 0) +
      (e.sportRollback || 0) -
      cash,
    1000
  );
};
