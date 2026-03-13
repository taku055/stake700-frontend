import { ASSET_BASE_URL } from "@/config/constants";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronRight } from "lucide-preact";
import { Link } from "../common";

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
    <>
      <div>
        {/* <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase">
        {title}
      </h3> */}
        {/* divider */}
        <div className="flex flex-col gap-2">
          {/* <button
            onClick={() => handleCategoryClick("/casino/live-casino")}
            className="flex items-center bg-[var(--background-secondary)] gap-2 p-2 px-4 text-gray-300 hover:bg-gray-700 transition-colors text-left w-full"
          >
            <img src={`${BASE_URL}/images/icons/live-icon.svg`} alt="live-casino" className="w-6 h-6 flex-shrink-0 grayscale object-contain" />
            <span className="flex-1">Live Casino</span>
          </button> */}
          {categories.map((category, index) => (
            <Link
              key={index}
              onClick={() => handleCategoryClick(category.path)}
              href={category.path}
              className="flex items-center bg-[var(--background-secondary)] gap-2 p-2 px-4 text-gray-300 hover:bg-gray-700 transition-colors text-left w-full"
            >
              {category.icon && (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-6 h-6 flex-shrink-0 grayscale object-contain"
                />
              )}
              <span className="flex-1">{category.name}</span>
              {category.count !== undefined && (
                <span className="bg-[var(--background)] text-white text-xs px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-b-2 border-[var(--bar-background-color)] w-[calc(100% - 46px)] m-4" />

    </>
  );
}

