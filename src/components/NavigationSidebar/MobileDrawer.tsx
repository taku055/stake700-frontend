import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { X } from "lucide-preact";
import { navigationSidebarOpenState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import NavigationItems from "./NavigationItems";
import CategoryItems from "./CategoryItems";

interface MobileDrawerProps {
  mainNavItems: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
  }>;
  selectedMainNavKey?: string;
  categories: Array<{
    name: string;
    path: string;
    icon?: string;
  }>;
  selectedMainNavTitle?: string;
}

export default function MobileDrawer({
  mainNavItems,
  selectedMainNavKey,
  categories,
  selectedMainNavTitle,
}: MobileDrawerProps) {
  const t = useTranslations("Header");

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        onClick={() => {
          navigationSidebarOpenState.value = false;
        }}
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out"
      />

      {/* Panel */}
      <div
        className="absolute inset-y-0 left-0 bg-[var(--bar-background-color)] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold">{t("Menu")}</h2>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => {
              navigationSidebarOpenState.value = false;
            }}
            className="inline-flex items-center justify-center h-9 w-9 rounded-xl hover:bg-gray-700 transition text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <NavigationItems items={mainNavItems} selectedKey={selectedMainNavKey} />
          {categories.length > 0 && (
            <CategoryItems
              categories={categories}
              title={selectedMainNavTitle || t("Categories")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

