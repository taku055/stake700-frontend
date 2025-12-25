import { localeState } from "@/state/localeState";
import { useState } from "preact/hooks";
import { ChevronDown } from "lucide-preact";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

export const options = [
  { label: "Türkçe", value: "tr", flag: "tr" },
  { label: "Azərbaycanca", value: "az", flag: "az" },
  { label: "Русский", value: "ru", flag: "ru" },
  { label: "English", value: "en", flag: "us" },
  { label: "Ελληνικά", value: "el", flag: "gr" },
  { label: "Español", value: "es", flag: "es" },
  { label: "Português", value: "pt", flag: "pt" },
  { label: "Italiano", value: "it", flag: "it" },
  { label: "Deutsch", value: "de", flag: "de" },
  { label: "Français", value: "fr", flag: "fr" },
  // { label: "עברית", value: "he", flag: "il", dir: "rtl" },
  { label: "فارسی", value: "fa", flag: "ir", dir: "rtl" },
  { label: "العربية", value: "ar", flag: "sa", dir: "rtl" },
];

interface LocaleSelectionProps {
  headerMode?: boolean;
}

export default function LocaleSelection({
  headerMode = true,
}: LocaleSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      // backdrop="blur" 
      className="bg-[var(--background)] h-full w-full text-[16px] items-center justify-center"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownTrigger className="w-full">
        <div
          className={`flex items-center gap-[10px] bg-[var(--background)] h-full rounded-sm p-2 ${!headerMode ? "" : "bg-[var(--footer-background)]"
            }`}
        >
          <span
            className={`fi fi-${options.find((o) => o.value === localeState.value)?.flag || "us"
              }`}
          ></span>
          {!headerMode && (
            <span className="text-[var(--text-transparent-color)]">
              {options.find((o) => o.value === localeState.value)?.label}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Change Locale" className="bg-[#FFFFFF]  rounded-lg">
        {options.map((lang) => (
          <DropdownItem
            key={lang.value}
            value={lang.value}
            onPress={() => {
              localeState.value = lang.value;
              window.localStorage.setItem("locale", lang.value);
            }}
            className={`rounded-lg p-2 ${lang.value === localeState.value ? "bg-[#b4b4b4]" : ""}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0000002a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";
            }}
          >
            <div className="flex items-center gap-3 my-2 text-[#000000]">
              <span className={`fi fi-${lang.flag}`}></span>
              {lang.label}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
