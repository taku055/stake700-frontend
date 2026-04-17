import { Button, Input } from "@heroui/react";
import { useEffect, useRef, useCallback, useState, useMemo } from "preact/hooks";
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
import { DepositSection } from "./DepositSection";
import { WithdrawSection } from "./WithdrawSection";

interface IDepositPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositPanel({ isOpen, onClose }: IDepositPanelProps) {
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
  const tToast = useTranslations("ToastMessages");
  const [selectedTab, setSelectedTab] = useState("deposit");
  const tabs = useMemo(() => [
    {
      key: "deposit",
      title: t("Deposit"),
      content: <DepositSection />,
    },
    {
      key: "withdraw",
      title: t("Withdraw"),
      content: <WithdrawSection />,
    },
  ], [t]);

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
    },
    [selectedCryptoType]
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
  }, [tokens, selectedTokenId]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
    >
      <ModalContent className="bg-[var(--background)] w-[500px] max-w-[500px] rounded-[8px] overflow-hidden">
        <div className="flex justify-between items-center w-full h-[60px] min-h-[60px] px-[16px]">
          <div className="flex items-center gap-[12px]">
            <img
              src={`${ASSET_BASE_URL}/images/icons/wallet.svg`}
              alt="Wallet Icon"
              className="w-[20px] h-[20px]"
            />
            <span className="text-white text-[18px] leading-[28px] font-semibold">
              {t("Wallet")}
            </span>
          </div>
        </div>

        <div className="w-full h-full flex flex-col max-h-[calc(85vh-60px)] overflow-y-auto">
          <div className="flex justify-between items-center w-full h-[60px] min-h-[60px] py-[10px] px-[16px]">
            <div className="flex w-full items-center gap-[12px]">
              <ChevronLeft className="w-5 h-5 text-white cursor-pointer" onClick={onClose} />
              <div className="flex items-center gap-[12px] w-full bg-[var(--bar-background-color)] rounded-full py-1 px-2 h-full">
                {/* <span className="text-white text-[18px] font-normal">{tabs.find((tab) => tab.key === selectedTab)?.title}</span> */}
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    size="sm"
                    color="primary"
                    className={`flex-1 py-3 text-white text-[18px] font-semibold rounded-full h-full ${selectedTab === tab.key ? "bg-[var(--background-secondary)]" : "bg-[var(--bar-background-color)]"}`}
                    onClick={() => setSelectedTab(tab.key)}
                  >
                    {tab.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {userState.value?.wantBonus === null ? (
            <div className="flex flex-col p-4">
              <div className="md:text-[14px] text-[12px] text-white/70">
                {t("first_deposit_bonus_question")}
                <br />
                {t("first_deposit_bonus_restriction")}{" "}
                <a
                  href="/privacy_policy/withdrawal_policy"
                  className="font-semibold text-white hover:underline"
                >
                  {t("terms_conditions_link")}
                </a>
                {t("for_details")}
              </div>

              <div className="flex justify-center mt-4 gap-4">
                <Button
                  size="sm"
                  color="success"
                  className="flex-1 rounded-lg"
                  onClick={() => onSetBonus(true)}
                  isLoading={loadingWantBonus}
                >
                  {t("yes_want_bonus")}
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  className="flex-1 rounded-lg"
                  onClick={() => onSetBonus(false)}
                  isLoading={loadingWantBonus}
                >
                  {t("no_dont_want_bonus")}
                </Button>
              </div>
            </div>
          ) : loadingInfo ? (
            <div className="w-full h-full flex items-center justify-center gap-2 p-4">
              <Loader />
            </div>
          ) : (
            <div>
              {tabs.find((tab) => tab.key === selectedTab)?.content}
            </div>
          )}
          {/* 2FA Security Section */}
          <div className="flex flex-col gap-3 p-4 bg-[var(--bar-background-color)]">
            <p className="text-white text-[16px] text-center">
              {t("Improve your account security with Two-Factor Authentication")}
            </p>
            <Button
              className="w-full text-white text-[16px] font-medium bg-[var(--background-secondary)] hover:bg-[var(--bar-background-color)]/80 h-[48px] rounded-lg border border-[var(--background-secondary)]"
              onPress={() => {
                console.log("Enable 2FA");
              }}
            >
              {t("Enable 2FA")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
