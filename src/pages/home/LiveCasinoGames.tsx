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
                viewallLink={`/casino/live-casino?custom=1&category=${"rouletteglobal"}`}
            />
            <GridGameGroup
                category={"toptables"}
                title={t("Top Tables") || "Top Tables"}
                isCustom={true}
                viewallLink={`/casino/live-casino?custom=1&category=${"toptables"}`}
            />
            <GameGroup
                category={"highstakes"}
                title={t("High Stakes") || "High Stakes"}
                isCustom={true}
                viewallLink={`/casino/live-casino?custom=1&category=${"highstakes"}`}
            />
            <GameGroup
                category={"tablegames"}
                title={t("All Tables") || "All Tables"}
                isCustom={true}
                viewallLink={`/casino/live-casino?custom=1&category=${"tablegames"}`}
            />
        </div>
    )
}