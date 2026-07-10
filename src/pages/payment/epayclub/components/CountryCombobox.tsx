import * as countryCodes from "country-codes-list";
import { clsx } from "clsx";
import { ChevronDown, Search } from "lucide-preact";
import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import { CHECKOUT } from "./checkoutTheme";

function countryFlag(code: string) {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );
}

const PRIORITY_COUNTRIES = [
  "SA",
  "AE",
  "KW",
  "QA",
  "OM",
  "BH",
  "LB",
  "JO",
  "IQ",
  "GB",
  "US",
];

const ALL_COUNTRIES = (() => {
  const map = countryCodes.customList("countryCode", "{countryNameEn}");
  return Object.entries(map)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => {
      const aPriority = PRIORITY_COUNTRIES.indexOf(a.code);
      const bPriority = PRIORITY_COUNTRIES.indexOf(b.code);
      if (aPriority !== -1 || bPriority !== -1) {
        if (aPriority === -1) return 1;
        if (bPriority === -1) return -1;
        return aPriority - bPriority;
      }
      return a.name.localeCompare(b.name);
    });
})();

type CountryComboboxProps = {
  value: string;
  onChange: (code: string) => void;
  label: string;
  error?: string;
  disabled?: boolean;
};

export function CountryCombobox({
  value,
  onChange,
  label,
  error,
  disabled,
}: CountryComboboxProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const selected = useMemo(
    () => ALL_COUNTRIES.find((c) => c.code === value.toUpperCase()) ?? null,
    [value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COUNTRIES.slice(0, 80);
    return ALL_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase() === q ||
        c.code.toLowerCase().startsWith(q),
    ).slice(0, 80);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setHighlightIndex(0);
  };

  const selectCountry = (code: string) => {
    onChange(code);
    close();
  };

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    setHighlightIndex(0);
  }, [open]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        close();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSearchKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[highlightIndex]) {
      e.preventDefault();
      selectCountry(filtered[highlightIndex].code);
    }
  };

  const floated = open || Boolean(value);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden field for form semantics without triggering browser address autofill */}
      <input
        type="hidden"
        name="billing-country-code"
        value={value}
        autoComplete="off"
        readOnly
      />

      <button
        type="button"
        id={listId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${listId}-listbox`}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        className={clsx(
          "relative w-full rounded-xl border bg-[#0F1624] text-left transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C16A]/40",
          disabled && "cursor-not-allowed opacity-60",
          error
            ? "border-[#F87171]/60"
            : open
              ? "border-[#00C16A]/40 shadow-[0_0_0_3px_rgba(0,193,106,0.12)]"
              : "border-[rgba(255,255,255,0.08)]",
        )}
      >
        <span
          className={clsx(
            "pointer-events-none absolute left-4 z-10 origin-left text-[#94A3B8] transition-all duration-200",
            floated
              ? "top-2 text-[11px] font-medium tracking-wide"
              : "top-1/2 -translate-y-1/2 text-[15px]",
            open && !error && "text-[#00C16A]",
            error && floated && "text-[#F87171]",
          )}
        >
          {label}
        </span>

        <span className="flex items-center gap-2 px-4 pb-2.5 pt-6">
          {selected ? (
            <span className="text-base leading-none" aria-hidden>
              {countryFlag(selected.code)}
            </span>
          ) : (
            <Search className="h-4 w-4 shrink-0 text-[#94A3B8]" aria-hidden />
          )}
          <span
            className={clsx(
              "min-w-0 flex-1 truncate text-[15px]",
              selected ? "text-[#F8FAFC]" : "text-[#64748B]",
            )}
          >
            {selected?.name ?? ""}
          </span>
          <ChevronDown
            className={clsx(
              "h-4 w-4 shrink-0 text-[#94A3B8] transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </span>
      </button>

      {open && !disabled ? (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#131B2C] shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="border-b border-[rgba(255,255,255,0.08)] p-2">
            <div className="flex items-center gap-2 rounded-lg bg-[#0F1624] px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-[#94A3B8]" aria-hidden />
              <input
                ref={searchRef}
                type="search"
                role="searchbox"
                aria-label={`Search ${label}`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellcheck={false}
                data-lpignore="true"
                data-1p-ignore
                name="country-filter-query"
                value={query}
                onInput={(e) =>
                  setQuery((e.currentTarget as HTMLInputElement).value)
                }
                onKeyDown={handleSearchKeyDown}
                placeholder="Search countries…"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                style={{ caretColor: CHECKOUT.primary }}
              />
            </div>
          </div>

          <ul
            id={`${listId}-listbox`}
            role="listbox"
            className="max-h-56 overflow-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-[#94A3B8]">No results</li>
            ) : (
              filtered.map((country, index) => (
                <li
                  key={country.code}
                  role="option"
                  aria-selected={value === country.code}
                >
                  <button
                    type="button"
                    className={clsx(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150",
                      value === country.code
                        ? "bg-[#00C16A]/10 text-[#F8FAFC]"
                        : index === highlightIndex
                          ? "bg-white/[0.06] text-[#F8FAFC]"
                          : "text-[#F8FAFC] hover:bg-white/[0.04]",
                    )}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => selectCountry(country.code)}
                  >
                    <span className="shrink-0 text-base leading-none" aria-hidden>
                      {countryFlag(country.code)}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{country.name}</span>
                    <span className="shrink-0 text-xs text-[#64748B]">
                      {country.code}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="mt-1.5 text-xs text-[#F87171]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
