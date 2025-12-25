
import { Button, Input, Card, CardBody } from "@heroui/react";
import { useEffect, useRef, useCallback, useState } from "preact/hooks";
import { tToken } from "@/types/tToken";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import { ChevronDown, Copy } from "lucide-preact";
import { userState } from "@/state/userState";
import { chainNames } from "@/config/chains";
import { apiSetWantBonus } from "@/api/account/apiSetWantBonus";
import Loader from "../Loader";
import { visaOpenedState } from "@/state/visaOpenedState";
import { useTranslations } from "@/context/I18nContext";
import { apiPredictDeposit } from "@/api/wallet/apiPredictDeposit";
import { DEFAULT_CURRENCY_SYMBOL, SOLANA_CHAIN_ID, TRON_CHAIN_ID } from "@/config/constants";
import { effect } from "@preact/signals";
import { toast } from "@/helpers/toast";

export default function DepositPanel() {
  const blockchainPanelRef = useRef<HTMLDivElement | null>(null);
  const [selectedCryptoType, setSelectedCryptoType] = useState<string | null>(
    null
  );
  const [selectedTokenId, setSelectedTokenId] = useState(-1);
  const [selectedBlockchain, setSelectedBlockchain] = useState(0);
  const [amount, setAmount] = useState("0");
  const [wallet, setWallet] = useState("");
  const [showBlockchainSelector, setShowBlockchainSelector] = useState(false);
  const [tokens, setTokens] = useState<tToken[]>([]);
  const [loadingWantBonus, setLoadingWantBonus] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const t = useTranslations("DepositDialogFull");

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
      toast.error("Please login first");
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
    [userState.value?.id]
  );

  const copyWallet = () => {
    if (wallet === "") return;
    navigator.clipboard.writeText(wallet);
    toast.info("Wallet address copied to clipboard!");
  };

  const onSelectToken = useCallback(
    (tokenSymbol: string, tokenGroup: tToken[]) => {
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
        setSelectedTokenId(tokenGroup[0]?.id || 0);
      }
      setShowBlockchainSelector(true);
    },
    [selectedCryptoType, showBlockchainSelector]
  );

  const onSelectChain = (token: tToken) => {
    setSelectedBlockchain(token.chainId);
    setSelectedTokenId(token.id || 0);
    setShowBlockchainSelector(false);
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
    <>
      {userState.value?.wantBonus === null ? (
        <div className="flex flex-col">
          <div className="md:text-[14px] text-[12px]">
            You are doing first deposit now. Do you want to get bonus for the
            first deposit?
            <br />
            There are some restrictions in withdrawing if you choose to get
            bonus. Please check{" "}
            <a
              href="/privacy_policy/withdrawal_policy"
              className="font-semibold text-white hover:underline"
            >
              Terms and Conditions for New Depositors
            </a>
            for details.
          </div>

          <div className="flex justify-center mt-4 gap-4">
            <Button
              size="sm"
              color="success"
              className="flex-1 rounded-full"
              onClick={() => onSetBonus(true)}
              isLoading={loadingWantBonus}
            >
              Yes, I want bonus
            </Button>
            <Button
              size="sm"
              color="danger"
              className="flex-1 rounded-full"
              onClick={() => onSetBonus(false)}
              isLoading={loadingWantBonus}
            >
              No, I don&#39;t want bonus
            </Button>
          </div>
        </div>
      ) : loadingInfo ? (
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
                      onPress={() => onSelectToken(tokenSymbol, tokenGroup)}
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
                          className="absolute top-full left-0 mt-2 z-20 bg-[#21211C] p-3 rounded-lg shadow-lg border border-white/10 w-max"
                        >
                          <label className="text-xs text-gray-300">
                            BLOCKCHAIN
                          </label>
                          <div className="flex flex-col md:flex-row gap-2 mt-2">
                            {tokenGroup.map((token) => (
                              <div
                                key={token.chainId}
                                className={`px-2.5 py-1 rounded-lg cursor-pointer text-xs font-medium ${selectedBlockchain === token.chainId
                                  ? "bg-teal-500 text-white"
                                  : "bg-[#2d324a] text-gray-300"
                                  }`}
                                onClick={() => onSelectChain(token)}
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
                  startContent={<span className="text-gray-400">{DEFAULT_CURRENCY_SYMBOL}</span>}
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
                    <Copy
                      className="cursor-pointer"
                      onClick={() => copyWallet()}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
