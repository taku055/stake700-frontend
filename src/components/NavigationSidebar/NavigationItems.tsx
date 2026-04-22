import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
interface NavigationItemsProps {
  items: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
  }>;
  selectedKey?: string;
}

export default function NavigationItems({
  items,
  selectedKey,
}: NavigationItemsProps) {
  const { modifyHref } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <a
            key={item.key}
            href={modifyHref(item.href)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isRTL ? "flex-row-reverse text-right" : ""} ${
              selectedKey === item.key
                ? 'bg-[var(--pink-color)] text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

