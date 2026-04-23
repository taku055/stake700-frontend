import GameGroup from "@/components/GameGroup";
import GridGameGroup from "@/components/GridGameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";

export default function CasinoGames() {
    const t = useTranslations("CasinoPage");

    return (
        <div className="flex flex-col gap-4">
            <GridGameGroup
                category={"show"}
                title={t("Game Shows") || "Game Shows"}
                isCustom={true}
                viewallLink={`/?category=${"show"}`}
            />
            <TwoRowGameGroup
                category={"top-games"}
                title={t("Top Games") || "Top Games"}
                isCustom={true}
                viewallLink={`/?category=${"top-games"}`}
            />
            <GameGroup
                category={"slot-popular"}
                title={t("Popular Games") || "Popular Games"}
                isCustom={true}
                viewallLink={`/?category=${"slot-popular"}`}
            />
            <GameGroup
                category={"classic-slots"}
                title={t("Classics") || "Classics"}
                isCustom={true}
                viewallLink={`/?category=${"classic-slots"}`}
            />
        </div>
    )
}