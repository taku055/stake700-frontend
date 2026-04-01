import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Portal } from "./Portal";
import { userState } from "@/state/userState";
import { profileOpenedState } from "@/state/profileOpenedState";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { useTranslations } from "@/context/I18nContext";
import { cashDetailAmountForUnit } from "@/helpers/multipleBalance";

type Pos = { top: number; left: number; width: number };

const VIEWPORT_MARGIN = 8;
const BELOW_TRIGGER_GAP = 10;

function clampDropdownLeft(
  triggerRect: DOMRect,
  panelWidth: number,
): number {
  const vw = window.innerWidth;
  let left = triggerRect.left;
  if (left + panelWidth > vw - VIEWPORT_MARGIN) {
    left = Math.max(VIEWPORT_MARGIN, triggerRect.right - panelWidth);
  }
  if (left < VIEWPORT_MARGIN) {
    left = VIEWPORT_MARGIN;
  }
  return left;
}

export default function WalletBox() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("WalletBox");

  const [pos, setPos] = useState<Pos | null>(null);

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxPanelW = Math.max(0, vw - VIEWPORT_MARGIN * 2);

    let width = Math.max(160, r.width);
    width = Math.min(width, maxPanelW);

    let left = r.left;
    if (left + width > vw - VIEWPORT_MARGIN) {
      left = vw - VIEWPORT_MARGIN - width;
    }
    if (left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN;
    }

    const estHeight = 220;
    let top = r.bottom + BELOW_TRIGGER_GAP;
    if (top + estHeight > vh - VIEWPORT_MARGIN) {
      top = Math.max(
        VIEWPORT_MARGIN,
        r.top - estHeight - BELOW_TRIGGER_GAP
      );
    }

    setPos({ top, left, width });
  }, []);

  useEffect(() => {
    if (!isSelectorOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const w = wrapperRef.current;
      const d = dropdownRef.current;
      const t = e.target as Node;

      if (w && w.contains(t)) return;
      if (d && d.contains(t)) return;
      setIsSelectorOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSelectorOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isSelectorOpen]);

  useEffect(() => {
    if (!isSelectorOpen) return;

    updatePos();

    const onScroll = () => updatePos();
    const onResize = () => updatePos();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [isSelectorOpen, updatePos]);

  useLayoutEffect(() => {
    if (!isSelectorOpen || !pos) return;
    const el = triggerRef.current;
    const d = dropdownRef.current;
    if (!el || !d) return;
    const r = el.getBoundingClientRect();
    const left = clampDropdownLeft(r, d.offsetWidth);
    setPos((prev) => {
      if (!prev) return prev;
      if (Math.abs(prev.left - left) < 0.5) {
        return prev;
      }
      return { ...prev, left };
    });
  }, [isSelectorOpen, pos]);

  useEffect(() => {
    if (!isSelectorOpen) return;
    requestAnimationFrame(() => {
      dropdownRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    });
  }, [isSelectorOpen]);

  const formattedTotal = useMemo(() => {
    const cur = currencyState.value;
    if (userState.value == null || cur == null) return "0.00";
    const { cash, bonus } = (() => {
      if (userState.value.role === "NORMAL") {
        return {
          cash: Number(balanceState.value?.[cur.code]?.cash?.balance ?? 0),
          bonus: Number(balanceState.value?.[cur.code]?.bonus?.balance ?? 0),
        };
      }

      return {
        cash: cashDetailAmountForUnit(userState.value.cashDetails, cur.unit),
        bonus: 0,
      };
    })();

    return (cash + bonus).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [currencyState.value, balanceState.value, userState.value]);

  const symbol = currencyState.value.symbol ?? "";
  const { cash, bonus } = useMemo(() => {
    const cur = currencyState.value;
    const user = userState.value;
    if (!cur || !user) return { cash: 0, bonus: 0 };

    if (user.role === "NORMAL") {
      return {
        cash: Number(balanceState.value?.[cur.code]?.cash?.balance ?? 0),
        bonus: Number(balanceState.value?.[cur.code]?.bonus?.balance ?? 0),
      };
    }

    return {
      cash: cashDetailAmountForUnit(user.cashDetails, cur.unit),
      bonus: 0,
    };
  }, [balanceState.value, currencyState.value, userState.value]);

  return (
    <div
      ref={wrapperRef}
      className={[
        // pill / glass like the header widgets
        "relative inline-flex items-center gap-1 select-none",
        "rounded-full p-1",
        "bg-[var(--green-color)]/20 backdrop-blur-md",
        "border border-white/10",
        "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
        "transition",
        "hover:bg-[var(--green-color)]/40 hover:border-white/15",
      ].join(" ")}
    >
      {/* Balance trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsSelectorOpen((v) => !v);
        }}
        aria-haspopup="menu"
        aria-expanded={isSelectorOpen}
        className={[
          "flex items-center gap-1",
          "rounded-full pl-2 py-1",
          "text-white",
          "transition",
          "hover:bg-white/10",
          isSelectorOpen ? "bg-white/10" : "",
        ].join(" ")}
      >
        <span className="text-[12px] md:text-[13px] font-semibold tracking-wide opacity-90">
          {symbol}
        </span>

        <span className="text-[12px] md:text-[13px] font-bold tabular-nums">
          {formattedTotal}
        </span>

        {/* caret */}
        <span
          className={[
            "ml-0.5 inline-block",
            "text-white/70",
            "transition-transform duration-200",
            isSelectorOpen ? "rotate-180" : "rotate-0",
          ].join(" ")}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {/* Divider (subtle, like header separators) */}
      <div className="h-7 w-px bg-white/10" />

      {/* Avatar */}
      <button
        type="button"
        className={[
          "relative",
          "w-8 h-8 rounded-full",
          "grid place-items-center",
          "text-white font-bold",
          "bg-white/10",
          "border border-white/10",
          "transition",
          "hover:bg-white/15 hover:border-white/15",
          "active:scale-[0.98]",
        ].join(" ")}
        onClick={(e) => {
          e.stopPropagation();
          profileOpenedState.value = { isOpen: true };
          setIsSelectorOpen(false);
        }}
        aria-label="Open profile"
      >
        <span className="text-[13px]">
          {userState.value?.userName?.at(0)?.toUpperCase()}
        </span>

        {/* tiny status dot (optional vibe) */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#2a0b3b]" />
      </button>

      {/* Dropdown rendered in a Portal so it won't be clipped */}
      {isSelectorOpen && pos && (
        <Portal>
          <div
            ref={dropdownRef}
            role="menu"
            className={[
              "z-[9999]",
              "rounded-xl overflow-hidden",
              "bg-[var(--green-color)]/20 backdrop-blur-md",
              "border border-white/10",
              "shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
              "max-w-[calc(100vw-1rem)]",
              "max-h-[min(85vh,calc(100dvh-2rem))] overflow-y-auto",
              "box-border",
            ].join(" ")}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              minWidth: pos.width,
              maxWidth: `calc(100vw - ${VIEWPORT_MARGIN * 2}px)`,
            }}
          >
            <div className="px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/55">
                {t("Currency")}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex flex-col p-1">
              <div
                className={[
                  "w-full text-left",
                  "rounded-lg px-3 py-2.5",
                  "text-[13px] text-white",
                  "transition",
                  "focus:outline-none focus:ring-2 focus:ring-white/20 items-center gap-2 flex justify-between",
                ].join(" ")}
              >
                <span className="opacity-80">{t("Cash")}</span>
                <span className="font-semibold">{cash.toFixed(2)}</span>
              </div>
              <div
                className={[
                  "w-full text-left",
                  "rounded-lg px-3 py-2.5",
                  "text-[13px] text-white",
                  "transition",
                  "focus:outline-none focus:ring-2 focus:ring-white/20 items-center gap-2 flex justify-between",
                ].join(" ")}
              >
                <span className="opacity-80">{t("Bonus")}</span>
                <span className="font-semibold">{bonus.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
