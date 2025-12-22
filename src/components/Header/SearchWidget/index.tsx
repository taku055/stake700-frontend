import { useState, useEffect } from "preact/hooks";
import { Search } from "lucide-preact";
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

export default function  SearchWidget() {
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<tGame[]>([]);
  const t = useTranslations("SearchWidget");

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

  const togglePanel = () => {
    searchWidgetState.value = !searchWidgetState.value;
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          className="flex w-[44px] h-[44px] items-center justify-center"
          onClick={togglePanel}
        >
          <img src="/images/icons/others/search.svg" alt={t("Search")} className="w-[20px] h-[20px]" />
        </button>
      </div>
      {searchWidgetState.value && (
        <Modal
          backdrop="blur"
          isOpen={searchWidgetState.value}
          onClose={() => (searchWidgetState.value = false)}
          placement="center"
          scrollBehavior="inside"
          classNames={{
            backdrop: "z-[10000000]",
            wrapper: "z-[10000000]",
          }}
        >
          <ModalContent
            className="w-[460px] bg-[var(--background)] max-h-[calc(var(--viewport-height) * 80)] overflow-y-auto"
            dir={"ltr"}
          >
            <ModalHeader className="text-[var(--primary-color)]">
              {t("Search")}
            </ModalHeader>
            <ModalBody className="flex flex-col p-2! md:py-6 gap-[10px] bg-[var(--header-background)] shadow-lg overflow-y-auto rounded-[8px] h-full">
              <Input
                type="text"
                label={t("Search")}
                value={keyword}
                autoFocus
                onChange={(e: any) => setKeyword(e.target.value)}
              />
              <div className="flex flex-col py-[10px] gap-[12px] bg-[#fff1] border-none rounded-sm! px-[14px] border-1 border-[#333]">
                <span className="text-[#6C718A] text-[12px] font-extrabold">
                  {t("Results")}
                </span>
                <div
                  className={`flex flex-col overflow-y-auto max-h-[200px] gap-2`}
                >
                  {searchResult.map((game, index) => (
                    <div key={index}>
                      <SearchGameItem data={game} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-[10px]">
                <img
                  src={`https://tekio.s3.eu-north-1.amazonaws.com/${(
                    import.meta.env.VITE_SITE_NAME as string
                  ).toLowerCase()}/logo.png`}
                  className="h-[20px]"
                  alt={import.meta.env.VITE_SITE_NAME as string}
                />
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
