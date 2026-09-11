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
        category={"slot-popular"}
        title={t("Popular Games") || "Popular Games"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/slots?custom=1&category=${"slot-popular"}`}
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
        viewallLink={`/casino/search?providerId=6645919a6bf2f0cb6ce4b25f6f054975d443f17e `}
      />
      <GameGroup
        category={"pragmatic"}
        title={t("Pragmatic") || "Pragmatic"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/search?providerId=1e418d617fc706f42f4a0b6580297f870d877ec9`}
      />
      <GameGroup
        category={"nolimit"}
        title={t("No Limit") || "No Limit"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/search?providerId=17fbedea2386ee51d7684f36f89e0876ff6be5ce`}
      />
      {/* <GameGroup
        category={"book-of"}
        title={t("Book Of") || "Book Of"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/slots/?custom=1&category=${"book-of"}`}
      /> */}
    </div>
  );
}
