import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronRight } from "lucide-preact";

interface CategoryItemsProps {
  categories: Array<{
    name: string;
    path: string;
    icon?: string;
  }>;
  title: string;
}

export default function CategoryItems({ categories, title }: CategoryItemsProps) {
  const { modifyHref } = useAffiliateNavigation();

  return (
    <div className="p-4">
      <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {categories.map((category, index) => (
          <a
            key={index}
            href={modifyHref(category.path)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {category.icon && (
              <img
                src={category.icon}
                alt={category.name}
                className="w-6 h-6 flex-shrink-0 object-contain"
              />
            )}
            <span className="flex-1">{category.name}</span>
            <ChevronRight size={16} className="text-gray-500" />
          </a>
        ))}
      </div>
    </div>
  );
}

