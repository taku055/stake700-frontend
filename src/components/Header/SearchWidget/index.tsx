import { useState, useEffect } from "preact/hooks";
import { Search, X } from "lucide-preact";
import debounce from "lodash/debounce";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import { searchWidgetState } from "@/state/searchWidgetState";
import SearchGameItem from "./SearchGameItem";
import { useTranslations } from "@/context/I18nContext";
import {
  Modal,
  ModalContent,
  ModalBody,
  Input,
  ModalHeader,
} from "@/components/common";
import { BASE_URL } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { Select, SelectItem } from "@heroui/react";
import GameCard from "@/components/GameCard";
import TrendingGamesPanel from "@/components/TrendingGamesPanel";
import TrendingSports from "@/components/TrendingSports";

export default function SearchWidget() {
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<tGame[]>([]);
  const t = useTranslations("SearchWidget");
  const isMobile = useMediaQuery(mobileMediaQuery);
  useEffect(() => {
    if (keyword.trim() === "") {
      setSearchResult([]);
      return;
    }

    const fetchData = debounce(async () => {
      const data = (await apiGetGames({ keyword, limit: 25 })).data;
      setSearchResult(data);
    }, 700);

    fetchData();
  }, [keyword]);

  const togglePanel = () => {
    searchWidgetState.value = !searchWidgetState.value;
  };
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setShowSearchResult(true);
  };

  return (
    <>
      {/* {!isMobile && (
        <div className="relative">
          <button
            type="button"
            className="flex w-[44px] h-[44px] items-center justify-center"
            onClick={togglePanel}
          >
            <img src={`${BASE_URL}/images/icons/search.svg`} alt={t("Search")} className="w-[20px] h-[20px]" />
          </button>
        </div>)} */}
      {true && (
        <div
          className="bg-opacity-50 flex items-center justify-center z-[100000000] backdrop-blur-sm"
        >
          <div
            className="w-[1260px] max-w-[1260px] h-auto overflow-y-auto"
            dir={"ltr"}
          >
            <div className="flex flex-col md:py-6 gap-[10px]  shadow-lg overflow-y-auto rounded-[8px] h-full">


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
                    <SelectItem key="sports" className="flex items-center justify-center text-[16px] leading-[24px] whitespace-nowrap">Sports</SelectItem>
                    {/* <SelectItem key="sports">Sports</SelectItem> */}
                  </Select>
                  {/* <div className="flex h-full bg-[var(--background-secondary)]  font-light items-center justify-center border-r-[2px] border-[var(--background-tertiary)] min-w-[108px]">
              Casino
            </div> */}
                  <div className="flex items-center justify-center p-2">
                    <Search size={16} className="w-[20px] h-[20px]" />
                  </div>
                  <Input
                    type="text"
                    placeholder={t("Search")}
                    value={keyword}
                    onChange={(e: any) => handleSearchChange(e.target.value)}
                    onFocus={(e: any) => {
                      searchWidgetState.value = true;
                    }}
                    classNames={{
                      inputWrapper: "bg-[var(--background-secondary)] border-none rounded-none h-[44px]",
                      input: "text-white text-[16px]",
                    }}
                  />
                  <X size={16} className="w-[24px] h-[24px] mx-3 text-white" onClick={() => setShowSearchResult(false)} />
                </div>
              </div>





              {showSearchResult && (
                <div className="flex flex-col rounded-lg h-[450px] overflow-y-auto scrollbar-hide py-[10px] bg-[var(--background)] border-none px-[10px] border-1 border-[#333]">
                  <div className="grid grid-cols-8">
                    {searchResult.map((game, index) => (
                      <div key={index}>
                        <GameCard data={game} />
                      </div>
                    ))}
                  </div>
                  <TrendingGamesPanel />
                  <TrendingSports />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
