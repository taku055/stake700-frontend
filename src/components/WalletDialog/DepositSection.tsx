import { Input } from "@heroui/react";
import { useEffect, useRef, useCallback, useState } from "react";
import { tToken } from "@/types/tToken";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import { ChevronDown, Copy, Search } from "lucide-react";
import { userState } from "@/state/userState";
import { chainNames } from "@/config/chains";
import { useTranslations } from "@/context/I18nContext";
import { apiPredictDeposit } from "@/api/wallet/apiPredictDeposit";
import { depositPromoIdState, initDepositPromo } from "@/state/depositPromoState";
import { SOLANA_CHAIN_ID, TRON_CHAIN_ID } from "@/config/constants";
import { effect } from "@preact/signals-react";
import { toast } from "@/helpers/toast";
import { QRCodeSVG } from "qrcode.react";

export const DepositSection = () => {
  const blockchainPanelRef = useRef<HTMLDivElement | null>(null);
  const [selectedCryptoType, setSelectedCryptoType] = useState<string | null>(
    null
  );
  const [selectedTokenId, setSelectedTokenId] = useState(-1);
  const [selectedBlockchain, setSelectedBlockchain] = useState(0);
  const [wallet, setWallet] = useState("");
  const [showBlockchainSelector, setShowBlockchainSelector] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<tToken[]>([]);
  const confirmations = 1;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("DepositDialogFull");
  const tWallet = useTranslations("WalletBox");
  const tToast = useTranslations("ToastMessages");

  useEffect(() => {
    const dispose = effect(() => {
      (async () => {
        if (userState.value?.id) {
          try {
            setTokens(await apiGetTokenList(0));
          } catch (ex) {
            console.error(ex);
          }
        }
      })();
    });

    return () => {
      dispose();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        blockchainPanelRef.current &&
        !blockchainPanelRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowBlockchainSelector(false);
        setShowCryptoDropdown(false);
      }
    }

    if (showBlockchainSelector || showCryptoDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBlockchainSelector, showCryptoDropdown]);

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
    toast.info(tToast("info.wallet_address_copied"));
  };

  // Get token groups by symbol
  const tokenGroups = tokens
    .filter((token) => token.chainId !== 0)
    .reduce((acc, token) => {
      if (!acc[token.tokenSymbol]) {
        acc[token.tokenSymbol] = [];
      }
      acc[token.tokenSymbol].push(token);
      return acc;
    }, {} as Record<string, tToken[]>);

  // Get selected token data
  const selectedToken = tokens.find((t) => t.id === selectedTokenId);
  const selectedTokenGroup = selectedCryptoType ? tokenGroups[selectedCryptoType] : null;
  const selectedTokenData = selectedTokenGroup?.[0] || selectedToken;

  // Filter tokens for search
  const filteredTokenGroups = Object.entries(tokenGroups).filter(
    ([tokenSymbol, tokenGroup]) => {
      const token = tokenGroup[0];
      return (
        tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.tokenName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  const onSelectToken = useCallback(
    (tokenSymbol: string, tokenGroup: tToken[]) => {
      if (selectedCryptoType !== tokenSymbol) {
        setSelectedCryptoType(tokenSymbol);
        setSelectedBlockchain(tokenGroup[0]?.chainId || 0);
        setSelectedTokenId(tokenGroup[0]?.id || 0);

      }
      if (tokenGroup.length > 1) {
        setShowBlockchainSelector(true);
      }
      setShowCryptoDropdown(false);
      setSearchQuery("");
    },
    [selectedCryptoType]
  );

  const onSelectChain = (token: tToken) => {
    setSelectedBlockchain(token.chainId);
    setSelectedTokenId(token.id || 0);
    setShowBlockchainSelector(false);
  };

  // Tell the backend which coin (and bonus, if one is selected) the next deposit is for
  useEffect(() => initDepositPromo(), []);
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
            errorMessage
          );
        }
      })();
    }
  }, [tokens, selectedTokenId, promoId]);

  const minimumLimit = selectedToken?.minimumLimit || 0;
  const network = chainNames[selectedBlockchain] ?? "";

  return (
    <div className="flex flex-col p-4 gap-[16px]">
      {/* Currency Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-white/70 text-[14px]">{tWallet("Currency")}</label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setShowCryptoDropdown(!showCryptoDropdown);
              if (selectedCryptoType && tokenGroups[selectedCryptoType]?.length > 1) {
                setShowBlockchainSelector(false);
              }
            }}
            className="w-full h-[70px] flex items-center gap-3 px-4 py-3 bg-[var(--background-secondary)] border-[2px] border-[var(--background-secondary)] rounded-lg transition-colors"
          >
            {selectedTokenData?.tokenIcon && (
              <img
                src={selectedTokenData.tokenIcon}
                alt={selectedTokenData.tokenSymbol}
                className="w-8 h-8"
              />
            )}
            <div className="flex flex-col items-start flex-1">
              <span className="text-white text-[16px] font-medium">
                {selectedTokenData?.tokenSymbol || tWallet("Currency")}
              </span>
              <span className="text-white/60 text-[12px]">
                {selectedTokenData?.tokenName || ""}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-white/60 transition-transform ${showCryptoDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showCryptoDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border-[2px] border-[var(--background-secondary)] rounded-lg z-10 max-h-[300px] overflow-y-auto">
              {/* Search */}
              <div className="border-b h-[44px] rounded-lg bg-[var(--bar-background-color)] border-[var(--background-secondary)]">
                <div className="flex w-full items-center">
                  <Search className="w-4 h-4 text-white mx-3" />
                  <Input
                    type="text"
                    placeholder={tWallet("Search")}
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    classNames={{
                      inputWrapper:
                        "bg-[var(--bar-background-color)] bg-transparent focus:bg-transparent focus:bg-[var(--bar-background-color)] border-none rounded-none h-[44px]",
                      input: "text-white text-[14px]",
                    }}
                  />
                </div>
              </div>

              {/* Crypto List */}
              <div className="p-2">
                {filteredTokenGroups.map(([tokenSymbol, tokenGroup]) => {
                  const token = tokenGroup[0];
                  return (
                    <button
                      key={tokenSymbol}
                      type="button"
                      onClick={() => onSelectToken(tokenSymbol, tokenGroup)}
                      className="w-full h-[70px] flex items-center gap-3 px-4 py-3 bg-[var(--background-secondary)] border-[2px] border-[var(--background-secondary)] rounded-lg transition-colors mb-2 last:mb-0"
                    >
                      {token?.tokenIcon && (
                        <img
                          src={token.tokenIcon}
                          alt={tokenSymbol}
                          className="w-8 h-8"
                        />
                      )}
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-white text-[14px] font-medium">
                          {tokenSymbol}
                        </span>
                        <span className="text-white/60 text-[12px]">
                          {token?.tokenName || ""}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Blockchain Selector */}
          {selectedCryptoType &&
            showBlockchainSelector &&
            tokenGroups[selectedCryptoType]?.length > 1 && (
              <div
                ref={blockchainPanelRef}
                className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border-[2px] border-[var(--background-secondary)] rounded-lg z-20 p-3"
              >
                <label className="text-xs text-white/70 mb-2 block">
                  BLOCKCHAIN
                </label>
                <div className="flex flex-wrap gap-2">
                  {tokenGroups[selectedCryptoType].map((token) => (
                    <button
                      key={token.chainId}
                      type="button"
                      onClick={() => onSelectChain(token)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${selectedBlockchain === token.chainId
                        ? "bg-[var(--background-secondary)] text-white"
                        : "bg-[var(--bar-background-color)] text-white/60 hover:text-white"
                        }`}
                    >
                      {chainNames[token.chainId]}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Address Section */}
      <div className="flex flex-col gap-2">
        <label className="text-white/70 text-[14px]">{tWallet("Address")}</label>
        <div className="flex items-center rounded-lg border-none h-[44px] bg-[var(--background-secondary)]">
          <Input
            type="text"
            value={wallet}
            readOnly
            placeholder={t("Your wallet")}
            classNames={{
              inputWrapper:
                "flex-1 bg-transparent focus:bg-transparent focus:bg-[var(--background-secondary)] border-none h-[44px]",
              input: "text-white text-[14px] font-mono",
            }}
          />
          <button
            type="button"
            onClick={copyWallet}
            className="p-2 border-none cursor-pointer transition-colors"
            aria-label={tToast("aria.copy_address")}
          >
            <Copy className="w-5 h-5 text-white" />
          </button>
        </div>
        {wallet && selectedCryptoType && (
          <div className="space-y-1 text-xs leading-relaxed text-white/60">
            {network && <p>{t("send_only", { coin: selectedCryptoType, network })}</p>}
            {minimumLimit > 0 && (
              <p className="font-semibold text-white/80">
                {t("min_deposit", { amount: String(minimumLimit), coin: selectedCryptoType })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* QR Code */}
      {wallet && (
        <div className="flex justify-center">
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG value={wallet} width={120} height={120} />
          </div>
        </div>
      )}


      {/* divider */}
      <div className="h-px w-full bg-[var(--bar-background-color)]"></div>

      {/* Confirmation Status */}
      <div className="flex justify-between items-center">
        <span className="text-white text-[16px]">{tWallet("Credited")}</span>
        <span className="text-white text-[16px]">
          {confirmations} {tWallet("Confirmation")}
        </span>
      </div>
    </div>)
}