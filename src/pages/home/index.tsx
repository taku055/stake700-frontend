import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { useLocation } from "preact-iso";
import { Button } from "@heroui/react";
import { EmblaBanner } from "./components/EmblaBanner";
import { Search } from "lucide-preact";
import { Input } from "@/components/common";
import { useState } from "preact/hooks";
import TrendingGamesPanel from "@/components/TrendingGamesPanel";
import TrendingSports from "@/components/TrendingSports";
import PromotionsGroup from "@/components/PromotionsGroup";
import EmulateBetting from "@/components/EmulateBetting";
import FAQ from "@/pages/faq";
import { searchWidgetState } from "@/state/searchWidgetState";
import { Select, SelectItem } from "@heroui/react";
import VipCard from "@/components/Vip-club/VipCard";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";

export default function PageComponent() {
  const location = useLocation();
  if (userState.value?.role === "SUPERAGENT") {
    location.route("/superagent");
    return null;
  }

  if (userState.value?.role === "AREA_MANAGER") {
    location.route("/area_manager");
    return null;
  }

  if (userState.value?.role === "AGENT") {
    location.route("/agent");
    return null;
  }

  const t = useTranslations("HomePage");
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col z-0 items-center justify-center w-full font-weight-300 gap-6 ">
      <div className="flex flex-col">
        {isMobile && (
          <VipCard />
        )}
        <EmblaBanner />
      </div>

      <div className="flex flex-col max-w-[1200px] w-full gap-6">
        <div className="flex w-full h-[52px] px-3 md:px-0 ">
          <div className="flex w-full h-full bg-[var(--background-secondary)] items-center justify-center border-[2px] border-[var(--background-tertiary)] overflow-hidden rounded-[8px]">
            <Select
              defaultSelectedKeys={['casino']}
              onSelectionChange={(e) => {
                // console.log(e);
              }}
              classNames={{
                base: "flex w-auto items-center justify-center bg-[var(--background-secondary)] text-[16px] leading-[24px] hover:bg-[var(--background-secondary)] focus:bg-[var(--background-secondary)] h-full border-r-[2px] border-[var(--background-tertiary)] bg-transparent",
                trigger: "w-auto whitespace-nowrap min-w-[108px] bg-[var(--background-secondary)] text-[16px] leading-[24px]",
                listbox: "w-auto",
                value: "w-auto whitespace-nowrap",
                popoverContent: "w-auto",
              }}>
              <SelectItem key="casino" className="flex items-center justify-center text-[16px] leading-[24px] whitespace-nowrap">Casino</SelectItem>
              <SelectItem key="live-casino" className="flex items-center justify-center text-[16px] leading-[24px] whitespace-nowrap">Live Casino</SelectItem>
              {/* <SelectItem key="sports">Sports</SelectItem> */}
            </Select>
            {/* <div className="flex h-full bg-[var(--background-secondary)]  font-light items-center justify-center border-r-[2px] border-[var(--background-tertiary)] min-w-[108px]">
              Casino
            </div> */}
            <div className="flex items-center justify-center p-2">
              <Search size={16} className="w-[20px] h-[20px]" />
            </div>
            <Input
              label={"Search"}
              type="text"
              placeholder="Search your game"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              onFocus={() => {
                // searchWidgetState.value = true;
              }}
              className="flex flex-1 w-full h-full"
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-[var(--background-secondary)] w-full p-0 h-full border-none rounded-sm!",
                input: "text-white text-[14px] h-full bg-transparent",
                label: "text-[#FFFFFF]",
              }}
            />
          </div>
        </div>
        <TrendingGamesPanel />
        <TrendingSports />
        <PromotionsGroup />
        <EmulateBetting />
        <FAQ />
      </div>
      <div className="fixed bottom-1 right-4 w-[60px] h-[44px] rounded-full flex justify-center items-center">
        <Button className="w-full h-full rounded-full flex justify-center items-center bg-[#0F212E]" variant="light" size="sm">
          <img src="/images/icons/icons/live-support.svg" alt="Chat" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
