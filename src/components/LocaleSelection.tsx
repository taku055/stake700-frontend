import { localeState } from "@/state/localeState";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export const options = [
  { label: "Русский", value: "ru", flag: "ru" },
  { label: "English", value: "en", flag: "us" },
  { label: "Deutsch", value: "de", flag: "de" },
  { label: "Français", value: "fr", flag: "fr" },
  { label: "العربية", value: "ar", flag: "ae", dir: "rtl" },
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
        className={
          headerMode
            ? "flex h-9 items-center gap-2 rounded-md bg-[#1a2c38] px-2.5 text-[#b1bad3] hover:text-white"
            : "flex h-full cursor-pointer items-center gap-[10px] rounded-sm p-2"
        }
      >
        <img src="/images/sidebar/language.webp" alt="" className="h-5 w-5 object-contain" />
        <span className={headerMode ? "text-xs font-bold uppercase" : "text-[var(--text-transparent-color)]"}>
          {headerMode ? currentOption?.value : currentOption?.label}
        </span>
        <ChevronDown
          size={headerMode ? 12 : 16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute end-0 z-[9999] mt-2 min-w-[168px] overflow-hidden rounded-md border border-[#2f4553] bg-[#0f212e] shadow-xl">
          {options.map((lang) => {
            const selected = lang.value === localeState.value;
            return (
              <button
                key={lang.value}
                type="button"
                onClick={() => {
                  localeState.value = lang.value;
                  window.localStorage.setItem("locale", lang.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between border-s-2 px-3 py-2.5 text-left text-sm ${
                  selected
                    ? "border-[#1475e1] bg-[#1a2c38] font-bold text-white"
                    : "border-transparent text-[#b1bad3] hover:bg-[#213743] hover:text-white"
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#7eb6ff]">
                  {lang.value}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
