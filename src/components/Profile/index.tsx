import MainBalanceCard from "./MainBalanceCard";
import BonusBalanceCard from "./BonusBalanceCard";
import UserComponent from "./UserComponent";
import { Modal, ModalContent } from "@/components/common";
import AcceptPromoCode from "./AcceptPromoCode";
import { useCallback, useState, useEffect } from "preact/hooks";
import PersonalDetailsPage from "./myprofile/PersonalDetails";
import ChangePasswordPage from "./myprofile/ChangePassword";
import DepositPage from "./userbalance/DepositPage";
import WithdrawPage from "./userbalance/WithdrawPage";
import WithdrawStatusPage from "./userbalance/WithdrawStatusPage";
import TransactionHistoryPage from "./userbalance/TransactionHistoryPage";
import CasinoHistoryPage from "./bethistory/CasinoHistoryPage";
import SportsbookHistoryPage from "./bethistory/SportsbookHistoryPage";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import axios from "axios";
import { setAxiosAuthToken } from "@/api/instance";
import { userState } from "@/state/userState";
import { accessTokenState } from "@/state/accessTokenState";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { HiSpeakerphone } from "react-icons/hi";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { scrollToTop } from "@/helpers/scrollToTop";
import { BonusPage } from "./userbalance/BonusPage";
import { localeState } from "@/state/localeState";

import { RTL_LANGUAGES } from "@/config/constants";

interface IProfileComponentProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
  bonusId?: string;
}

const ProfileComponent = ({
  isOpen,
  onClose,
  defaultTab,
  bonusId,
}: IProfileComponentProps) => {
  const t = useTranslations("Profile");

  const isMobile = useMediaQuery(mobileMediaQuery);
  const [selectedTab, setSelectedTab] = useState(defaultTab || "");
  const location = useLocation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  useEffect(() => {
    if (isOpen && defaultTab) {
      setSelectedTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const BalanceManagementTab = useMemo(
    () => ({
      Title: t("Balance Management"),
      Children: [
        {
          TabKey: "/balance-management/deposit",
          Title: t("Deposit"),
          Content: <DepositPage />,
        },
        {
          TabKey: "/balance-management/withdraw",
          Title: t("Withdraw"),
          Content: <WithdrawPage />,
        },
        {
          TabKey: "/balance-management/transaction-history",
          Title: t("Transaction History"),
          Content: <TransactionHistoryPage />,
        },
        {
          TabKey: "/balance-management/withdraw-status",
          Title: t("Withdraw Status"),
          Content: <WithdrawStatusPage />,
        },
        {
          TabKey: "/balance-management/bonus",
          Title: t("Bonus"),
          Content: <BonusPage />,
        },
      ],
    }),
    [t]
  );

  const BonusesTab = useMemo(
    () => ({
      Title: t("Bonuses"),
      Children: [
        {
          TabKey: "/bonuses/demo1",
          Title: t("Demo 1"),
          Content: <div>Demo 1</div>,
        },
        {
          TabKey: "/bonuses/demo2",
          Title: t("Demo 2"),
          Content: <div>Demo 2</div>,
        },
      ],
    }),
    [t]
  );

  const MyProfileTab = useMemo(
    () => ({
      Title: t("My Profile"),
      Children: [
        {
          TabKey: "/my-profile/personal-details",
          Title: t("Personal Details"),
          Content: <PersonalDetailsPage />,
        },
        {
          TabKey: "/my-profile/change-password",
          Title: t("Change Password"),
          Content: <ChangePasswordPage />,
        },
        // {
        //   TabKey: "/my-profile/timeout",
        //   Title: t("Time-Out"),
        //   Content: <TimeoutPage />,
        // },
        // {
        //   TabKey: "/my-profile/verify-account",
        //   Title: t("Verify Account"),
        //   Content: <VerfyAccountPage />,
        // },
        // {
        //   TabKey: "/my-profile/two-step-authentication",
        //   Title: t("Two-Step Authentication"),
        //   Content: <TwoStepAuthenticationPage />,
        // },
      ],
    }),
    [t]
  );

  const BetHistoryTab = useMemo(
    () => ({
      Title: t("Bet History"),
      Children: [
        {
          TabKey: "/bet-history/demo",
          Title: t("Demo"),
          Content: <div>Demo</div>,
        },
      ],
    }),
    [t]
  );

  const MessagesTab = useMemo(
    () => ({
      Title: t("Messages"),
      Children: [
        {
          TabKey: "/messages/inbox",
          Title: t("Inbox"),
          Content: <div>Inbox</div>,
        },
        {
          TabKey: "/messages/sent",
          Title: t("Sent"),
          Content: <div>Sent</div>,
        },
        {
          TabKey: "/messages/new",
          Title: t("New"),
          Content: <div>Inbox</div>,
        },
      ],
    }),
    [t]
  );

  const RewardsTab = useMemo(
    () => ({
      Title: t("Rewards"),
      Children: [
        {
          TabKey: "/rewards/demo",
          Title: t("Demo"),
          Content: <div>Demo</div>,
        },
      ],
    }),
    [t]
  );

  const BetHistoryTabList = useMemo(
    () => ({
      Title: t("Bet History"),
      Children: [
        {
          TabKey: "/bet-history/casino",
          Title: t("Casino"),
          Content: <CasinoHistoryPage />,
        },
        {
          TabKey: "/bet-history/sports",
          Title: t("Sports"),
          Content: <SportsbookHistoryPage />,
        },
      ],
    }),
    [t]
  );

  const tabList = useMemo(() => {
    return [
      ...BalanceManagementTab.Children,
      ...MyProfileTab.Children,
      ...BetHistoryTabList.Children,
    ];
  }, [BalanceManagementTab, MyProfileTab, BetHistoryTabList]);

  const onModalClose = useCallback(() => {
    setSelectedTab("");
    onClose();
  }, [onClose]);

  const activeKey =
    !isMobile && !selectedTab ? "/my-profile/personal-details" : selectedTab;
  const activeTab = tabList.find((tab) => tab.TabKey === activeKey);

  const navSections = [
    { title: BalanceManagementTab.Title, items: BalanceManagementTab.Children },
    { title: MyProfileTab.Title, items: MyProfileTab.Children },
    { title: BetHistoryTabList.Title, items: BetHistoryTabList.Children },
  ];

  const onLogout = useCallback(async () => {
    try {
      userState.value = null;
      setAxiosAuthToken("");
      accessTokenState.value = null;
      onClose();

      if (location.path.includes("agent")) {
        location.route("/");
      }
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.error(ex.message);
      }
    }
  }, [userState, setAxiosAuthToken, accessTokenState, onClose]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onModalClose}
      placement="center"
      scrollBehavior="outside"
      classNames={{
        backdrop: "z-[100]",
        wrapper: "z-[100]",
      }}
    >
      <ModalContent
        dir={isRTL ? "rtl" : "ltr"}
        className="md:max-w-6xl! w-full flex flex-col md:flex-row bg-[#1a2c38] max-h-[85vh]! min-h-[70vh]! overflow-hidden border border-[#2f4553]"
      >
        {(!isMobile || (isMobile && !selectedTab)) && (
          <aside className="w-full md:w-[280px] md:shrink-0 min-h-0 flex flex-col overflow-y-auto scrollbar-hide bg-[#0f212e] border-b md:border-b-0 md:border-e border-[#2f4553]">
            <div className="flex flex-col gap-4 p-4">
              <UserComponent />
              <MainBalanceCard
                onDepositClick={() =>
                  setSelectedTab("/balance-management/deposit")
                }
                onWithdrawClick={() =>
                  setSelectedTab("/balance-management/withdraw")
                }
              />
              <BonusBalanceCard />
              {userState.value?.isCallGroup && (
                <a
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-[#b1bad3] hover:bg-[#213743] hover:text-white transition-colors"
                  href="/affiliates"
                  onClick={() => {
                    onClose();
                    scrollToTop();
                  }}
                >
                  <HiSpeakerphone className="text-lg" />
                  <span className="text-sm font-semibold">Referrals</span>
                </a>
              )}
            </div>

            <nav className="flex flex-col gap-1 px-3 pb-3">
              {navSections.map((section) => (
                <div key={section.title} className="flex flex-col">
                  <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#557086]">
                    {section.title}
                  </div>
                  {section.items.map((child) => {
                    const selected = activeKey === child.TabKey;
                    return (
                      <button
                        key={child.TabKey}
                        type="button"
                        onClick={() => setSelectedTab(child.TabKey)}
                        className={`text-start px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          selected
                            ? "bg-[#2f4553] text-white"
                            : "text-[#b1bad3] hover:bg-[#213743] hover:text-white"
                        }`}
                      >
                        {child.Title}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 p-4 border-t border-[#2f4553]">
              <AcceptPromoCode />
              <button
                type="button"
                onClick={onLogout}
                className="text-start px-3 py-2 rounded-md text-sm font-medium text-[#b1bad3] hover:bg-[#213743] hover:text-white transition-colors"
              >
                {t("Logout")}
              </button>
            </div>
          </aside>
        )}

        {((isMobile && selectedTab) || !isMobile) && (
          <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto scrollbar-hide p-4 md:p-6 pe-12">
            <div className="flex items-center gap-2 mb-4">
              {isMobile && selectedTab && (
                <button
                  type="button"
                  aria-label={t("Back", undefined, "Back")}
                  onClick={() => setSelectedTab("")}
                  className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md text-[#b1bad3] hover:bg-[#213743] hover:text-white"
                >
                  {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
              )}
              <h2 className="text-lg font-semibold text-white">
                {activeTab?.Title}
              </h2>
            </div>
            {activeTab?.Content}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProfileComponent;
