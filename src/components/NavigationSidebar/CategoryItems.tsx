import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronRight } from "lucide-preact";

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

  const handleCategoryClick = (path: string) => {
    handleNavigate(path);
    if (onCategoryClick) {
      onCategoryClick();
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category.path)}
            className="flex items-center bg-[var(--background-secondary)] gap-3 px-4 py-4 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-left w-full"
          >
            {category.icon && (
              <img
                src={category.icon}
                alt={category.name}
                className="w-6 h-6 flex-shrink-0 object-contain"
              />
            )}
            <span className="flex-1">{category.name}</span>
            {category.count !== undefined && (
              <span className="bg-[var(--background)] text-white text-xs px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

