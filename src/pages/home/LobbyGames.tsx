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
                viewallLink={`/casino/slots/?category=${"trending"}`}
            />
            <GridGameGroup
                category={"slot-new"}
                title={t("New Games") || "New Games"}
                isCustom={true}
                viewallLink={`/casino/slots/?category=${"slot-new"}`}
            />
            <GameGroup
                category={"live-tables"}
                title={t("Live Tables") || "Live Tables"}
                isCustom={true}
                viewallLink={`/casino/live/?category=${"home-live-casino"}`}
            />
            <TwoRowGameGroup
                category={"megaways"}
                title={t("Megaways") || "Megaways"}
                isCustom={true}
                viewallLink={`/casino/slots/?category=${"megaways"}`}
            />
            <GameGroup
                category={"jackpots"}
                title={t("Jackpots") || "Jackpots"}
                isCustom={true}
                viewallLink={`/casino/slots/?category=${"jackpots"}`}
            />
        </div>
    )
}