import { Button, Input } from "@heroui/react";
import { useEffect, useRef, useCallback, useState } from "preact/hooks";
import { tToken } from "@/types/tToken";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import { ChevronDown, ChevronLeft, Copy, RefreshCw, Search } from "lucide-preact";
import { userState } from "@/state/userState";
import { chainNames } from "@/config/chains";
import { apiSetWantBonus } from "@/api/account/apiSetWantBonus";
import Loader from "../Loader";
import { visaOpenedState } from "@/state/visaOpenedState";
import { useTranslations } from "@/context/I18nContext";
import { apiPredictDeposit } from "@/api/wallet/apiPredictDeposit";
import { DEFAULT_CURRENCY_SYMBOL, SOLANA_CHAIN_ID, TRON_CHAIN_ID, ASSET_BASE_URL } from "@/config/constants";
import { effect } from "@preact/signals";
import { toast } from "@/helpers/toast";
import { QRCodeSVG } from "qrcode.react";
import { Modal, ModalContent } from "@/components/common";

interface ICryptoOption {
  symbol: string;
  name: string;
  icon: string;
}

export const DepositSection = () => {
  const blockchainPanelRef = useRef<HTMLDivElement | null>(null);
  const [selectedCryptoType, setSelectedCryptoType] = useState<string | null>(
    null
  );
  const [selectedTokenId, setSelectedTokenId] = useState(-1);
  const [selectedBlockchain, setSelectedBlockchain] = useState(0);
  const [amount, setAmount] = useState("0");
  const [wallet, setWallet] = useState("");
  const [showBlockchainSelector, setShowBlockchainSelector] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<tToken[]>([]);
  const [loadingWantBonus, setLoadingWantBonus] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [confirmations, setConfirmations] = useState<number>(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("DepositDialogFull");
  const tWallet = useTranslations("WalletBox");
  const tToast = useTranslations("ToastMessages");

  useEffect(() => {
    const dispose = effect(() => {
      (async () => {
        if (userState.value?.id) {
          try {
            setLoadingInfo(true);
            const tokens1 = await apiGetTokenList(0);
            setTokens(tokens1);
          } catch (ex) {
            console.error(ex);
          } finally {
            setLoadingInfo(false);
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

  const openVisaDeposit = async () => {
    // if (!userState.value?.id) {
    //   toast.error("Please login first");
    //   return;
    // }

    // visaOpenedState.value = true;
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
    [userState.value?.id]
  );

  const copyWallet = () => {
    if (wallet === "") return;
    navigator.clipboard.writeText(wallet);
    toast.info(tToast("info.wallet_address_copied"));
  };

  const handleRefreshAddress = () => {
    // Refresh address logic - can be implemented if needed
    console.log("Refreshing address...");
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
      console.log("tokenSymbol", tokenSymbol);
      console.log("tokenGroup", tokenGroup);
    },
    [selectedCryptoType]
  );

  const onSelectChain = (token: tToken) => {
    setSelectedBlockchain(token.chainId);
    setSelectedTokenId(token.id || 0);
    setShowBlockchainSelector(false);
    console.log("token onSelectChain", token);
  };

  useEffect(() => {
    const token = tokens.find((t) => t.id === selectedTokenId);
    if (token) {
      (async () => {
        try {
          const res = await apiPredictDeposit(
            token.chainId,
            token.tokenAddress
          );
        } catch (error) {
          console.error("Error predicting deposit:", error);
        }
      })();
    }
  }, [tokens, selectedTokenId]);
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

      {/* Deposit Amount */}
      {selectedTokenId !== -1 && (
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
          {/* <div className="text-xs text-white/60 mt-1">
                <div>
                  {t("Deposit Amount")}:{" "}
                  {selectedTokenId !== -1 && tokens.length > 0
                    ? `${(
                        +amount /
                        (tokens.find((token) => token.id === selectedTokenId)
                          ?.usdPrice || 1)
                      ).toFixed(5)} ${selectedCryptoType}`
                    : "0.00000"}
                </div>
                <div>
                  {t("Minimum Limit")}:{" "}
                  {tokens.find((token) => token.id === selectedTokenId)
                    ?.minimumLimit || 0}{" "}
                  {selectedCryptoType || ""}
                </div>
                <div>
                  {t("Network Fee")}: {t("Unknown")}
                </div>
              </div> */}
        </div>
      )}

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
            onClick={handleRefreshAddress}
            className="p-2 border-none cursor-pointer transition-colors"
            aria-label={tToast("aria.refresh_address")}
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
          <button
            type="button"
            onClick={copyWallet}
            className="p-2 border-none cursor-pointer transition-colors"
            aria-label={tToast("aria.copy_address")}
          >
            <Copy className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* QR Code */}
      {wallet && (
        <div className="flex justify-center">
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG value={wallet} width={120} height={120} />
          </div>
        </div>
      )}

      {/* Or Separator */}
      {/* <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[var(--bar-background-color)]"></div>
        <span className="text-white leading-[24px] text-[16px]">{tWallet("Or")}</span>
        <div className="flex-1 h-px bg-[var(--bar-background-color)]"></div>
      </div> */}

      {/* Direct Deposit Button */}
      {/* <Button
        className="w-full h-[48px] min-h-[44px] text-white text-[16px] font-medium bg-[var(--background-secondary)] hover:bg-[var(--bar-background-color)]/80 rounded-lg border border-[var(--background-secondary)]"
        onPress={() => {
          openVisaDeposit();
        }}
      >
        <div className="flex items-center gap-2 w-full h-full py-2 px-4 justify-center">
          {tWallet("Direct Deposit")}
          <img
            src={`${BASE_URL}/images/icons/binance.png`}
            alt="binance"
            className="w-[18px] h-[18px]"
          />
          <img
            src={`${BASE_URL}/images/icons/coin_base.png`}
            alt="coinbase"
            className="w-[18px] h-[18px]"
          />
          <img
            src={`${BASE_URL}/images/icons/meta_mask.png`}
            alt="metamask"
            className="w-[18px] h-[18px]"
          />
          <img
            src={`${BASE_URL}/images/icons/trust_wallet.png`}
            alt="trustwallet"
            className="w-[18px] h-[18px]"
          />
          <span className="ml-2 text-white/60 text-[14px]">+300</span>
        </div>
      </Button> */}

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