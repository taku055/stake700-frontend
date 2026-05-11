import { Button, Input } from "@heroui/react";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "preact/hooks";
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

  return loadingInfo ? (
    <div className="w-full h-full flex items-center justify-center gap-2 p-2 md:p-6 md:gap-6 md:pt-15">
      <Loader />
    </div>
  ) : (
    <div>
      <div className="text-center text-sm text-gray-400 my-2 md:mb-10">
        {t("address_confirm")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-2 md:p-6 overflow-y-auto">
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-md font-semibold text-white">
            {t("Crypto Withdrawals")}
          </h3>
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

        <div className="md:col-span-2 bg-[#21211C] border-1 border-[#515778] rounded-xl p-6 space-y-6">
          <div>
            <label className="text-sm">{t("WITHDRAW AMOUNT")}</label>
            <Input
              type="number"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              classNames={{
                inputWrapper: "bg-[#D9D9D91C] border border-[#515151]",
                input: "text-white",
              }}
              className="mt-[4px]"
              startContent={
                <span className="text-gray-400">{DEFAULT_CURRENCY_SYMBOL}</span>
              }
            />
            <p className="text-xs text-gray-400 mt-1">
              {t("WITHDRAW AMOUNT")}:
              {selectedTokenId !== -1 && tokens.length > 0
                ? `${(
                    +amount /
                    (tokens.find((tok) => tok.id === selectedTokenId)?.usdPrice ||
                      1)
                  ).toFixed(5)} ${selectedCryptoType}`
                : "0.00000"}
              <br />
              {t("Minimum Withdraw")}:
              {selectedToken?.minimumLimit ?? 0} {selectedCryptoType || ""}
              <br />
              {t("Network Fee")}: {t("Unknown")}
            </p>
          </div>

          <div>
            <label className="text-sm">{t("DESTINATION WALLET ADDRESS")}</label>
            <Input
              placeholder={t("wallet_placeholder")}
              value={wallet}
              onChange={(e: any) => setWallet(e.target.value)}
              classNames={{
                inputWrapper: "bg-[#D9D9D91C] border border-[#515151]",
                input: "text-white",
              }}
              className="mt-[4px]"
            />
          </div>

          <Button
            className="w-full justify-center bg-[var(--green-color)] text-white font-medium rounded-lg"
            isLoading={loading}
            onPress={onRequest}
          >
            {t("Initiate Withdrawal")}
          </Button>
        </div>
      </div>
    </div>
  );
}
