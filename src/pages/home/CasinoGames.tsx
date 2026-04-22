import Megaways from "@/components/Megaways";
import { useTranslations } from "@/context/I18nContext";

export default function CasinoGames() {
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
            />
        </div>
    )
}