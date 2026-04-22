import GameCard from "@/components/GameCard";
import { mobilePortraitMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import { customGamesState } from "@/state/customGamesState";
import { localeState } from "@/state/localeState";
import { tGame } from "@/types/tGame";
import { useEffect, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import styles from "../../components/Megaways/Megaways.module.scss";

export default function Megaways() {
    const t = useTranslations("HomePage");

    const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
    const [games, setGames] = useState<tGame[]>([]);
    const [swiper, setSwiper] = useState<any>(null);
    const isRTL = RTL_LANGUAGES.includes(localeState.value);


    useEffect(() => {
        (async () => {
            const data = customGamesState.value
                .filter((c) => c.category === 'megaways')
                .slice(0, 30)
                .map((e) => e.Game as tGame)
            setGames(data);
        })();
    }, [customGamesState.value]);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {games.map((game) => (
                <GameCard key={game.id} data={game} />
            ))}
        </div>
    )
}