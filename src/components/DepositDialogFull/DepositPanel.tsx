import { useEffect, useCallback, useState, useMemo } from "react";
import { tToken } from "@/types/tToken";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import { Copy } from "lucide-react";
import { userState } from "@/state/userState";
import { CryptoCurrencySelects } from "./CryptoCurrencySelects";
import Loader from "../Loader";
import { useTranslations } from "@/context/I18nContext";
import { apiPredictDeposit } from "@/api/wallet/apiPredictDeposit";
import { depositPromoIdState } from "@/state/depositPromoState";
import { chainNames } from "@/config/chains";
import { SOLANA_CHAIN_ID, TRON_CHAIN_ID } from "@/config/constants";
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
  const [wallet, setWallet] = useState("");
  const [tokens, setTokens] = useState<tToken[]>([]);
  const [selectionInitialized, setSelectionInitialized] = useState(false);
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

  // Tell the backend which coin and bonus the next deposit is for; re-sent
  // when the player applies or removes a promo code.
  const promoId = depositPromoIdState.value;
  useEffect(() => {
    const token = tokens.find((t) => t.id === selectedTokenId);
    if (token) {
      (async () => {
        try {
          await apiPredictDeposit(token.chainId, token.tokenAddress, promoId ?? "");
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
  }, [tokens, selectedTokenId, promoId]);

  const minimumLimit =
    tokens.find((token) => token.id === selectedTokenId)?.minimumLimit || 0;
  const network = chainNames[selectedBlockchain] ?? "";

  return loadingInfo ? (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Loader />
    </div>
  ) : (
    <div className="flex flex-col gap-4 py-4">
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
        {wallet && selectedCryptoType && (
          <div className="mt-3 space-y-1 border-t border-[#2f4553] pt-3 text-xs leading-relaxed text-[#b1bad3]">
            {network && <p>{t("send_only", { coin: selectedCryptoType, network })}</p>}
            {minimumLimit > 0 && (
              <p className="font-semibold text-white/80">
                {t("min_deposit", { amount: String(minimumLimit), coin: selectedCryptoType })}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
