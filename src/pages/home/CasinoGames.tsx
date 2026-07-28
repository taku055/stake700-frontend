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
        viewallLink={`/casino/slots?custom=1&category=${"show"}`}
      />
      <TwoRowGameGroup
        category={"top-games"}
        title={t("Top Games") || "Top Games"}
        isCustom={true}
        viewallLink={`/casino/slots?custom=1&category=${"top-games"}`}
      />
      <GameGroup
        category={"slot-top-slots"}
        title={t("Popular Games") || "Popular Games"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/slots?custom=1&category=${"slot-top-slots"}`}
      />
      <GameGroup
        category={"classic-slots"}
        title={t("Classics") || "Classics"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/slots?custom=1&category=${"classic-slots"}`}
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
        category={"book-of"}
        title={t("Book Of") || "Book Of"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/slots/?custom=1&category=${"book-of"}`}
      />
    </div>
  );
}
