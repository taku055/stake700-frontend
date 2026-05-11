import { Button, Input } from "@heroui/react";
import { useEffect, useState, useMemo, useCallback } from "preact/hooks";
import { userState } from "@/state/userState";
import { toast } from "@/helpers/toast";
import { CryptoCurrencySelects } from "@/components/DepositDialogFull/CryptoCurrencySelects";
import {
  buildTokenGroups,
  getPreferredDefaultCryptoSymbol,
  sortTokenSymbols,
} from "@/components/DepositDialogFull/tokenGroupUtils";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import type { tToken } from "@/types/tToken";
import { tFinancialActivitySummarized } from "@/api/account/apiProfileFinancialActivity";
import { apiProfileFinancialActivity } from "@/api/account/apiProfileFinancialActivity";
import { apiLazyWithdraw } from "@/api/wallet/apiLazyWithdraw";
import { isAddress } from "viem";
import { isValidSegwitAddress } from "@/helpers/isValidSegwitAddress";
import { isValidSolAddress } from "@/helpers/isValidSolAddress";
import axios from "axios";
import { useTranslations } from "@/context/I18nContext";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

export const WithdrawSection = () => {
  const [selectedCryptoType, setSelectedCryptoType] = useState<string | null>(
    null,
  );
  const [selectedCryptoId, setSelectedCryptoId] = useState(-1);
  const [selectedBlockchain, setSelectedBlockchain] = useState(0);
  const [amount, setAmount] = useState("0");
  const [wallet, setWallet] = useState("");
  const [financeSum, setFinanceSum] = useState<tFinancialActivitySummarized>();
  const [tokens, setTokens] = useState<tToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmations, setConfirmations] = useState<number>(1);
  const [selectedTokenId, setSelectedTokenId] = useState(-1);
  const [selectionInitialized, setSelectionInitialized] = useState(false);

  const t = useTranslations("DepositDialogFull");
  const tToast = useTranslations("ToastMessages");

  useEffect(() => {
    (async () => {
      if (!userState.value?.id) return;
      try {
        const loaded = await apiGetTokenList(0);
        setTokens(loaded);
      } catch (ex) {
        console.error(ex);
      }
      try {
        const finance = await apiProfileFinancialActivity({});
        setFinanceSum(finance);
      } catch (ex) {
        /* ignore */
      }
    })();
  }, [userState.value?.id]);

  const tokenGroups = useMemo(() => buildTokenGroups(tokens), [tokens]);
  const sortedSymbols = useMemo(
    () => sortTokenSymbols(Object.keys(tokenGroups)),
    [tokenGroups],
  );

  useEffect(() => {
    if (selectionInitialized || sortedSymbols.length === 0) return;
    const preferred = getPreferredDefaultCryptoSymbol(
      sortedSymbols,
      tokenGroups,
    );
    if (!preferred) return;
    const group = tokenGroups[preferred];
    if (!group?.length) return;
    const first = group[0];
    const id = first.id ?? 0;
    setSelectedCryptoType(preferred);
    setSelectedBlockchain(first.chainId);
    setSelectedTokenId(id);
    setSelectedCryptoId(id);
    setSelectionInitialized(true);
  }, [sortedSymbols, tokenGroups, selectionInitialized]);

  const onCryptoChange = useCallback(
    (symbol: string) => {
      const group = tokenGroups[symbol];
      if (!group?.length) return;
      const first = group[0];
      const id = first.id ?? 0;
      setSelectedCryptoType(symbol);
      setSelectedBlockchain(first.chainId);
      setSelectedTokenId(id);
      setSelectedCryptoId(id);
    },
    [tokenGroups],
  );

  const onBlockchainChange = useCallback(
    (chainId: number) => {
      const group = selectedCryptoType ? tokenGroups[selectedCryptoType] : [];
      const token = group.find((x) => x.chainId === chainId);
      if (!token) return;
      const id = token.id ?? 0;
      setSelectedBlockchain(chainId);
      setSelectedTokenId(id);
      setSelectedCryptoId(id);
    },
    [selectedCryptoType, tokenGroups],
  );

  const isWithdrawable = useMemo(() => {
    if (!financeSum || !userState.value?.id) {
      return false;
    }

    let bonusPassedInner = true;
    if (userState.value?.wantBonus && !userState.value?.bonusWithdrawPassed) {
      bonusPassedInner =
        (financeSum.totalResult.casinoBet || 0) >=
        financeSum.bonusDepositMoney * 40;
    }

    const wagerPassedInner = true;
    let monthly = true;
    let weekly = true;
    if (userState.value?.vipLevel < 6) {
      weekly =
        (financeSum.weeklyResult.withdrawCrypto || 0) +
          (financeSum.weeklyResult.withdrawRequested || 0) <
        25000;
      monthly =
        (financeSum.monthlyResult.withdrawCrypto || 0) +
          (financeSum.monthlyResult.withdrawRequested || 0) <
        100000;
    }

    return bonusPassedInner && wagerPassedInner && monthly && weekly;
  }, [financeSum, userState.value?.id]);

  const onRequest = useCallback(async () => {
    if (!financeSum) {
      return;
    }

    if (selectedCryptoId < 0) {
      toast.error(tToast("error.select_balance"));
      return;
    }

    if (!wallet) {
      toast.error(tToast("error.input_address"));
      return;
    }

    if (!isWithdrawable) {
      toast.error(tToast("error.withdraw_not_allowed"));
      return;
    }

    if (selectedBlockchain === 8086 && !isValidSegwitAddress(wallet)) {
      toast.error(tToast("error.valid_address"));
      return;
    } else if (selectedBlockchain === 900 && !isValidSolAddress(wallet)) {
      toast.error(tToast("error.valid_address"));
      return;
    } else if (
      selectedBlockchain !== 8086 &&
      selectedBlockchain !== 900 &&
      !isAddress(wallet)
    ) {
      toast.error(tToast("error.valid_address"));
      return;
    }

    if (+amount < 1 || +amount > (userState.value?.cash || 0)) {
      toast.error(tToast("error.withdraw_amount"));
      return;
    }

    if (!userState.value) {
      return;
    }

    if (userState.value?.vipLevel < 6) {
      const weekly =
        (financeSum.weeklyResult.withdrawCrypto || 0) +
          (financeSum.weeklyResult.withdrawRequested || 0) +
          Number(amount) <
        25000;
      const monthly =
        (financeSum.monthlyResult.withdrawCrypto || 0) +
          (financeSum.monthlyResult.withdrawRequested || 0) +
          Number(amount) <
        100000;
      if (!weekly || !monthly) {
        toast.error(tToast("error.withdrawal_exceeded"));
        return;
      }
    }

    setLoading(true);
    try {
      await apiLazyWithdraw(selectedBlockchain, wallet, +amount);
      toast.success(tToast("success.withdrawal_requested"));
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.log(ex.response?.data.message);
        if (ex.response?.data.message === "low.balance") {
          toast.error(tToast("error.insufficient_balance"));
        } else if (ex.response?.data.message === "low.balance.requests") {
          toast.error(tToast("error.insufficient_balance_requests"));
        } else {
          toast.error(tToast("error.something_wrong"));
        }
      } else {
        toast.error(tToast("error.something_wrong"));
      }
    }
    setLoading(false);
  }, [
    wallet,
    amount,
    selectedCryptoId,
    selectedBlockchain,
    financeSum,
    isWithdrawable,
    userState.value?.cash,
    userState.value?.vipLevel,
    tToast,
  ]);

  return (
    <div className="flex flex-col p-4 gap-[16px]">
      <div className="flex flex-col gap-2">
        <CryptoCurrencySelects
          tokenGroups={tokenGroups}
          sortedSymbols={sortedSymbols}
          selectedCryptoType={selectedCryptoType}
          selectedBlockchain={selectedBlockchain}
          onCryptoChange={onCryptoChange}
          onBlockchainChange={onBlockchainChange}
          currencyLabel={t("Currency")}
          blockchainLabel={t("BLOCKCHAIN")}
        />
      </div>

      {selectedTokenId !== -1 && (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-[14px]">
              {t("DEPOSIT AMOUNT")}
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              classNames={{
                inputWrapper:
                  "bg-[var(--background-secondary)] border-[2px] border-[var(--background-secondary)] h-[44px]",
                input: "text-white text-[14px]",
              }}
              startContent={
                <span className="text-white/60">{DEFAULT_CURRENCY_SYMBOL}</span>
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">
              {t("Destination wallet address")}
            </label>
            <Input
              placeholder={t("wallet_placeholder")}
              value={wallet}
              onChange={(e: any) => setWallet(e?.target.value)}
              classNames={{
                inputWrapper: "bg-[#D9D9D91C] border border-[#515151]",
                input: "text-white",
              }}
              color="default"
              className="mt-4px"
            />
          </div>
        </>
      )}

      <Button
        className="w-full h-[48px] min-h-[44px] text-white text-[16px] font-medium bg-[var(--green-color)] hover:bg-[var(--bar-background-color)]/80 rounded-lg border border-[var(--background-secondary)]"
        isLoading={loading}
        onPress={() => {
          onRequest();
        }}
      >
        <div className="flex items-center gap-2 w-full h-full py-2 px-4 justify-center">
          {t("Withdraw")}
        </div>
      </Button>

      <div className="h-px w-full bg-[var(--bar-background-color)]"></div>

      <div className="flex justify-between items-center">
        <span className="text-white text-[16px]">{t("Credited")}</span>
        <span className="text-white text-[16px]">
          {confirmations} {t("Confirmation")}
        </span>
      </div>
    </div>
  );
};
