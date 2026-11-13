import GameGroup from "@/components/GameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";
import { providerHref } from "@/helpers/providerHref";

export default function CasinoGames() {
  const t = useTranslations("CasinoPage");

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <TwoRowGameGroup
        category={"top-games"}
        title={t("Top Games") || "Top Games"}
        isCustom={true}
        viewallLink={`/casino/top`}
      />
      <GameGroup
        category={"slot-popular"}
        title={t("Popular Games") || "Popular Games"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/popular`}
      />
      <GameGroup
        category={"classic-slots"}
        title={t("Classics") || "Classics"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/classics`}
      />
      <GameGroup
        category={"hacksaw"}
        title={t("Hacksaw") || "Hacksaw"}
        isCustom={false}
        useImgCustom={false}
        provider={"6645919a6bf2f0cb6ce4b25f6f054975d443f17e"}
        viewallLink={providerHref("6645919a6bf2f0cb6ce4b25f6f054975d443f17e")}
      />
      <GameGroup
        category={"pragmatic"}
        title={t("Pragmatic") || "Pragmatic"}
        isCustom={false}
        useImgCustom={false}
        provider={"1e418d617fc706f42f4a0b6580297f870d877ec9"}
        viewallLink={providerHref("1e418d617fc706f42f4a0b6580297f870d877ec9")}
      />
      <GameGroup
        category={"nolimit"}
        title={t("No Limit") || "No Limit"}
        isCustom={false}
        provider={"17fbedea2386ee51d7684f36f89e0876ff6be5ce"}
        useImgCustom={false}
        viewallLink={providerHref("17fbedea2386ee51d7684f36f89e0876ff6be5ce")}
      />
      {/* <GameGroup
        category={"book-of"}
        title={t("Book Of") || "Book Of"}
        isCustom={true}
        useImgCustom={false}
        viewallLink={`/casino/book-of`}
      /> */}
    </div>
  );
}
