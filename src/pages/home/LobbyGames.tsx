import GameGroup from "@/components/GameGroup";
import GridGameGroup from "@/components/GridGameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";

export default function LobbyGames() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col gap-4">
      <GridGameGroup
        category={"slot-popular"}
        title={t("Trending Games") || "Trending Games"}
        isCustom={true}
        viewallLink={`/casino/slots/?custom=1&category=${"slot-popular"}`}
      />
      <GridGameGroup
        category={"slot-new"}
        title={t("New Games") || "New Games"}
        isCustom={true}
        viewallLink={`/casino/slots/?custom=1&category=${"slot-new"}`}
      />
      <GameGroup
        category={"live-tables"}
        title={t("Live Tables") || "Live Tables"}
        isCustom={true}
        viewallLink={`/casino/live-casino/?custom=1&category=${"live-tables"}`}
      />
      <TwoRowGameGroup
        category={"megaways"}
        title={t("Megaways") || "Megaways"}
        isCustom={true}
        viewallLink={`/casino/slots/?custom=1&category=${"megaways"}`}
      />
      <GameGroup
        category={"slot-jackpots"}
        title={t("Jackpots") || "Jackpots"}
        isCustom={true}
        viewallLink={`/casino/slots/?custom=1&category=${"slot-jackpots"}`}
      />
      <GameGroup
        category={"hacksaw"}
        title={t("Hacksaw") || "Hacksaw"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/search?providerId=36855229b93e55ecde0c9231d3ecca4d6cc8d500 `}
      />
      <GameGroup
        category={"pragmatic"}
        title={t("Pragmatic") || "Pragmatic"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/search?providerId=5af8ec20d4b1198738df2967a01b0d7c52246b97`}
      />
      <GameGroup
        category={"nolimit"}
        title={t("No Limit") || "No Limit"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/search?providerId=7bb31b6ed509550906c7d17c055b68f2e1ab6630`}
      />
      <GameGroup
        category={"instant-win"}
        title={t("Instant Win") || "Instant Win"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/slots/?custom=1&category=${"instant-win"}`}
      />
      <GameGroup
        category={"book-of"}
        title={t("Book Of") || "Book Of"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/slots/?custom=1&category=${"book-of"}`}
      />
    </div>
  );
}
