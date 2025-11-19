import { localeState } from "@/state/localeState";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

const options = [
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
  { label: "עברית", value: "he", flag: "il", dir: "rtl" },
  { label: "فارسی", value: "fa", flag: "ir", dir: "rtl" },
  { label: "العربية", value: "ar", flag: "sa", dir: "rtl" },
];

interface LocaleSelectionProps {
  headerMode?: boolean;
}

export default function LocaleSelection({
  headerMode = true,
}: LocaleSelectionProps) {
  return (
    <Dropdown backdrop="blur" className="bg-[var(--background)] h-full">
      <DropdownTrigger>
        <div
          className={`flex items-center gap-1 bg-[var(--background)] h-full rounded-sm p-2 ${
            !headerMode ? "" : "bg-[var(--footer-background)]"
          }`}
        >
          <span
            className={`fi fi-${
              options.find((o) => o.value === localeState.value)?.flag || "us"
            }`}
          ></span>
          {!headerMode && (
            <span className="text-[var(--text-transparent-color)] text-[12px]">
              {options.find((o) => o.value === localeState.value)?.label}
            </span>
          )}
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Change Locale">
        {options.map((lang) => (
          <DropdownItem
            key={lang.value}
            value={lang.value}
            onPress={() => {
              localeState.value = lang.value;
              window.localStorage.setItem("locale", lang.value);
            }}
          >
            <div className="flex items-center gap-2">
              <span className={`fi fi-${lang.flag}`}></span>
              {lang.label}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
