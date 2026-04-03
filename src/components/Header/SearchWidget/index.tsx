import { useState, useEffect, useRef } from "preact/hooks";
import { Search, X } from "lucide-preact";
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
import { useLocation } from "preact-iso";
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
                      Casino
                    </SelectItem>
                    <SelectItem
                      key="sports"
                      className="flex items-center justify-center text-[16px] leading-[24px] whitespace-nowrap"
                    >
                      Sports
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
  const isMobile = useMediaQuery(mobileMediaQuery);
  const widgetRefHeader = useRef<HTMLDivElement>(null);
  const [showSelection, setShowSelection] = useState(true);
  const location = useLocation();

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
      const data = (await apiGetGames({ keyword, limit: 25 })).data;
      setSearchResult(data);
    }, 700);

    fetchData();
  }, [keyword]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRefHeader.current &&
        !widgetRefHeader.current.contains(event.target as Node)
      ) {
        // setShowSearchWidget(false);
        setShowSearchResult(false);
        setKeyword("");
        searchWidgetStateHeader.value = false;
      }
    };

    if (searchWidgetStateHeader.value) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when widget is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [searchWidgetStateHeader.value]);

  const togglePanel = () => {
    searchWidgetStateHeader.value = !searchWidgetStateHeader.value;
  };
  const [showSearchResult, setShowSearchResult] = useState(false);
  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setShowSearchResult(true);
  };

  return (
    <>
      {searchWidgetStateHeader.value && (
        <>
          {/* Backdrop with blur */}
          {searchWidgetStateHeader.value && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[-1]"
              onClick={() => {
                searchWidgetStateHeader.value = false;
                setShowSearchResult(false);
                setKeyword("");
                // searchWidgetStateHeader.value = false;
              }}
            />
          )}
          {/* Search Widget */}
          <div
            ref={widgetRefHeader}
            className="absolute right-0 top-[60px] left-0 items-center justify-center z-[5] pointer-events-none"
          >
            <div
              className="w-full max-w-[1200px] mx-auto h-auto overflow-y-auto pointer-events-auto"
              dir={"ltr"}
            >
              <div className="flex flex-col md:py-6 gap-[10px] shadow-lg overflow-y-auto rounded-[8px] h-full">
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
                          Casino
                        </SelectItem>
                        <SelectItem
                          key="sports"
                          className="flex items-center justify-center text-[16px] leading-[24px] whitespace-nowrap"
                        >
                          Sports
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
                        searchWidgetStateHeader.value = true;
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
                        searchWidgetStateHeader.value = false;
                        setShowSearchResult(false);
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
      )}
    </>
  );
}
