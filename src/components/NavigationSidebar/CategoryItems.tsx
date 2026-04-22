import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { Link } from "../common";
import { useTranslations } from "@/context/I18nContext";

interface CategoryItemsProps {
  categories: Array<{
    name: string;
    path: string;
    icon?: string;
    count?: number;
  }>;
  title: string;
  onCategoryClick?: () => void;
}

export default function CategoryItems({ categories, title, onCategoryClick }: CategoryItemsProps) {
  const { handleNavigate } = useAffiliateNavigation();
  const t = useTranslations("Header");
  const handleCategoryClick = (path: string) => {
    handleNavigate(path);
    if (onCategoryClick) {
      onCategoryClick();
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col gap-2">
          {categories.map((category, index) => (
            <Link
              key={index}
              onClick={() => handleCategoryClick(category.path)}
              href={category.path}
              className="flex items-center gap-3 px-4 py-3.25 rounded-xl bg-(--sidebar-card-bg) hover:bg-(--sidebar-card-hover) transition-colors text-white w-full"
            >
              {category.icon && (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-6 h-6 shrink-0 object-contain"
                />
              )}
              <span className="flex-1 text-sm font-medium">{t(category.name)}</span>
              {category.count !== undefined && (
                <span className="bg-(--sidebar-background) text-white text-xs px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-b border-(--sidebar-card-bg) mx-1 my-2" />
    </>
  );
}

