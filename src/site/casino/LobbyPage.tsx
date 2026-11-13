"use client";

import SearchWidget from "@/components/Header/SearchWidget";
import ProviderGroup from "@/components/ProviderGroup";
import { useTranslations } from "@/context/I18nContext";
import type { CatalogSection } from "@/config/catalog";
import CasinoGames from "@/site/home/CasinoGames";
import LiveCasinoGames from "@/site/home/LiveCasinoGames";
import { useAgentRedirect } from "@/hooks/useAgentRedirect";
import { CasinoHeader } from "./components/CasinoHeader";

/** /casino and /live-casino landing pages: curated rows of games. */
export default function LobbyPage({ section }: { section: CatalogSection }) {
  const t = useTranslations("CasinoPage");
  const redirecting = useAgentRedirect();
  if (redirecting) return null;

  return (
    <div className="flex w-full flex-col gap-5 p-2 md:gap-7">
      <CasinoHeader section={section} activeTab="lobby" title={t("Lobby")} icon="/images/category_logo/lobby.webp" />

      <div className="relative z-30">
        <SearchWidget className="" />
      </div>

      {section === "casino" ? <CasinoGames /> : <LiveCasinoGames />}

      <div className="mt-2">
        <ProviderGroup category={section === "casino" ? "slots" : "live-casino"} />
      </div>
    </div>
  );
}
