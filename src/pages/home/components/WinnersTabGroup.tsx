import { FunctionalComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Tabs, Tab, Image } from "@heroui/react";
import { tGame } from "@/types/tGame";
import { apiGetGames } from "@/api/common/apiGetGames";
import { useTranslations } from "@/context/I18nContext";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { placeholderGameImage } from "@/config/constants";

interface WinnerData {
  game: tGame;
  userId: string;
  earning: number;
}

interface WinnerCardProps {
  winner: WinnerData;
}

const WinnerCard: FunctionalComponent<WinnerCardProps> = ({ winner }) => {
  // Abbreviate user ID (e.g., "user123456789" -> "user1...789")
  const abbreviateUserId = (userId: string): string => {
    if (userId.length <= 10) return userId;
    return `${userId.substring(0, 4)}...${userId.substring(userId.length - 3)}`;
  };

  // Format earning amount
  const formatEarning = (amount: number): string => {
    return `${DEFAULT_CURRENCY_SYMBOL}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-row items-center gap-3 bg-[var(--background-secondary)] rounded-lg p-3 hover:bg-gray-700 transition-colors">
      {/* Game Image */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
        <Image
          src={winner.game.img_custom || winner.game.img || placeholderGameImage}
          fallbackSrc={placeholderGameImage}
          alt={winner.game.name}
          className="w-full h-full object-cover"
          radius="lg"
        />
      </div>

      {/* Game Name, User ID, and Earning */}
      <div className="flex-1 flex flex-row items-center gap-3 min-w-0 overflow-hidden">
        <span className="text-white text-sm font-medium truncate flex-1 min-w-0">
          {winner.game.name}
        </span>
        <span className="text-gray-400 text-xs flex-shrink-0 whitespace-nowrap">
          {abbreviateUserId(winner.userId)}
        </span>
        <span className="text-[var(--primary-color)] text-sm font-semibold flex-shrink-0 whitespace-nowrap">
          {formatEarning(winner.earning)}
        </span>
      </div>
    </div>
  );
};

export const WinnersTabGroup: FunctionalComponent = () => {
  const t = useTranslations("HomePage");
  const [topWinners, setTopWinners] = useState<WinnerData[]>([]);
  const [recentWinners, setRecentWinners] = useState<WinnerData[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data generator
  const generateMockWinners = (games: tGame[]): WinnerData[] => {
    const userIds = [
      "user123456789",
      "player987654321",
      "gamer456789123",
      "winner789123456",
      "champion123789456",
      "proplayer456123789",
      "master789456123",
      "legend123456987",
      "hero456789321",
      "star789123654",
    ];

    const earnings = [
      12500.50, 8750.25, 15200.75, 9800.00, 11250.30,
      13400.60, 7650.40, 18900.90, 10200.15, 15600.80
    ];

    return games.slice(0, 10).map((game, index) => ({
      game,
      userId: userIds[index] || `user${Math.random().toString(36).substring(7)}`,
      earning: earnings[index] || Math.random() * 20000,
    }));
  };

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        // Load top winners - you may need to adjust the API call based on your backend
        const topWinnersData = await apiGetGames({
          limit: 10,
          // Add any specific params for top winners
        });
        const games = topWinnersData.data || [];
        setTopWinners(generateMockWinners(games));

        // Load recent winners - you may need to adjust the API call based on your backend
        const recentWinnersData = await apiGetGames({
          limit: 10,
          // Add any specific params for recent winners
        });
        const recentGames = recentWinnersData.data || [];
        setRecentWinners(generateMockWinners(recentGames));
      } catch (error) {
        console.error("Error loading winners:", error);
        // Use empty mock data on error
        setTopWinners([]);
        setRecentWinners([]);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <div className="w-full">
      <Tabs
        aria-label="Winners tabs"
        fullWidth
        className="w-full"
        variant="underlined"
        classNames={{
          tabContent: "w-full text-white px-0",
          tab: "w-full px-0 gap-0",
          cursor: "w-full bg-[var(--primary-color)]",
        }}
      >
        <Tab key="top-winners" title={<div className="flex flex-row items-center gap-2 justify-center"> <img src="/images/icons/topwinners.svg" alt="Top Winners" className="w-[24px] h-[24px]" /> <span> {t("Top Winners") || "Top Winners"} </span> </div>}>
          <div className="h-[300px] overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {loading ? (
                <div className="text-center text-gray-400 py-8">
                  {t("Loading") || "Loading..."}
                </div>
              ) : topWinners.length > 0 ? (
                topWinners.map((winner, index) => (
                  <WinnerCard key={`${winner.game.id}-${index}`} winner={winner} />
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {t("No games available") || "No games available"}
                </div>
              )}
            </div>
          </div>
        </Tab>
        <Tab
          key="recent-winners"
          title={<div className="flex flex-row items-center gap-2 justify-center"> <img src="/images/icons/recentwinners.svg" alt="Recent Winners" className="w-[24px] h-[24px]" /> <span> {t("Recent Winners") || "Recent Winners"} </span> </div>}
        >
          <div className="h-[300px] overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {loading ? (
                <div className="text-center text-gray-400 py-8">
                  {t("Loading") || "Loading..."}
                </div>
              ) : recentWinners.length > 0 ? (
                recentWinners.map((winner, index) => (
                  <WinnerCard key={`${winner.game.id}-${index}`} winner={winner} />
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {t("No games available") || "No games available"}
                </div>
              )}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};
