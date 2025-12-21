import { useState, useMemo } from "preact/hooks";
import { Modal, ModalContent } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import Overview from "./Overview";
import Rewards from "./Rewards";

interface IVipClubProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

const VipClub = ({ isOpen, onClose, defaultTab = "overview" }: IVipClubProps) => {
  const t = useTranslations("VipClub");
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab);

  const tabs = useMemo(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        content: <Overview />,
      },
      {
        key: "rewards",
        title: t("Rewards"),
        content: <Rewards />,
      },
    ],
    [t]
  );

  const currentTab = tabs.find((tab) => tab.key === selectedTab) || tabs[0];

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      classNames={{
        backdrop: "z-[10000000]",
        wrapper: "z-[10000000]",
      }}
    >
      <ModalContent className="bg-[var(--background)] w-[500px] max-w-[500px] rounded-[8px] overflow-hidden max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center w-full h-[60px] min-h-[60px] py-[10px] px-[16px] border-b border-[#FFFFFF0A]">
          <div className="flex items-center gap-[12px]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L12.09 7.26L18 8.27L14 12.14L14.91 18.02L10 15.77L5.09 18.02L6 12.14L2 8.27L7.91 7.26L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
            <span className="text-white text-[18px] leading-[28px] font-semibold">{t("VIP")}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex h-[56px] mx-4 mt-4 items-center border-none gap-2 p-[6px] rounded-full bg-[var(--bar-background-color)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedTab(tab.key)}
              className={`flex-1 items-center justify-center border-none h-[44px] rounded-full text-[16px] leading-[24px] font-semibold transition-colors ${
                selectedTab === tab.key
                  ? "text-white bg-[var(--background-secondary)]"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex flex-col overflow-y-auto max-h-[calc(80vh-120px)]">
          {currentTab.content}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default VipClub;
