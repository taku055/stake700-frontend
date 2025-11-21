import { FunctionalComponent } from "preact";
import { Input, Button } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { tProvider } from "@/types/tProvider";
import { ProviderList } from "./ProviderList";

interface ProviderSelectionCardProps {
  providers: tProvider[];
  selectedProviders: string[];
  providerSearch: string;
  allProvidersId: string;
  isAllProvidersSelected: boolean;
  onProviderSearchChange: (search: string) => void;
  onToggleProvider: (providerId: string) => void;
  onResetProviders: () => void;
}

export const ProviderSelectionCard: FunctionalComponent<ProviderSelectionCardProps> = ({
  providers,
  selectedProviders,
  providerSearch,
  allProvidersId,
  isAllProvidersSelected,
  onProviderSearchChange,
  onToggleProvider,
  onResetProviders,
}) => {
  const t = useTranslations("CasinoDetailPage");

  // Filter providers based on search
  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(providerSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-[var(--bar-background-color)] rounded-lg p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-white text-lg font-semibold">
          {t("Providers") || "Providers"} ({providers.length})
        </h3>
        <div className="flex flex-row items-center gap-2">
          <Button
            size="sm"
            variant="light"
            onPress={onResetProviders}
            className="text-white"
          >
            {t("Reset") || "Reset"}
          </Button>
          <Input
            size="sm"
            placeholder={t("Search Providers") || "Search Providers"}
            value={providerSearch}
            variant="bordered"
            classNames={{
              inputWrapper: "bg-[var(--background-secondary)] border-none rounded-lg w-48",
              input: "text-white text-[12px]",
            }}
            onChange={(e) => {
              const target = e.target as HTMLInputElement | null;
              onProviderSearchChange(target?.value ?? "");
            }}
          />
        </div>
      </div>

      {/* Provider List */}
      <ProviderList
        providers={filteredProviders}
        selectedProviders={selectedProviders}
        allProvidersId={allProvidersId}
        isAllProvidersSelected={isAllProvidersSelected}
        onToggleProvider={onToggleProvider}
      />
    </div>
  );
};

