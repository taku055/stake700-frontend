import { useState, useMemo } from "preact/hooks";
import { Modal, ModalContent } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import Overview from "./Overview";
import Rewards from "./Rewards";
import { ASSET_BASE_URL } from "@/config/constants";

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
    >
      <ModalContent className="bg-[var(--background)] w-[500px] max-w-[500px] rounded-[8px] max-h-[80vh] overflow-hidden" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div className="flex justify-between items-center w-full h-[60px] min-h-[60px] py-[10px] px-[16px] border-b border-[#FFFFFF0A]">
          <div className="flex items-center gap-[12px]">
            <img src={`${ASSET_BASE_URL}/images/icons/vip-club.svg`} alt="vip" className="w-5 h-5" />
            <span className="text-white text-[18px] leading-[28px] font-semibold">{t("VIP")}</span>
          </div>
        </div>

        <div className="flex flex-col w-full overflow-y-auto scrollbar-hide">
          {/* Tab Navigation */}
          <div className="flex h-[48px] mx-4 mt-4 items-center border-none gap-2 p-[6px] rounded-full bg-[var(--bar-background-color)]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTab(tab.key)}
                className={`flex-1 items-center justify-center border-none h-[40px] rounded-full text-[16px] leading-[24px] font-semibold transition-colors ${selectedTab === tab.key
                    ? "text-white bg-[var(--background-secondary)]"
                    : "text-white/60 hover:text-white/80"
                  }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex flex-col max-h-[calc(80vh-120px)]">
            {currentTab.content}
          </div>
        </div>

      </ModalContent>
    </Modal>
  );
};

export default VipClub;
