import Megaways from "@/components/Megaways";
import { useTranslations } from "@/context/I18nContext";

export default function LobbyGames({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
    const t = useTranslations("HomePage");

    return (
        <div className="flex flex-col gap-4">
            <Megaways
                key={'category.key'}
                category={'megaways'}
                title={t('Megaways') || 'Megaways'}
                isCustom={true}
                provider={''}
                viewallLink={`/?category=${'megaways'}`}
                setActiveTab={setActiveTab}
            />
        </div>
    )
}