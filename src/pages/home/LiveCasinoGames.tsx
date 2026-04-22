import GridGameGroup from "@/components/GridGameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";

export default function LiveCasinoGames() {
    const t = useTranslations("CasinoPage");

    return (
        <div className="flex flex-col gap-4">
            <GridGameGroup
                category={"videopoker"}
                title={t("Video Poker") || "Video Poker"}
                isCustom={true}
                viewallLink={`/?category=${"video-poker"}`}
            />
            <TwoRowGameGroup
                category={"rouletteglobal"}
                title={t("Roulette") || "Roulette"}
                isCustom={true}
                viewallLink={`/?category=${"rouletteglobal"}`}
            />
        </div>
    )
}