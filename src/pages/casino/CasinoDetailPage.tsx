import { useLocation } from "preact-iso";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { providerState } from "@/state/providerState";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import ProviderSidebar from "@/components/ProviderSidebar";
import { Button, Input } from "@heroui/react";
import { tPaginationResult } from "@/types/tPaginationResult";
import { CATEGORY_DATA, tPageType } from "./data";
import { customGamesState } from "@/state/customGamesState";
import { tProvider } from "@/types/tProvider";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { Search } from "lucide-preact";
import { FaCircleXmark } from "react-icons/fa6";
import debounce from "lodash/debounce";

const GMAE_LOAD_COUNT = 24;

interface ICasinoDetailPageProps {
  pageType: tPageType;
}

export default function CasinoDetailPage({ pageType }: ICasinoDetailPageProps) {
  const pathname = useLocation();
  const t = useTranslations("CasinoDetailPage");
  const [games, setGames] = useState<tGame[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [providers, setProviders] = useState<tProvider[]>([]);
  const [searchGameName, setSearchGameName] = useState("");

  useEffect(() => {
    setSearchGameName("");
    loadMore(0, pathname.query);
  }, [pathname.query]);

  useEffect(() => {
    if (
      pageType !== "live-casino" &&
      pageType !== "virtual-sports" &&
      pageType !== "jackpot"
    ) {
      // show all providers
      setProviders(providerState.value.array.filter((p) => p.added_slot));
    } else {
      (async () => {
        try {
          const res = await apiGetProviders(CATEGORY_DATA[pageType].category);
          setProviders(res);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [providerState.value.array, pageType]);

  const loadMore = useCallback(
    async (
      offset1: number,
      params: {
        custom?: string;
        category?: string;
        provider?: string;
        keyword?: string;
      }
    ) => {
      setLoading(true);
      try {
        let res: tPaginationResult<tGame> = {
          data: [],
          total: 0,
        };

        if (Number(params.custom) === 1) {
          const games1 = customGamesState.value.filter(
            (c) =>
              c.category === params.category &&
              c.Game?.name
                .toLowerCase()
                .includes(params.keyword?.toLowerCase() || "")
          );

          res = {
            data: games1
              .slice(offset1, offset1 + GMAE_LOAD_COUNT)
              .map((e) => e.Game as tGame),
            total: games1.length,
          };
        } else {
          const requestParams =
            pageType === "tv-games"
              ? {
                  provider:
                    "639d67af2a68eab848d5a1febd5f8d565abb85ba,28cc2209b234d9183848f1c6a8ff13e0311057b9",
                  offset: offset1,
                  limit: GMAE_LOAD_COUNT,
                  keyword: params.keyword?.toLowerCase(),
                }
              : {
                  provider: params.provider,
                  offset: offset1,
                  limit: GMAE_LOAD_COUNT,
                  category: params.category || CATEGORY_DATA[pageType].category,
                  keyword: params.keyword?.toLowerCase(),
                };

          res = await apiGetGames(requestParams);
        }

        if (offset1 === 0) {
          setGames(res.data);
        } else {
          setGames((p) => [...p, ...res.data]);
        }
        setOffset(offset1 + GMAE_LOAD_COUNT);
        setTotal(res.total);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [customGamesState.value, pageType]
  );

  useEffect(() => {
    const fetchData = debounce(async () => {
      loadMore(0, { ...pathname.query, keyword: searchGameName });
    }, 1000);

    fetchData();
  }, [searchGameName, loadMore, pathname.query]);

  return (
    <div className="w-full flex md:flex-row flex-col py-4 gap-6">
      {pageType !== "tv-games" && <ProviderSidebar providers={providers} />}
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex flex-row uppercase gap-2">
          <Input
            size="sm"
            startContent={<Search size={16} color="#FFFFFF7D" />}
            endContent={
              <FaCircleXmark
                size={16}
                color="#FFFFFF7D"
                onClick={() => setSearchGameName("")}
              />
            }
            placeholder={t("Search Games")}
            value={searchGameName}
            variant="bordered"
            classNames={{
              inputWrapper:
                "bg-[#fff1] border-none rounded-sm! hover:bg-[#fff2] focus-within:hover:bg-[#fff2]",
              input: "text-[#FFFFFF7D] text-[16px]",
            }}
            onChange={(e) => {
              const target = e.target as HTMLInputElement | null;
              setSearchGameName(target?.value ?? "");
            }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid md:grid-cols-6 grid-cols-2 gap-2 flex-1">
            {games
              .filter((game) =>
                game.name.toLowerCase().includes(searchGameName.toLowerCase())
              )
              .map((game) => (
                <GameCard data={game} />
              ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              color="success"
              size="sm"
              onPress={() =>
                loadMore(offset, { ...pathname.query, keyword: searchGameName })
              }
              isLoading={loading}
              isDisabled={loading || offset >= total}
            >
              {t("load_more")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
