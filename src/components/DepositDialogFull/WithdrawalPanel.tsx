import { Button, Input } from "@heroui/react";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { userState } from "@/state/userState";
import { toast } from "@/helpers/toast";
import { CryptoCurrencySelects } from "./CryptoCurrencySelects";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import type { tToken } from "@/types/tToken";
import { apiLazyWithdraw } from "@/api/wallet/apiLazyWithdraw";
import { isAddress } from "viem";
import { isValidSegwitAddress } from "@/helpers/isValidSegwitAddress";
import { isValidSolAddress } from "@/helpers/isValidSolAddress";
import axios from "axios";
import Loader from "../Loader";
import { useTranslations } from "@/context/I18nContext";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import {
  buildTokenGroups,
  getPreferredDefaultCryptoSymbol,
  sortTokenSymbols,
} from "./tokenGroupUtils";

export default function WithdrawalPanel() {
  const [selectedCryptoType, setSelectedCryptoType] = useState<string | null>(
    null,
  );
  const [selectedTokenId, setSelectedTokenId] = useState(-1);
  const [selectedBlockchain, setSelectedBlockchain] = useState(0);
  const [amount, setAmount] = useState("0");
  const [wallet, setWallet] = useState("");
  const [tokens, setTokens] = useState<tToken[]>([]);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectionInitialized, setSelectionInitialized] = useState(false);
  const t = useTranslations("DepositDialogFull");
  const tToast = useTranslations("ToastMessages");

  useEffect(() => {
    if (!userState.value?.id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingInfo(true);
        const tokens1 = await apiGetTokenList(0);
        if (!cancelled) setTokens(tokens1);
      } catch (ex) {
        console.error(ex);
      } finally {
        if (!cancelled) setLoadingInfo(false);
      }
    })();
    return () => {
      cancelled = true;
    };
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
    setSelectedCryptoType(preferred);
    setSelectedBlockchain(first.chainId);
    setSelectedTokenId(first.id ?? 0);
    setSelectionInitialized(true);
  }, [sortedSymbols, tokenGroups, selectionInitialized]);

  const onCryptoChange = useCallback(
    (symbol: string) => {
      const group = tokenGroups[symbol];
      if (!group?.length) return;
      setSelectedCryptoType(symbol);
      const first = group[0];
      setSelectedBlockchain(first.chainId);
      setSelectedTokenId(first.id ?? 0);
    },
    [tokenGroups],
  );

  const onBlockchainChange = useCallback(
    (chainId: number) => {
      const group = selectedCryptoType ? tokenGroups[selectedCryptoType] : [];
      const token = group.find((tok) => tok.chainId === chainId);
      if (!token) return;
      setSelectedBlockchain(chainId);
      setSelectedTokenId(token.id ?? 0);
    },
    [selectedCryptoType, tokenGroups],
  );

  const onRequest = useCallback(async () => {
    if (selectedTokenId < 0) {
      toast.error(tToast("error.select_balance"));
      return;
    }

    if (!wallet) {
      toast.error(tToast("error.input_address"));
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

    const userBalance =
      balanceState.value?.[currencyState.value?.code]?.cash?.balance ?? 0;
    if (+amount < 1 || +amount > userBalance) {
      toast.error(tToast("error.withdraw_amount"));
      return;
    }

    if (!userState.value) {
      return;
    }

    setLoading(true);
    try {
      await apiLazyWithdraw(selectedBlockchain, wallet, +amount);
      toast.success(tToast("success.withdrawal_requested"));
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.log(ex.response?.data.message);
        if (ex.response?.data.message === "cash.low.balance") {
          toast.error(tToast("error.insufficient_balance"));
        } else if (ex.response?.data.message === "cash.wagering.active") {
          toast.error(tToast("error.cash_wagering_active"));
        } else if (ex.response?.data.message === "bonus.wagering.active") {
          toast.error(tToast("error.bonus_wagering_active"));
        } else {
          toast.error(ex.response?.data.message);
        }
      } else {
        toast.error(tToast("error.something_wrong"));
      }
    }
    setLoading(false);
  }, [
    wallet,
    amount,
    selectedBlockchain,
    selectedTokenId,
    balanceState.value,
    currencyState.value,
    tToast,
  ]);

  const selectedToken = tokens.find((tok) => tok.id === selectedTokenId);
  const cryptoAmount =
    selectedTokenId !== -1 && tokens.length > 0
      ? (
          +amount / (selectedToken?.usdPrice || 1)
        ).toFixed(5)
      : "0.00000";
  const available =
    balanceState.value?.[currencyState.value?.code]?.cash?.balance ?? 0;

  return loadingInfo ? (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Loader />
    </div>
  ) : (
    <div className="flex flex-col gap-4 py-4">
      <div>
        <div className="flex items-end justify-between gap-3">
          <label className="text-sm text-white">{t("WITHDRAW AMOUNT")}</label>
          <span className="text-xs text-[#b1bad3]">
            {DEFAULT_CURRENCY_SYMBOL} {Number(available).toFixed(2)}
          </span>
        </div>
        <Input
          type="number"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          classNames={{
            inputWrapper:
              "mt-1 h-14 bg-[#0f212e] border border-[#2f4553] data-[hover=true]:bg-[#0f212e]",
            input: "text-lg text-white",
          }}
          startContent={
            <span className="text-[#b1bad3]">{DEFAULT_CURRENCY_SYMBOL}</span>
          }
        />
        <p className="mt-2 text-xs text-[#b1bad3]">
          {cryptoAmount} {selectedCryptoType || ""}
          {" · "}
          {t("Minimum Withdraw")}: {selectedToken?.minimumLimit ?? 0}{" "}
          {selectedCryptoType || ""}
          {" · "}
          {t("Network Fee")}: {t("Unknown")}
        </p>
      </div>

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

      <div>
        <label className="text-sm text-white">
          {t("DESTINATION WALLET ADDRESS")}
        </label>
        <Input
          placeholder={t("wallet_placeholder")}
          value={wallet}
          onChange={(e: any) => setWallet(e.target.value)}
          classNames={{
            inputWrapper:
              "mt-1 bg-[#0f212e] border border-[#2f4553] data-[hover=true]:bg-[#0f212e]",
            input: "font-mono text-sm text-white",
          }}
        />
      </div>

      <Button
        className="h-11 w-full justify-center rounded-md bg-[#1475e1] text-sm font-semibold text-white"
        isLoading={loading}
        onPress={onRequest}
      >
        {t("Initiate Withdrawal")}
      </Button>
    </div>
  );
}
