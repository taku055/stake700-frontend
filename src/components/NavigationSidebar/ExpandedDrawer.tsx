import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import NavigationItems from "./NavigationItems";
import CategoryItems from "./CategoryItems";

interface ExpandedDrawerProps {
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

export default function ExpandedDrawer({
  mainNavItems,
  selectedMainNavKey,
  categories,
  selectedMainNavTitle,
}: ExpandedDrawerProps) {
  const t = useTranslations("Header");

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        onClick={() => {
          navigationSidebarExpandedState.value = false;
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
            onClick={() => {
              navigationSidebarExpandedState.value = false;
            }}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-700 transition-colors text-white"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation Part */}
          <NavigationItems
            items={mainNavItems}
            selectedKey={selectedMainNavKey}
          />

          {/* Categories Part */}
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

