import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronRight } from "lucide-preact";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";

interface CollapsedSidebarProps {
  mainNavItems: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
  }>;
  selectedMainNavKey?: string;
}

export default function CollapsedSidebar({
  mainNavItems,
  selectedMainNavKey,
}: CollapsedSidebarProps) {
  const { modifyHref } = useAffiliateNavigation();

  return (
    <div className="md:flex w-16 bg-[var(--bar-background-color)] border-r border-gray-700 flex-col h-screen sticky top-0">
      {/* Expand Button */}
      <div className="flex items-center justify-center p-2 border-b border-gray-700 flex-shrink-0">
        <button
          onClick={() => {
            navigationSidebarExpandedState.value = true;
          }}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-700 transition-colors text-white"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Navigation Icons */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center py-4 gap-2">
        {mainNavItems.map((item) => (
          <a
            key={item.key}
            href={modifyHref(item.href)}
            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
              selectedMainNavKey === item.key
                ? 'bg-[var(--pink-color)] text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            title={item.title}
          >
            <span className="w-6 h-6 flex items-center justify-center">
              {item.icon}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

