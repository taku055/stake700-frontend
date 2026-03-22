import { localeState } from "@/state/localeState";
import { useEffect, useRef, useState } from "preact/hooks";
import { ChevronDown } from "lucide-preact";

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
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((o) => o.value === localeState.value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative h-full">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-[10px] h-full rounded-sm p-2 cursor-pointer ${
          !headerMode ? "bg-[var(--background)]" : "bg-[var(--footer-background)]"
        }`}
      >
        <span className={`fi fi-${currentOption?.flag || "us"}`}></span>
        {!headerMode && (
          <span className="text-[var(--text-transparent-color)]">
            {currentOption?.label}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[9999] mt-1 right-0 bg-white rounded-lg shadow-lg py-1 min-w-[160px] max-h-[320px] overflow-y-auto">
          {options.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => {
                localeState.value = lang.value;
                window.localStorage.setItem("locale", lang.value);
                setIsOpen(false);
              }}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 text-[#000000] hover:bg-[#0000002a] ${
                lang.value === localeState.value ? "bg-[#b4b4b4]" : ""
              }`}
            >
              <span className={`fi fi-${lang.flag}`}></span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
