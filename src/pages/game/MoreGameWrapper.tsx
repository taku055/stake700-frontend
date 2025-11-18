import GameGroup from "@/components/GameGroup";
import { useTranslations } from "@/context/I18nContext";
import { providerState } from "@/state/providerState";
import { tGame } from "@/types/tGame";

interface IMoreGameWrapperProps {
  game?: tGame;
}

export default function MoreGameWrapper({ game }: IMoreGameWrapperProps) {
  const t = useTranslations("MoreGameWrapper");

  if (!game) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <GameGroup
        title={t("More from") + " " + providerState.value.map[game?.providerId || ""]?.name}
        category=""
        isCustom={false}
        viewallLink={"/gallery/all?providerId=" + game?.providerId}
        provider={game?.providerId}
        exceptGameId={game?.id}
        template={1}
      />
    </div>
  );
}
