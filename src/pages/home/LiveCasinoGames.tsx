import GameGroup from "@/components/GameGroup";
import GridGameGroup from "@/components/GridGameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";

export default function LiveCasinoGames() {
    const t = useTranslations("CasinoPage");

    return (
        <div className="flex flex-col gap-4">
            <GridGameGroup
                category={"rouletteglobal"}
                title={t("International Roulette") || "International Roulette"}
                isCustom={true}
                viewallLink={`/?category=${"rouletteglobal"}`}
            />
            <TwoRowGameGroup
                category={"toptables"}
                title={t("Top Tables") || "Top Tables"}
                isCustom={true}
                viewallLink={`/?category=${"toptables"}`}
            />
            <GameGroup
                category={"highstakes"}
                title={t("High Stakes") || "High Stakes"}
                isCustom={true}
                viewallLink={`/?category=${"highstakes"}`}
            />
            <GameGroup
                category={"tablegames"}
                title={t("All Tables") || "All Tables"}
                isCustom={true}
                viewallLink={`/?category=${"tablegames"}`}
            />
        </div>
    )
}