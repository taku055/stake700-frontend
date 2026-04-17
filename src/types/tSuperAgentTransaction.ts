import { eTransactionCurrency, eTransactionType } from "./tTransaction";

export type tSuperAgentTransaction = {
  id: number;
  superagentId: string;
  transactionType: eTransactionType;
  cash: number;
  createdAt: Date;
  agentId: string;
  note?: string | null;
  currency: eTransactionCurrency;
};
