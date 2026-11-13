import GameGroup from "@/components/GameGroup";
import GridGameGroup from "@/components/GridGameGroup";
import TwoRowGameGroup from "@/components/TwoRowGameGroup";
import { useTranslations } from "@/context/I18nContext";
import { providerHref } from "@/helpers/providerHref";

export default function LobbyGames() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <GridGameGroup
        category={"trending"}
        title={t("Trending Games") || "Trending Games"}
        isCustom={true}
        viewallLink={`/casino/trending`}
      />
      <GridGameGroup
        category={"slot-new"}
        title={t("New Games") || "New Games"}
        isCustom={true}
        viewallLink={`/casino/new`}
      />
      <GameGroup
        category={"live-tables"}
        title={t("Live Tables") || "Live Tables"}
        isCustom={true}
        viewallLink={`/live-casino/live-tables`}
      />
      <TwoRowGameGroup
        category={"megaways"}
        title={t("Megaways") || "Megaways"}
        isCustom={true}
        viewallLink={`/casino/megaways`}
      />
      <GameGroup
        category={"jackpots"}
        title={t("Jackpots") || "Jackpots"}
        isCustom={true}
        viewallLink={`/casino/jackpots`}
      />
      <GameGroup
        category={"hacksaw"}
        title={t("Hacksaw") || "Hacksaw"}
        isCustom={false}
        provider={"6645919a6bf2f0cb6ce4b25f6f054975d443f17e"}
        useImgCustom={false}
        viewallLink={providerHref("6645919a6bf2f0cb6ce4b25f6f054975d443f17e")}
      />
      <GameGroup
        category={"pragmatic"}
        title={t("Pragmatic") || "Pragmatic"}
        isCustom={false}
        provider={"1e418d617fc706f42f4a0b6580297f870d877ec9"}
        useImgCustom={false}
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
