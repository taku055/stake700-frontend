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

const PRIORITY_COUNTRIES = ["SA", "AE", "KW", "QA", "OM", "BH", "LB", "JO", "IQ", "GB", "US"];

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const selected = useMemo(
    () => ALL_COUNTRIES.find((c) => c.code === value) ?? null,
    [value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COUNTRIES.slice(0, 80);
    return ALL_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q),
    ).slice(0, 80);
  }, [query]);

  const floated = focused || open || Boolean(value);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={clsx(
          "relative rounded-xl border bg-[#0F1624] transition-all duration-200",
          disabled && "opacity-60",
          error
            ? "border-[#F87171]/60"
            : focused || open
              ? "border-[#00C16A]/40 shadow-[0_0_0_3px_rgba(0,193,106,0.12)]"
              : "border-[rgba(255,255,255,0.08)]",
        )}
      >
        <label
          htmlFor={listId}
          className={clsx(
            "pointer-events-none absolute left-4 z-10 origin-left text-[#94A3B8] transition-all duration-200",
            floated
              ? "top-2 text-[11px] font-medium tracking-wide"
              : "top-1/2 -translate-y-1/2 text-[15px]",
            (focused || open) && !error && "text-[#00C16A]",
            error && floated && "text-[#F87171]",
          )}
        >
          {label}
        </label>

        <div className="flex items-center gap-2 px-4 pb-2.5 pt-6">
          {selected ? (
            <span className="text-base leading-none" aria-hidden>
              {countryFlag(selected.code)}
            </span>
          ) : (
            <Search className="h-4 w-4 shrink-0 text-[#94A3B8]" aria-hidden />
          )}
          <input
            ref={inputRef}
            id={listId}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls={`${listId}-listbox`}
            disabled={disabled}
            value={open ? query : selected?.name ?? ""}
            onFocus={() => {
              setFocused(true);
              setOpen(true);
              setQuery("");
            }}
            onInput={(e) => {
              setQuery((e.currentTarget as HTMLInputElement).value);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                inputRef.current?.blur();
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#F8FAFC] outline-none"
            style={{ caretColor: CHECKOUT.primary }}
          />
          <ChevronDown
            className={clsx(
              "h-4 w-4 shrink-0 text-[#94A3B8] transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </div>
      </div>

      {open && !disabled ? (
        <ul
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute z-50 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#131B2C] py-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[#94A3B8]">No results</li>
          ) : (
            filtered.map((country) => (
              <li key={country.code} role="option" aria-selected={value === country.code}>
                <button
                  type="button"
                  className={clsx(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150",
                    value === country.code
                      ? "bg-[#00C16A]/10 text-[#F8FAFC]"
                      : "text-[#F8FAFC] hover:bg-white/[0.04]",
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(country.code);
                    setQuery("");
                    setOpen(false);
                    setFocused(false);
                    inputRef.current?.blur();
                  }}
                >
                  <span aria-hidden>{countryFlag(country.code)}</span>
                  <span>{country.name}</span>
                  <span className="ml-auto text-xs text-[#94A3B8]">
                    {country.code}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {error ? (
        <p className="mt-1.5 text-xs text-[#F87171]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
