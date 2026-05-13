import { Input } from "@heroui/react";
import { useEffect, useCallback, useState, useMemo } from "preact/hooks";
import { tToken } from "@/types/tToken";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import { Copy } from "lucide-preact";
import { userState } from "@/state/userState";
import { CryptoCurrencySelects } from "./CryptoCurrencySelects";
import { apiSetWantBonus } from "@/api/account/apiSetWantBonus";
import Loader from "../Loader";
import { visaOpenedState } from "@/state/visaOpenedState";
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

  const openVisaDeposit = async () => {
    if (!userState.value?.id) {
      toast.error(tToast("error.login_first"));
      return;
    }

    visaOpenedState.value = true;
  };

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
            {t("Crypto Payments")}
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
        {/* Right Side: Deposit Form */}
        <div className="md:col-span-2 bg-[#21211C] border-1 border-[#515778] rounded-xl p-6 space-y-6">
          <div>
            <label className="text-sm">{t("DEPOSIT AMOUNT")}</label>
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
              {t("Deposit Amount")}:
              {selectedTokenId !== -1 && tokens.length > 0
                ? `${(
                    +amount /
                    (tokens.find((token) => token.id === selectedTokenId)
                      ?.usdPrice || 1)
                  ).toFixed(5)} ${selectedCryptoType}`
                : "0.00000"}
              <br />
              {t("Minimum Limit")}:
              {tokens.find((token) => token.id === selectedTokenId)
                ?.minimumLimit || 0}{" "}
              {selectedCryptoType || ""}
              <br />
              {t("Network Fee")}: {t("Unknown")}
            </p>
          </div>

          <div>
            <label className="text-sm">{t("WALLET ADDRESS")}</label>
            <Input
              placeholder={t("Your wallet")}
              value={wallet}
              readOnly
              classNames={{
                inputWrapper: "bg-[#D9D9D91C] border border-[#515151]",
                input: "text-white cursor-default",
              }}
              onClick={() => copyWallet()}
              className="mt-[4px]"
              endContent={
                <Copy className="cursor-pointer" onClick={() => copyWallet()} />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
