import MainBalanceCard from "./MainBalanceCard";
import BonusBalanceCard from "./BonusBalanceCard";
import UserComponent from "./UserComponent";
import UserVerifyBox from "./UserVerifyBox";
import { Modal, ModalContent } from "@/components/common";
import LoyaltyPoints from "./LoyaltyPoints";
import ExpandableCard, { ChildTab } from "./ExpandableCard";
import { Gear, User, History, Exit } from "../icons";
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
          Content: <DepositPage bonusId={bonusId} />,
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
    if (isMobile && selectedTab !== "") {
      setSelectedTab("");
    } else {
      onClose();
    }
  }, [selectedTab]);

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
      scrollBehavior="inside"
      classNames={{
        backdrop: "z-[100]",
        wrapper: "z-[100]",
      }}
    >
      <ModalContent className={`md:max-w-[1280px]! md:min-w-[1000px]! w-full flex flex-col ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} bg-[var(--background)] max-h-[80vh]! min-h-[60vh]!`}>
        {(!isMobile || (isMobile && !selectedTab)) && (
          <div className={`w-full flex flex-col overflow-y-auto md:max-w-[320px]! gap-3 scrollbar-hide p-4 bg-[var(--bar-background-color)] ${isRTL ? 'md:border-l md:border-gray-700' : 'md:border-r md:border-gray-700'}`}>
            <div className="flex flex-col gap-3">
              <UserComponent />
              {/* <UserVerifyBox
                onClick={() => setSelectedTab("/my-profile/verify-account")}
              /> */}
              <MainBalanceCard
                onDepositClick={() =>
                  setSelectedTab("/balance-management/deposit")
                }
                onWithdrawClick={() =>
                  setSelectedTab("/balance-management/withdraw")
                }
              />
              <BonusBalanceCard />
              {/* <LoyaltyPoints
                onClick={() => setSelectedTab("/loyalty-points")}
              /> */}
              {userState.value?.isCallGroup && (
                <a
                  className="flex bg-yellow-600 gap-3 p-4 rounded-md items-center"
                  href="/affiliates"
                  onClick={() => {
                    onClose();
                    scrollToTop();
                  }}
                >
                  <HiSpeakerphone className="text-3xl" />
                  <span>Referrals</span>
                </a>
              )}
              <ExpandableCard
                title={t("Balance Management")}
                icon={<Gear />}
                defaultExpanded={true}
              >
                <div className="flex flex-col">
                  {BalanceManagementTab.Children.map((child) => (
                    <ChildTab
                      key={child.TabKey}
                      selected={selectedTab === child.TabKey}
                      title={child.Title}
                      onClick={() => setSelectedTab(child.TabKey)}
                    />
                  ))}
                </div>
              </ExpandableCard>
              {/* <ExpandableCard title="Bonuses" icon={<Bonus />} defaultExpanded={true}>
                  <div className="flex flex-col">
                    {
                      BonusesTab.Children.map((child) => (
                        <ChildTab selected={selectedTab === child.TabKey} title={child.Title} onClick={() => setSelectedTab(child.TabKey)} />
                      ))
                    }
                  </div>
                </ExpandableCard> */}
              <ExpandableCard
                title={t("My Profile")}
                icon={<User />}
                defaultExpanded={true}
              >
                <div className="flex flex-col">
                  {MyProfileTab.Children.map((child) => (
                    <ChildTab
                      key={child.TabKey}
                      selected={selectedTab === child.TabKey}
                      title={child.Title}
                      onClick={() => setSelectedTab(child.TabKey)}
                    />
                  ))}
                </div>
              </ExpandableCard>
              <ExpandableCard
                title={BetHistoryTabList.Title}
                icon={<History />}
                defaultExpanded={true}
              >
                <div className="flex flex-col">
                  {BetHistoryTabList.Children.map((child) => (
                    <ChildTab
                      key={child.TabKey}
                      selected={selectedTab === child.TabKey}
                      title={child.Title}
                      onClick={() => setSelectedTab(child.TabKey)}
                    />
                  ))}
                </div>
              </ExpandableCard>
              {/* <ExpandableCard title="Messages" icon={<Message />} defaultExpanded={true}>
              <div className="flex flex-col">
                {
                  MessagesTab.Children.map((child) => (
                    <ChildTab selected={selectedTab === child.TabKey} title={child.Title} onClick={() => setSelectedTab(child.TabKey)} />
                  ))
                }
              </div>
            </ExpandableCard>
            <ExpandableCard title="Rewards" icon={<Reward />} defaultExpanded={true}>
              <div className="flex flex-col">
                {
                  RewardsTab.Children.map((child) => (
                    <ChildTab selected={selectedTab === child.TabKey} title={child.Title} onClick={() => setSelectedTab(child.TabKey)} />
                  ))
                }
              </div>
            </ExpandableCard> */}
              <AcceptPromoCode />
              <ExpandableCard
                title={t("Logout")}
                icon={<Exit />}
                defaultExpanded={false}
                showIcon={false}
                onToggle={onLogout}
              />
            </div>
          </div>
        )}

        {((isMobile && selectedTab) || !isMobile) && (
          <div className={`w-full flex flex-col overflow-y-auto gap-3 scrollbar-hide ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {
              tabList.find(
                (tab) =>
                  tab.TabKey ===
                  (!isMobile && !selectedTab
                    ? "/my-profile/personal-details"
                    : selectedTab)
              )?.Content
            }
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProfileComponent;
