import { FunctionalComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Tabs, Tab, Image } from "@heroui/react";
import { tGame } from "@/types/tGame";
import { useTranslations } from "@/context/I18nContext";
import { DEFAULT_CURRENCY_SYMBOL, placeholderGameImage } from "@/config/constants";
import { customGamesState } from "@/state/customGamesState";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { scrollToTop } from "@/helpers/scrollToTop";

interface WinnerData {
  game: tGame;
  userId: string;
  earning: number;
}

interface WinnerCardProps {
  winner: WinnerData;
  isLast?: boolean;
}

const WinnerCard: FunctionalComponent<WinnerCardProps> = ({ winner, isLast = false }) => {
  const { handleNavigate } = useAffiliateNavigation();

  // Abbreviate user ID (e.g., "user123456789" -> "user1...789")
  const abbreviateUserId = (userId: string): string => {
    if (userId.length <= 10) return userId;
    return `${userId.substring(0, 3)}****${userId.substring(userId.length - 4)}`;
  };

  // Format earning amount
  const formatEarning = (amount: number): string => {
    return `${amount} NSP`;
  };

  const handleCardClick = () => {
    scrollToTop();
    handleNavigate(`/game/${winner.game.id}`);
  };

  return (
    <>
      <div 
        className="flex flex-row gap-3 py-3 hover:bg-gray-700/30 transition-colors rounded-lg px-2 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Game Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={winner.game.img_custom || winner.game.img || placeholderGameImage}
            fallbackSrc={placeholderGameImage}
            alt={winner.game.name}
            className="w-16 h-16 object-cover"
            radius="lg"
          />
        </div>

        {/* Game Name, User ID, and Earning */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-white text-sm font-medium truncate">
            {winner.game.name}
          </span>
          <span className="text-gray-400 text-xs">
            {abbreviateUserId(winner.userId)}
          </span>
          <span className="text-[var(--primary-color)] text-sm font-semibold">
            {formatEarning(winner.earning)}
          </span>
        </div>
      </div>
      {!isLast && (
        <div className="h-px bg-gray-700/50 w-full" />
      )}
    </>
  );
};

export const WinnersTabGroup: FunctionalComponent = () => {
  const t = useTranslations("HomePage");
  const [topWinners, setTopWinners] = useState<WinnerData[]>([]);
  const [recentWinners, setRecentWinners] = useState<WinnerData[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data generator for top winners
  const generateTopWinnersMock = (games: tGame[]): WinnerData[] => {
    const userIds = [
      "350****6663",
      "348****8636",
      "350****6663",
      "350****6663",
      "350****6663",
      "350****6663",
      "232****8354",
      "350****6663",
      "341****6024",
      "341****3024",
    ];

    const earnings = [
      140300000, 127440000, 126500000, 115000000, 115000000,
      115000000, 114300228.6, 106950000, 103500000, 103500000,
    ];

    return games.slice(0, 10).map((game, index) => ({
      game,
      userId: userIds[index] || `user${Math.random().toString(36).substring(7)}`,
      earning: earnings[index] || Math.random() * 20000,
    }));
  };

  // Mock data generator for recent winners
  const generateRecentWinnersMock = (games: tGame[]): WinnerData[] => {
    const userIds = [
      "351***5726",
      "317***9133",
      "351***5726",
      "270***2696",
      "305***4161",
      "317***9133",
    ];

    const earnings = [
      177520.95, 600000, 304800.6, 162000, 144000,
      400000, 4200.40, 5100.90, 3400.15, 4600.80
    ];

    return games.slice(0, 6).map((game, index) => ({
      game,
      userId: userIds[index] || `user${Math.random().toString(36).substring(7)}`,
      earning: earnings[index] || Math.random() * 10000,
    }));
  };

  useEffect(() => {
    const loadGames = () => {
      setLoading(true);
      try {
        // Load top winners from custom games with "slot-popular" category
        const topWinnersGames = customGamesState.value
          .filter((c) => c.category === "slot-popular")
          .slice(0, 10)
          .map((e) => e.Game as tGame);
        setTopWinners(generateTopWinnersMock(topWinnersGames));

        // Load recent winners from custom games with "slot-new" category
        const recentWinnersGames = customGamesState.value
          .filter((c) => c.category === "slot-new")
          .slice(0, 10)
          .map((e) => e.Game as tGame);
        setRecentWinners(generateRecentWinnersMock(recentWinnersGames));
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
  }, [customGamesState.value]);

  return (
    <div className="w-full bg-[var(--bar-background-color)] rounded-lg">
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
          <div className="h-[300px] overflow-y-auto">
            <div className="flex flex-col">
              {loading ? (
                <div className="text-center text-gray-400 py-8">
                  {t("Loading") || "Loading..."}
                </div>
              ) : topWinners.length > 0 ? (
                topWinners.map((winner, index) => (
                  <WinnerCard 
                    key={`${winner.game.id}-${index}`} 
                    winner={winner} 
                    isLast={index === topWinners.length - 1}
                  />
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
          <div className="h-[300px] overflow-y-auto">
            <div className="flex flex-col">
              {loading ? (
                <div className="text-center text-gray-400 py-8">
                  {t("Loading") || "Loading..."}
                </div>
              ) : recentWinners.length > 0 ? (
                recentWinners.map((winner, index) => (
                  <WinnerCard 
                    key={`${winner.game.id}-${index}`} 
                    winner={winner} 
                    isLast={index === recentWinners.length - 1}
                  />
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
