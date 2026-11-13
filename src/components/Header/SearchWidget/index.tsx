import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import debounce from "lodash/debounce";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import { searchWidgetState } from "@/state/searchWidgetState";
import { useTranslations } from "@/context/I18nContext";
import { Input } from "@/components/common";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { Select, SelectItem } from "@heroui/react";
import GameCard from "@/components/GameCard";
import { useLocation } from "@/router";
import { searchWidgetState as searchWidgetStateHeader } from "@/state/searchWidgetState";

export default function SearchWidget() {
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<tGame[]>([]);
  const t = useTranslations("SearchWidget");
  const widgetRef = useRef<HTMLDivElement>(null);
  const [showSelection, setShowSelection] = useState(true);
  const location = useLocation();
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [blurBackground, setBlurBackground] = useState(false);

  useEffect(() => {
    if (location.path.includes("/casino")) {
      setShowSelection(false);
    } else {
      setShowSelection(true);
    }
  }, [location.path]);
  useEffect(() => {
    if (keyword.trim() === "") {
      setSearchResult([]);
      return;
    }

    const fetchData = debounce(async () => {
      const data = (await apiGetGames({ keyword, limit: 24 })).data;
      setSearchResult(data);
    }, 700);

    fetchData();
  }, [keyword]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        // setShowSearchWidget(false);
        setShowSearchResult(false);
        setKeyword("");
        setBlurBackground(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Prevent body scroll when widget is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, []);

  const togglePanel = () => {
    searchWidgetState.value = !searchWidgetState.value;
  };

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setShowSearchResult(true);
  };

  return (
    <>
      {/* Backdrop with blur */}
      {blurBackground && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[105]"
          onClick={() => {
            // setShowSearchWidget(false);
            setShowSearchResult(false);
            setKeyword("");
            setBlurBackground(false);
          }}
        />
      )}
      {/* Search Widget */}
      <div
        ref={widgetRef}
        className=" flex items-start justify-center z-[110] pointer-events-none"
      >
        <div
          className="w-[1260px] max-w-[1260px] h-auto overflow-y-auto pointer-events-auto"
          dir={"ltr"}
        >
          <div className="flex flex-col md:py-4 gap-[10px] shadow-lg overflow-y-auto rounded-[8px] h-full">
            <div className="flex w-full h-[52px] md:px-0 ">
              <div className="flex w-full h-full bg-[var(--background-secondary)] items-center justify-center border-[2px] border-[var(--background-tertiary)] overflow-hidden rounded-[8px]">
                {showSelection && (
                  <Select
                    defaultSelectedKeys={["casino"]}
                    onSelectionChange={(e) => {}}
                    classNames={{
                      base: "flex w-auto items-center justify-center bg-[var(--background-secondary)] text-[16px] leading-[24px] hover:bg-[var(--background-secondary)] focus:bg-[var(--background-secondary)] h-full border-r-[2px] border-[var(--background-tertiary)] bg-transparent",
                      trigger:
                        "w-auto whitespace-nowrap min-w-[108px] bg-[var(--background-secondary)] text-[16px] leading-[24px]",
                      listbox: "w-auto",
                      value: "w-auto whitespace-nowrap",
                      popoverContent: "w-auto",
                    }}
                  >
                    <SelectItem
                      key="casino"
                      className="flex items-center justify-center text-[16px] leading-[24px] whitespace-nowrap"
                    >
                      {t("Casino")}
                    </SelectItem>
                    <SelectItem
                      key="sports"
                      className="flex items-center justify-center text-[16px] leading-[24px] whitespace-nowrap"
                    >
                      {t("Sports")}
                    </SelectItem>
                  </Select>
                )}
                <div className="flex items-center justify-center p-2">
                  <Search size={16} className="w-[20px] h-[20px]" />
                </div>
                <Input
                  type="text"
                  placeholder={t("Search")}
                  value={keyword}
                  onChange={(e: any) => handleSearchChange(e.target.value)}
                  onFocus={(e: any) => {
                    setBlurBackground(true);
                  }}
                  classNames={{
                    inputWrapper:
                      "bg-[var(--background-secondary)] border-none rounded-none h-[44px]",
                    input: "text-white text-[16px]",
                  }}
                />
                <X
                  size={16}
                  className="w-[24px] h-[24px] mx-3 text-white cursor-pointer"
                  onClick={() => {
                    setShowSearchResult(false);
                    setBlurBackground(false);
                    setKeyword("");
                  }}
                />
              </div>
            </div>

            {showSearchResult && (
              <div className="flex flex-col rounded-lg h-[450px] overflow-y-auto scrollbar-hide py-[10px] bg-[var(--background)] border-none px-[10px] border-1 border-[#333]">
                <div className="grid md:grid-cols-8 grid-cols-3 gap-2">
                  {searchResult.map((game, index) => (
                    <div key={index}>
                      <GameCard
                        data={game}
                        onClick={() => {
                          searchWidgetStateHeader.value = false;
                          setShowSearchResult(false);
                          setKeyword("");
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function SearchWidgetHeader() {
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<tGame[]>([]);
  const t = useTranslations("SearchWidget");
  const widgetRefHeader = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (keyword.trim() === "") {
      setSearchResult([]);
      return;
    }

    const fetchData = debounce(async () => {
      const data = (await apiGetGames({ keyword, limit: 24 })).data;
      setSearchResult(data);
    }, 400);

    fetchData();
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRefHeader.current &&
        !widgetRefHeader.current.contains(event.target as Node)
      ) {
        setKeyword("");
        searchWidgetStateHeader.value = false;
      }
    };

    if (!searchWidgetStateHeader.value) return;
    document.addEventListener("mousedown", handleClickOutside);
    inputRef.current?.focus();
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchWidgetStateHeader.value]);

  const closePanel = () => {
    searchWidgetStateHeader.value = false;
    setKeyword("");
  };

  if (!searchWidgetStateHeader.value) return null;

  return (
    <>
    <div
      className="fixed inset-0 z-[210] bg-[#07141c]/55 backdrop-blur-md"
      onMouseDown={(event) => {
        event.stopPropagation();
        closePanel();
      }}
    />
    <div
      ref={widgetRefHeader}
      className="absolute end-0 top-full z-[220] mt-2 w-[min(960px,calc(100vw-1.5rem))] rounded-xl border border-[#2f4553] bg-[#0f212e] p-4 shadow-xl"
    >
      <div className="flex h-12 items-center gap-2 rounded-lg bg-[#1a2c38] px-3">
        <Search size={16} className="shrink-0 text-[#b1bad3]" />
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          placeholder={t("Search")}
          onChange={(event) => setKeyword(event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#b1bad3]"
        />
        <button type="button" aria-label="Close" onClick={closePanel} className="text-[#b1bad3] hover:text-white">
          <X size={16} />
        </button>
      </div>
      <div className="mt-3 max-h-[min(70vh,640px)] overflow-y-auto">
        {keyword.trim() === "" ? (
          <p className="px-2 py-6 text-sm text-[#b1bad3]">{t("Search")}</p>
        ) : searchResult.length === 0 ? (
          <p className="px-2 py-6 text-sm text-[#b1bad3]">{t("Results")}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {searchResult.map((game) => (
              <GameCard key={game.id} data={game} onClick={closePanel} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
