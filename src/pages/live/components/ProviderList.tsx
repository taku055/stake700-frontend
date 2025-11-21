import { FunctionalComponent } from "preact";
import { tProvider } from "@/types/tProvider";
import { useTranslations } from "@/context/I18nContext";

interface ProviderListProps {
  providers: tProvider[];
  selectedProviders: string[];
  allProvidersId: string;
  isAllProvidersSelected: boolean;
  onToggleProvider: (providerId: string) => void;
}

export const ProviderList: FunctionalComponent<ProviderListProps> = ({
  providers,
  selectedProviders,
  allProvidersId,
  isAllProvidersSelected,
  onToggleProvider,
}) => {
  const t = useTranslations("CasinoDetailPage");
  const individualProviders = selectedProviders.filter(id => id !== allProvidersId);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex flex-row gap-3 min-w-max">
        {/* All Providers option */}
        <button
          onClick={() => onToggleProvider(allProvidersId)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            isAllProvidersSelected
              ? "bg-[var(--primary-color)] border-2 border-[var(--primary-color)] text-white"
              : "bg-[var(--background-secondary)] text-gray-300 hover:bg-[var(--background)]"
          }`}
        >
          {t("All Providers") || "All Providers"}
        </button>

        {/* Individual providers */}
        {providers.map((provider) => {
          const isSelected = individualProviders.includes(provider.id);
          return (
            <button
              key={provider.id}
              onClick={() => onToggleProvider(provider.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-[var(--primary-color)] border-2 border-[var(--primary-color)] text-white"
                  : "bg-[var(--background-secondary)] text-gray-300 hover:bg-[var(--background)]"
              }`}
            >
              {provider.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

