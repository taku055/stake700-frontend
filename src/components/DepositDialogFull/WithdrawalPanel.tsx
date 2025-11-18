
import { Button, Input, Card, CardBody } from "@heroui/react";
import { useEffect, useRef, useState, useMemo, useCallback } from "preact/hooks";
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

export default function WithdrawalPanel() {
  const blockchainPanelRef = useRef<HTMLDivElement | null>(null);
  const [selectedCryptoType, setSelectedCryptoType] = useState<string | null>(
    null
  );
  const [selectedCryptoId, setSelectedCryptoId] = useState(-1);
  const [selectedBlockchain, setSelectedBlockchain] = useState(0);
  const [amount, setAmount] = useState("0");
  const [wallet, setWallet] = useState("");
  const [showBlockchainSelector, setShowBlockchainSelector] = useState(false);
  const [financeSum, setFinanceSum] = useState<tFinancialActivitySummarized>();
  const [tokens, setTokens] = useState<tToken[]>([]);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("DepositDialogFull");

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


  const [isWithdrawable, bonusPassed, wagerPassed, monthlyLimit, weeklyLimit] =
    useMemo(() => {
      if (!financeSum || !userState.value?.id) {
        return [false, false, false, false, false];
      }

      let bonusPassed = true;
      if (userState.value?.wantBonus && !userState.value?.bonusWithdrawPassed) {
        bonusPassed =
          (financeSum.totalResult.casinoBet || 0) >=
          financeSum.bonusDepositMoney * 40 ||
          (financeSum.totalResult.sportBet || 0) -
          (financeSum.totalResult.sportRollback || 0) >=
          userState.value?.tekioBonus * 8;
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

  const onRequest = useCallback(async () => {
    if (!financeSum) {
      return;
    }

    if (selectedCryptoId < 0) {
      toast.error("Please select the balance you want to withdraw");
      return;
    }

    if (!wallet) {
      toast.error("Please input the address");
      return;
    }

    if (!isWithdrawable) {
      toast.error(
        "You are not able to withdraw. Please check privacy and policy now."
      );
      return;
    }

    if (selectedBlockchain === 8086 && !isValidSegwitAddress(wallet)) {
      toast.error("Please input the valid address");
      return;
    } else if (selectedBlockchain === 900 && !isValidSolAddress(wallet)) {
      toast.error("Please input the valid address");
      return;
    } else if (
      selectedBlockchain !== 8086 &&
      selectedBlockchain !== 900 &&
      !isAddress(wallet)
    ) {
      toast.error("Please input the valid address");
      return;
    }

    if (+amount < 1 || +amount > (userState.value?.cash || 0)) {
      toast.error("Please input the valid withdraw amount");
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
        toast.error(
          "You have exceeded the withdrawal amount. Please check the policy."
        );
        return;
      }
    }

    setLoading(true);
    try {
      await apiLazyWithdraw(selectedBlockchain, wallet, +amount);
      toast.success("Successfully requested");
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.log(ex.response?.data.message);
        if (ex.response?.data.message === "low.balance") {
          toast.error("You don't have enough balance to witdhraw");
        } else if (ex.response?.data.message === "low.balance.requests") {
          toast.error(
            "You don't have enough balance to witdhraw. Please check the withdraw requests you submitted"
          );
        } else {
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Something went wrong");
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
    <>
      {loadingInfo ? (
        <div className="w-full min-h-[300px] flex items-center justify-center gap-2 p-2 md:p-6 md:gap-6 md:pt-15">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 md:p-6 md:gap-6 md:pt-15">
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-md font-semibold text-white">
              {t("Crypto Withdrawals")}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(
                tokens
                  .filter((token) => token.chainId !== 0)
                  .reduce((acc, token) => {
                    if (!acc[token.tokenSymbol]) {
                      acc[token.tokenSymbol] = [];
                    }
                    acc[token.tokenSymbol].push(token);
                    return acc;
                  }, {} as Record<string, tToken[]>)
              ).map(([tokenSymbol, tokenGroup]) => (
                <div key={tokenSymbol} className="relative">
                  <Card
                    isPressable
                    className={`p-0 flex items-center justify-between md:h-[59px] h-[56px] md:w-[150px] w-[120px]  bg-[#21211C] hover:bg-[#2d324a] ${selectedCryptoType === tokenSymbol
                      ? "border border-[#D6B33E]"
                      : "border border-transparent"
                      }`}
                    onPress={() => {
                      if (
                        selectedCryptoType === tokenSymbol &&
                        showBlockchainSelector === true
                      ) {
                        setShowBlockchainSelector(false);
                        return;
                      }
                      if (selectedCryptoType !== tokenSymbol) {
                        setSelectedCryptoType(tokenSymbol);
                        setSelectedBlockchain(tokenGroup[0]?.chainId || 0);
                        setSelectedCryptoId(tokenGroup[0]?.id || 0);
                      }
                      setShowBlockchainSelector(true);
                    }}
                  >
                    <CardBody className="flex flex-row items-center gap-2 text-sm font-medium text-white">
                      {tokenGroup[0]?.tokenIcon && (
                        <img
                          src={tokenGroup[0].tokenIcon}
                          alt={tokenSymbol}
                          width="27px"
                          height="27px"
                        />
                      )}
                      {tokenSymbol}
                      {tokenGroup.length > 1 && (
                        <ChevronDown className="ml-auto" />
                      )}
                    </CardBody>
                  </Card>
                  {selectedCryptoType === tokenSymbol &&
                    showBlockchainSelector &&
                    tokenGroup.length > 1 && (
                      <div
                        ref={blockchainPanelRef}
                        className="absolute top-full left-0 mt-2 z-20 bg-[#1e2238] p-3 rounded-lg shadow-lg border border-white/10 w-max"
                      >
                        <label className="text-xs text-gray-300">
                          BLOCKCHAIN
                        </label>
                        <div className="flex flex-col md:flex-row gap-2 mt-2">
                          {tokenGroup.map((token) => (
                            <div
                              key={token.id}
                              className={`px-2.5 py-1 rounded-lg cursor-pointer text-xs font-medium ${selectedBlockchain === token.chainId
                                ? "bg-teal-500 text-white"
                                : "bg-[#2d324a] text-gray-300"
                                }`}
                              onClick={() => {
                                setSelectedBlockchain(token.chainId);
                                setSelectedCryptoId(token.id || 0);
                                setShowBlockchainSelector(false);
                              }}
                            >
                              {chainNames[token.chainId]}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:col-span-2 bg-[#21211C] border-1 border-[#515778] rounded-xl p-6 space-y-6">
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
                startContent={<span className="text-gray-400">{DEFAULT_CURRENCY_SYMBOL}</span>}
              />
              <p className="text-xs text-gray-400 mt-1">
                {t("Withdraw Amount")}:{" "}
                {(
                  +amount /
                  tokens.filter((token) => token.id === selectedCryptoId)[0]
                    ?.usdPrice
                ).toFixed(5)}
                {selectedCryptoType}
                <br />
                {t("Minimum Withdraw")}:{" "}
                {
                  tokens.filter((token) => token.id === selectedCryptoId)[0]
                    ?.minimumLimit
                }
                {selectedCryptoType}
                <br />
                {t("Network Fee")}: {t("Unknown")}
              </p>
            </div>

            <div>
              <label className="text-sm">
                {t("DESTINATION WALLET ADDRESS")}
              </label>
              <Input
                placeholder={t("wallet_placeholder")}
                value={wallet}
                onChange={(e: any) => setWallet(e.target.value)}
                classNames={{
                  inputWrapper: "bg-[#D9D9D91C] border border-[#515151]",
                  input: "text-white",
                }}
                className="mt-4px"
              />
            </div>

            <Button
              className="btn btn-primary flex justify-center"
              isLoading={loading}
              onClick={onRequest}
            >
              {t("Initiate Withdrawal")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
