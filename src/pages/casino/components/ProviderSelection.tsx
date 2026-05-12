import { FunctionalComponent } from "preact";
import { useMemo, useState } from "preact/hooks";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/common/Dropdown";
import { tProvider } from "@/types/tProvider";
import { Filter, ChevronUp, ChevronDown } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";

interface ProviderSelectionProps {
  providers: tProvider[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const ProviderSelection: FunctionalComponent<ProviderSelectionProps> = ({
  providers,
  value,
  onChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = useTranslations("CasinoPage");
  const providerList = useMemo(() => {
    return providers.sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [providers]);

  const handleToggleProvider = (providerId: string) => {
    let temp = [...value];
    if (temp.includes(providerId)) {
      temp = temp.filter((id) => id !== providerId);
    } else {
      temp.push(providerId);
    }
    onChange(temp);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="flex items-center gap-3 z-105">
      {/* Filter Label with Icon */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-300" />
        <span className="text-gray-300 text-sm font-semibold">{t("Filter")}</span>
      </div>

      {/* Providers dropdown */}
      <Dropdown open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] hover:bg-[var(--background-btn-hover)] text-gray-300 rounded-lg transition-colors font-semibold"
          >
            <span>{t("Providers")}</span>
            {value.length > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                {value.length}
              </span>
            )}
            {isDropdownOpen ? (
              <ChevronUp size={16} className="text-gray-300" />
            ) : (
              <ChevronDown size={16} className="text-gray-300" />
            )}
          </button>
        </DropdownTrigger>
        <DropdownMenu
          className="!bg-white min-w-[240px] max-h-[400px] z-2000 overflow-y-auto rounded-lg shadow-lg"
          ariaLabel={t("Provider selection")}
        >
          {/* Provider Items */}
          {providerList.map((provider) => {
            const isSelected = value.includes(provider.id);

            return (
              <div
                key={provider.id}
                role="menuitem"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleProvider(provider.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggleProvider(provider.id);
                  }
                }}
                className="cursor-pointer select-none outline-none px-3 py-2.5 hover:bg-gray-50 bg-white"
              >
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 cursor-pointer flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProvider(provider.id);
                      }}
                    />
                    <span className="text-gray-800 text-sm font-normal truncate">
                      {provider.name}
                    </span>
                  </div>
                  {/* <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {isSelected ? 1 : 0}
                  </span> */}
                </div>
              </div>
            );
          })}

          {/* Clear All Button */}
          <div className="border-t border-gray-200 mt-1">
            <DropdownItem
              onPress={handleClearAll}
              className="!px-3 !py-2.5 text-center hover:!bg-gray-50 !bg-white"
            >
              <span className="text-gray-800 text-sm font-semibold">
                {t("Clear all")}
              </span>
            </DropdownItem>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
