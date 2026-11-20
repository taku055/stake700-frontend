import { Input } from "@heroui/react";
import { useEffect, useCallback, useState, useMemo } from "react";
import { tToken } from "@/types/tToken";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import { Copy } from "lucide-react";
import { userState } from "@/state/userState";
import { CryptoCurrencySelects } from "./CryptoCurrencySelects";
import { apiSetWantBonus } from "@/api/account/apiSetWantBonus";
import Loader from "../Loader";
import { useTranslations } from "@/context/I18nContext";
import { apiPredictDeposit } from "@/api/wallet/apiPredictDeposit";
import {
  DEFAULT_CURRENCY_SYMBOL,
  SOLANA_CHAIN_ID,
  TRON_CHAIN_ID,
} from "@/config/constants";
import { toast } from "@/helpers/toast";
import {
  buildTokenGroups,
  getPreferredDefaultCryptoSymbol,
  sortTokenSymbols,
} from "./tokenGroupUtils";

export default function DepositPanel() {
  const [selectedCryptoType, setSelectedCryptoType] = useState<string | null>(
    null,
  );
  const [selectedTokenId, setSelectedTokenId] = useState(-1);
  const [selectedBlockchain, setSelectedBlockchain] = useState(0);
  const [amount, setAmount] = useState("0");
  const [wallet, setWallet] = useState("");
  const [tokens, setTokens] = useState<tToken[]>([]);
  const [selectionInitialized, setSelectionInitialized] = useState(false);
  const [loadingWantBonus, setLoadingWantBonus] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
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

  useEffect(() => {
    if (
      selectedBlockchain === 1 ||
      selectedBlockchain === 56 ||
      selectedBlockchain === 137
    ) {
      setWallet(userState.value?.ethAddress || "");
    } else if (selectedBlockchain === SOLANA_CHAIN_ID) {
      setWallet(userState.value?.solanaAddress || "");
    } else if (selectedBlockchain === TRON_CHAIN_ID) {
      setWallet(userState.value?.tronAddress || "");
    } else if (selectedBlockchain === 8086) {
      setWallet(userState.value?.btcAddress || "");
    } else {
      setWallet("");
    }
  }, [selectedBlockchain]);

  const onSetBonus = useCallback(
    async (v: boolean) => {
      setLoadingWantBonus(true);
      try {
        await apiSetWantBonus(v);
        if (userState.value?.id) {
          userState.value = { ...userState.value, wantBonus: v };
        }
      } catch (ex) {
        console.error(ex);
      }
      setLoadingWantBonus(false);
    },
    [userState.value?.id],
  );

  const copyWallet = () => {
    if (wallet === "") return;
    navigator.clipboard.writeText(wallet);
    toast.success(tToast("info.wallet_address_copied"));
  };

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
      const token = group.find((t) => t.chainId === chainId);
      if (!token) return;
      setSelectedBlockchain(chainId);
      setSelectedTokenId(token.id ?? 0);
    },
    [selectedCryptoType, tokenGroups],
  );

  useEffect(() => {
    const token = tokens.find((t) => t.id === selectedTokenId);
    if (token) {
      (async () => {
        try {
          const promoId =
            new URLSearchParams(window.location.search).get("promo") ??
            undefined;

          const res = await apiPredictDeposit(
            token.chainId,
            token.tokenAddress,
            promoId,
          );
        } catch (error) {
          console.error("Error predicting deposit:", error);
          const errorMessage =
            typeof error === "object" &&
            error !== null &&
            "response" in error &&
            typeof (error as { response?: { data?: { message?: unknown } } })
              .response?.data?.message === "string"
              ? (error as { response: { data: { message: string } } }).response
                  .data.message
              : error instanceof Error
                ? error.message
                : "Failed to load deposit details";
          toast.error(
            errorMessage,
          );
        }
      })();
    }
  }, [tokens, selectedTokenId]);

  const cryptoAmount =
    selectedTokenId !== -1 && tokens.length > 0
      ? (
          +amount /
          (tokens.find((token) => token.id === selectedTokenId)?.usdPrice || 1)
        ).toFixed(5)
      : "0.00000";
  const minimumLimit =
    tokens.find((token) => token.id === selectedTokenId)?.minimumLimit || 0;

  return loadingInfo ? (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Loader />
    </div>
  ) : (
    <div className="flex flex-col gap-4 py-4">
      <p className="text-sm text-[#b1bad3]">{t("address_confirm")}</p>
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
      <div className="rounded-md border border-[#2f4553] bg-[#0f212e] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#7eb6ff]">
          {t("WALLET ADDRESS")}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <p className="min-w-0 flex-1 truncate font-mono text-sm text-white">
            {wallet || t("Your wallet")}
          </p>
          <button
            type="button"
            onClick={copyWallet}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-[#1475e1] px-3 text-sm font-semibold text-white hover:bg-[#0f62c2]"
          >
            <Copy size={14} />
            {t("Copy", undefined, "Copy")}
          </button>
        </div>
      </div>
      <div>
        <label className="text-sm text-white">{t("DEPOSIT AMOUNT")}</label>
        <Input
          type="number"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          classNames={{
            inputWrapper:
              "mt-1 bg-[#0f212e] border border-[#2f4553] data-[hover=true]:bg-[#0f212e]",
            input: "text-white",
          }}
          startContent={
            <span className="text-[#b1bad3]">{DEFAULT_CURRENCY_SYMBOL}</span>
          }
        />
        <p className="mt-2 text-xs text-[#b1bad3]">
          {t("Deposit Amount")}: {cryptoAmount} {selectedCryptoType || ""}
          {" · "}
          {t("Minimum Limit")}: {minimumLimit} {selectedCryptoType || ""}
          {" · "}
          {t("Network Fee")}: {t("Unknown")}
        </p>
      </div>
    </div>
  );
}
