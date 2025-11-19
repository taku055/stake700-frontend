import { FunctionalComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Tabs, Tab } from "@heroui/react";
import GameCard from "@/components/GameCard";
import { tGame } from "@/types/tGame";
import { apiGetGames } from "@/api/common/apiGetGames";
import { useTranslations } from "@/context/I18nContext";

export const WinnersTabGroup: FunctionalComponent = () => {
  const t = useTranslations("HomePage");
  const [topWinners, setTopWinners] = useState<tGame[]>([]);
  const [recentWinners, setRecentWinners] = useState<tGame[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        // Load top winners - you may need to adjust the API call based on your backend
        const topWinnersData = await apiGetGames({
          limit: 10,
          // Add any specific params for top winners
        });
        setTopWinners(topWinnersData.data || []);

        // Load recent winners - you may need to adjust the API call based on your backend
        const recentWinnersData = await apiGetGames({
          limit: 10,
          // Add any specific params for recent winners
        });
        setRecentWinners(recentWinnersData.data || []);
      } catch (error) {
        console.error("Error loading winners:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <div className="w-full">
      <Tabs aria-label="Winners tabs" className="w-full">
        <Tab key="top-winners" title={t("Top Winners") || "Top Winners"}>
          <div className="h-[300px] overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {loading ? (
                <div className="col-span-full text-center text-gray-400">{t("Loading") || "Loading..."}</div>
              ) : topWinners.length > 0 ? (
                topWinners.map((game) => (
                  <GameCard key={game.id} data={game} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400">{t("No games available") || "No games available"}</div>
              )}
            </div>
          </div>
        </Tab>
        <Tab key="recent-winners" title={t("Recent Winners") || "Recent Winners"}>
          <div className="h-[300px] overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {loading ? (
                <div className="col-span-full text-center text-gray-400">{t("Loading") || "Loading..."}</div>
              ) : recentWinners.length > 0 ? (
                recentWinners.map((game) => (
                  <GameCard key={game.id} data={game} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400">{t("No games available") || "No games available"}</div>
              )}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

