import GameGroup from "@/components/GameGroup";
import GridGameGroup from "@/components/GridGameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";

export default function LobbyGames() {
    const t = useTranslations("HomePage");

    return (
        <div className="flex flex-col gap-4">
            <GridGameGroup
                category={"trending"}
                title={t("Trending Games") || "Trending Games"}
                isCustom={true}
                viewallLink={`/?category=${"trending"}`}
            />
            <GridGameGroup
                category={"top-games"}
                title={t("Top Games") || "Top Games"}
                isCustom={true}
                viewallLink={`/?category=${"top-games"}`}
            />
            <TwoRowGameGroup
                category={"home-live-casino"}
                title={t("Live Casino") || "Live Casino"}
                isCustom={true}
                viewallLink={`/?category=${"home-live-casino"}`}
            />
            <GameGroup
                category={"baccaratglobal"}
                title={t("Baccarat") || "Baccarat"}
                isCustom={true}
                viewallLink={`/?category=${"baccaratglobal"}`}
            />
            <GameGroup
                category={"classic-slots"}
                title={t("Classic Slots") || "Classic Slots"}
                isCustom={true}
                viewallLink={`/?category=${"classic-slots"}`}
            />
        </div>
    )
}