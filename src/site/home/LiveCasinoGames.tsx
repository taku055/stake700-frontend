import GameGroup from "@/components/GameGroup";
import GridGameGroup from "@/components/GridGameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";

export default function LiveCasinoGames() {
  const t = useTranslations("CasinoPage");

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <GridGameGroup
        category={"rouletteglobal"}
        title={t("International Roulette") || "International Roulette"}
        isCustom={true}
        viewallLink={`/live-casino/roulette`}
      />
      <GameGroup
        category={"live-tables"}
        title={t("Live Tables") || "Live Tables"}
        isCustom={true}
        viewallLink={`/live-casino/live-tables`}
      />
      <GridGameGroup
        category={"tablegames"}
        title={t("Top Tables") || "Top Tables"}
        isCustom={true}
        viewallLink={`/live-casino/table-games`}
      />
      <GameGroup
        category={"highstakes"}
        title={t("High Stakes") || "High Stakes"}
        isCustom={true}
        viewallLink={`/live-casino/high-stakes`}
      />
      <GameGroup
        category={"tablegames"}
        title={t("All Tables") || "All Tables"}
        useImgCustom={false}
        isCustom={true}
        viewallLink={`/live-casino/table-games`}
      />
      <GameGroup
        category={"blackjacks"}
        title={t("Blackjack") || "Blackjack"}
        useImgCustom={false}
        isCustom={true}
        viewallLink={`/live-casino/blackjack`}
      />
      <GameGroup
        category={"baccaratglobal"}
        title={t("Baccarat") || "Baccarat"}
        useImgCustom={false}
        isCustom={true}
        viewallLink={`/live-casino/baccarat`}
      />
      <GridGameGroup
        category={"show"}
        title={t("Game Shows") || "Game Shows"}
        isCustom={true}
        viewallLink={`/live-casino/game-shows`}
      />
      <GameGroup
        category={"sic-bo"}
        title={t("Sic Bo") || "Sic Bo"}
        useImgCustom={false}
        isCustom={true}
        viewallLink={`/live-casino/sic-bo`}
      />
    </div>
  );
}
