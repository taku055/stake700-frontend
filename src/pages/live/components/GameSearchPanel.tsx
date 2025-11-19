import { FunctionalComponent } from "preact";
import { Input } from "@heroui/react";
import { Search } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";

interface GameSearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClick: () => void;
}

export const GameSearchPanel: FunctionalComponent<GameSearchPanelProps> = ({
  searchQuery,
  onSearchChange,
  onSearchClick,
}) => {
  const t = useTranslations("CasinoDetailPage");

  return (
    <div className="w-full">
      <Input
        size="md"
        placeholder={t("Search Games") || "Search Games"}
        value={searchQuery}
        variant="bordered"
        endContent={
          <button
            onClick={onSearchClick}
            className="hover:opacity-70 transition-opacity"
          >
            <Search size={20} color="var(--text-transparent-color)" />
          </button>
        }
        classNames={{
          inputWrapper: "bg-[var(--bar-background-color)] border-none rounded-lg",
          input: "text-white text-[14px]",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearchClick();
          }
        }}
        onChange={(e) => {
          const target = e.target as HTMLInputElement | null;
          onSearchChange(target?.value ?? "");
        }}
      />
    </div>
  );
};

