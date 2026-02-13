import { Button, Input, Card, CardBody } from "@heroui/react";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "preact/hooks";
import { ChevronDown } from "lucide-preact";
import { userState } from "@/state/userState";
import { toast } from "@/helpers/toast";
import { chainNames } from "@/config/chains";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import { tToken } from "@/types/tToken";
import { tFinancialActivitySummarized } from "@/api/account/apiProfileFinancialActivity";
import { apiProfileFinancialActivity } from "@/api/account/apiProfileFinancialActivity";
import { apiLazyWithdraw } from "@/api/wallet/apiLazyWithdraw";
import { isAddress } from "viem";
import { isValidSegwitAddress } from "@/helpers/isValidSegwitAddress";
import { isValidSolAddress } from "@/helpers/isValidSolAddress";
import axios from "axios";
import Loader from "../Loader";
import { useTranslations } from "@/context/I18nContext";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { effect } from "@preact/signals";
import { Search, EyeOff, Eye } from "lucide-preact";
import { ASSET_BASE_URL } from "@/config/constants";

interface ICryptoOption {
  symbol: string;
  name: string;
  icon: string;
}

export const WithdrawSection = () => {
  const blockchainPanelRef = useRef<HTMLDivElement | null>(null);
  const [selectedCryptoType, setSelectedCryptoType] = useState<string | null>(
    null
  );
  const [selectedCryptoId, setSelectedCryptoId] = useState(-1);
  const [selectedBlockchain, setSelectedBlockchain] = useState(0);
  const [amount, setAmount] = useState("0");
  const [wallet, setWallet] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showBlockchainSelector, setShowBlockchainSelector] = useState(false);
  const [financeSum, setFinanceSum] = useState<tFinancialActivitySummarized>();
  const [tokens, setTokens] = useState<tToken[]>([]);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmations, setConfirmations] = useState<number>(1);
  const t = useTranslations("DepositDialogFull");
  const tToast = useTranslations("ToastMessages");
  const [selectedTokenId, setSelectedTokenId] = useState(-1);


  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    (async () => {
      if (userState.value?.id) {
        try {
          const tokens = await apiGetTokenList(0);
          setTokens(tokens);
        } catch (ex) {
          console.error(ex);
        }
        (async () => {
          try {
            setLoadingInfo(true);
            const finance = await apiProfileFinancialActivity({});
            setFinanceSum(finance);
          } catch (ex) { }
          setLoadingInfo(false);
        })();
      }
    })();
  }, [userState.value?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        blockchainPanelRef.current &&
        !blockchainPanelRef.current.contains(event.target as Node)
      ) {
        setShowBlockchainSelector(false);
      }
    }

    if (showBlockchainSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBlockchainSelector]);

  const tokenGroups = tokens
    .filter((token) => token.chainId !== 0)
    .reduce((acc, token) => {
      if (!acc[token.tokenSymbol]) {
        acc[token.tokenSymbol] = [];
      }
      acc[token.tokenSymbol].push(token);
      return acc;
    }, {} as Record<string, tToken[]>);

  const selectedToken = tokens.find((t) => t.id === selectedTokenId);
  const selectedTokenGroup = selectedCryptoType ? tokenGroups[selectedCryptoType] : null;
  const selectedTokenData = selectedTokenGroup?.[0] || selectedToken;

  const filteredTokenGroups = Object.entries(tokenGroups).filter(
    ([tokenSymbol, tokenGroup]) => {
      const token = tokenGroup[0];
      return (
        tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.tokenName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  const [isWithdrawable, bonusPassed, wagerPassed, monthlyLimit, weeklyLimit] =
    useMemo(() => {
      if (!financeSum || !userState.value?.id) {
        return [false, false, false, false, false];
      }

      let bonusPassed = true;
      if (userState.value?.wantBonus && !userState.value?.bonusWithdrawPassed) {
        bonusPassed =
          (financeSum.totalResult.casinoBet || 0) >=
          financeSum.bonusDepositMoney * 40;
      }

      const wagerPassed = true;
      let monthly = true;
      let weekly = true;
      if (userState.value?.vipLevel < 6) {
        // wagerPassed =
        //   (financeSum.totalResult.casinoBet || 0) +
        //     (financeSum.totalResult.sportBet || 0) -
        //     (financeSum.totalResult.sportRollback || 0) >=
        //   (financeSum.totalResult.depositCrypto || 0) +
        //     (financeSum.totalResult.depositBonus || 0) +
        //     (financeSum.totalResult.depositManual || 0);
        weekly =
          (financeSum.weeklyResult.withdrawCrypto || 0) +
          (financeSum.weeklyResult.withdrawRequested || 0) <
          25000;
        monthly =
          (financeSum.monthlyResult.withdrawCrypto || 0) +
          (financeSum.monthlyResult.withdrawRequested || 0) <
          100000;
      }

      const isWithdrawable = bonusPassed && wagerPassed && monthly && weekly;
      return [isWithdrawable, bonusPassed, wagerPassed, monthly, weekly];
    }, [financeSum, userState.value?.id]);

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
    selectedCryptoType,
    userState.value?.cash,
    isWithdrawable,
    selectedBlockchain,
    userState.value?.vipLevel,
  ]);

  return (
    <div className="flex flex-col p-4 gap-[16px]">
      {/* Currency Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-white/70 text-[14px]">{t("Currency")}</label>
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
                {selectedTokenData?.tokenSymbol || t("Currency")}
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
                    placeholder={t("Search")}
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
          {/* <div className="h-[84px] w-full flex flex-col pt-[16px]">
            <label className="text-[#FFFFFF] flex text-[14px] leading-[20px] pb-[4px] h-[24px]">
              <span>{t("Password")}</span>
              <img src={`${BASE_URL}/images/icons/mark.svg`} alt="*" className="h-[20px] pl-[4px]" />
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              classNames={{
                inputWrapper: "bg-[var(--bar-background-color)] border-[2px] border-[var(--background-secondary)] rounded-sm h-[44px]",
                input: "text-white",
              }}
              endContent={
                showPassword ? (
                  <EyeOff
                    className="w-5 h-5 text-white transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <Eye
                    className="w-5 h-5 text-white transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )
              }
            />
          </div> */}
        </>
      )}



      {/* Direct Deposit Button */}
      <Button
        className="w-full h-[48px] min-h-[44px] text-white text-[16px] font-medium bg-[var(--green-color)] hover:bg-[var(--bar-background-color)]/80 rounded-lg border border-[var(--background-secondary)]"
        onPress={() => {onRequest();}}
      >
        <div className="flex items-center gap-2 w-full h-full py-2 px-4 justify-center">
          {t("Withdraw")}
        </div>
      </Button>

      {/* divider */}
      <div className="h-px w-full bg-[var(--bar-background-color)]"></div>

      {/* Confirmation Status */}
      <div className="flex justify-between items-center">
        <span className="text-white text-[16px]">{t("Credited")}</span>
        <span className="text-white text-[16px]">
          {confirmations} {t("Confirmation")}
        </span>
      </div>
    </div>)
}