import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { tProvider } from "@/types/tProvider";
import { useTranslations } from "@/context/I18nContext";

interface ProviderSelectionProps {
  providers: tProvider[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function ProviderSelection({ providers, value, onChange }: ProviderSelectionProps) {
  const t = useTranslations("CasinoPage");
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(
    () => [...providers].sort((a, b) => a.name.localeCompare(b.name)),
    [providers]
  );

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? sorted.filter((p) => p.name.toLowerCase().includes(q)) : sorted;
  }, [sorted, filter]);

  useEffect(() => {
    if (!open) {
      setFilter("");
      return;
    }
    const id = window.setTimeout(() => searchRef.current?.focus(), 30);
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-12 items-center gap-2 rounded-lg border px-3.5 text-[14px] font-semibold transition-colors ${
          open || value.length > 0
            ? "border-[var(--primary-color)] bg-[var(--bar-background-color)] text-white"
            : "border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] hover:border-[var(--background-tertiary)] hover:text-white"
        }`}
      >
        <SlidersHorizontal size={17} />
        <span className="max-sm:hidden">{t("Providers")}</span>
        {value.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary-color)] px-1.5 text-[11px] font-bold text-white">
            {value.length}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`transition-transform max-sm:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute end-0 top-full z-[120] mt-2 flex w-[320px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-xl border border-[var(--background-secondary)] bg-[var(--background)] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
          <div className="border-b border-[var(--background-secondary)] p-3">
            <div className="flex h-10 items-center gap-2 rounded-lg border border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-3 focus-within:border-[var(--primary-color)]">
              <Search size={15} className="shrink-0 text-[var(--text-muted-color)]" />
              <input
                ref={searchRef}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={t("search_providers")}
                aria-label={t("search_providers")}
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[var(--background-tertiary)]"
              />
              {filter && (
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={() => setFilter("")}
                  className="text-[var(--text-muted-color)] hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <ul
            role="listbox"
            aria-multiselectable="true"
            aria-label={t("Provider selection")}
            className="max-h-[320px] overflow-y-auto overscroll-contain p-1.5"
          >
            {visible.length === 0 && (
              <li className="px-3 py-8 text-center text-[13px] text-[var(--text-muted-color)]">
                {t("no_providers_found")}
              </li>
            )}
            {visible.map((p) => {
              const selected = value.includes(p.id);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => toggle(p.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-start transition-colors ${
                      selected ? "bg-[var(--bar-background-color)]" : "hover:bg-[var(--bar-background-color)]"
                    }`}
                  >
                    <span
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                        selected
                          ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-white"
                          : "border-[var(--background-tertiary)]"
                      }`}
                    >
                      {selected && <Check size={12} strokeWidth={3.5} />}
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-[14px] ${
                        selected ? "font-semibold text-white" : "text-[var(--text-muted-color)]"
                      }`}
                    >
                      {p.name}
                    </span>
                    {typeof p.count === "number" && p.count > 0 && (
                      <span className="shrink-0 rounded-md bg-[var(--background-secondary)] px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-[var(--text-muted-color)]">
                        {p.count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-3 py-2.5">
            <button
              type="button"
              disabled={value.length === 0}
              onClick={() => onChange([])}
              className="text-[13px] font-semibold text-[var(--text-muted-color)] transition-colors enabled:hover:text-white disabled:opacity-40"
            >
              {t("Clear all")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 rounded-md bg-[var(--primary-color)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover-color)]"
            >
              {t("done")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
