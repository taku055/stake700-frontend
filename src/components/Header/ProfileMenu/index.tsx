import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "preact-iso";
import { Portal } from "../WalletBox/Portal";
import { useTranslations } from "@/context/I18nContext";
import { profileOpenedState } from "@/state/profileOpenedState";
import { userState } from "@/state/userState";
import { accessTokenState } from "@/state/accessTokenState";
import { setAxiosAuthToken } from "@/api/instance";

type Pos = { top: number; left: number; width: number };

const VIEWPORT_MARGIN = 8;
const BELOW_TRIGGER_GAP = 10;

function clampDropdownLeft(triggerRect: DOMRect, panelWidth: number): number {
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

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);
  const location = useLocation();

  const tHeader = useTranslations("Header");
  const tCommon = useTranslations("Common");

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxPanelW = Math.max(0, vw - VIEWPORT_MARGIN * 2);

    let width = Math.max(180, r.width);
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
      top = Math.max(VIEWPORT_MARGIN, r.top - estHeight - BELOW_TRIGGER_GAP);
    }

    setPos({ top, left, width });
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const w = wrapperRef.current;
      const d = dropdownRef.current;
      const target = e.target as Node;
      if (w && w.contains(target)) return;
      if (d && d.contains(target)) return;
      setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    updatePos();

    const onScroll = () => updatePos();
    const onResize = () => updatePos();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updatePos]);

  useLayoutEffect(() => {
    if (!open || !pos) return;
    const el = triggerRef.current;
    const d = dropdownRef.current;
    if (!el || !d) return;
    const r = el.getBoundingClientRect();
    const left = clampDropdownLeft(r, d.offsetWidth);
    setPos((prev) => {
      if (!prev) return prev;
      if (Math.abs(prev.left - left) < 0.5) return prev;
      return { ...prev, left };
    });
  }, [open, pos]);

  const openProfile = useCallback(
    (defaultTab?: string) => {
      profileOpenedState.value = { isOpen: true, ...(defaultTab ? { defaultTab } : {}) };
      setOpen(false);
    },
    [],
  );

  const onLogout = useCallback(() => {
    userState.value = null;
    setAxiosAuthToken("");
    accessTokenState.value = null;
    setOpen(false);
    if (location.path.includes("agent")) {
      location.route("/");
    }
  }, [location.path]);

  const initial = userState.value?.userName?.at(0)?.toUpperCase() ?? "?";

  return (
    <div ref={wrapperRef} className="relative inline-flex items-center select-none">
      <button
        ref={triggerRef}
        type="button"
        className={[
          "relative",
          "w-10 h-10 rounded-full",
          "grid place-items-center",
          "text-white font-bold",
          "bg-white/10 backdrop-blur-md",
          "border border-white/10",
          "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          "transition",
          "hover:bg-white/15 hover:border-white/15",
          "active:scale-[0.98]",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={tHeader("Open profile") || "Open profile"}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span className="text-[14px]">{initial}</span>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#2a0b3b]" />
      </button>

      {open && pos && (
        <Portal>
          <div
            ref={dropdownRef}
            role="menu"
            className={[
              "z-[9999]",
              "rounded-xl overflow-hidden",
              "bg-[#171412]/95 backdrop-blur-md",
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
                {userState.value?.userName ?? tHeader("User avatar") ?? "User"}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex flex-col p-1">
              <button
                type="button"
                role="menuitem"
                className="w-full text-left rounded-lg px-3 py-2.5 text-[13px] text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                onClick={() => openProfile()}
              >
                {tHeader("Open profile") || "Open profile"}
              </button>
              <button
                type="button"
                role="menuitem"
                className="w-full text-left rounded-lg px-3 py-2.5 text-[13px] text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                onClick={() => openProfile("/balance-management/deposit")}
              >
                {tCommon("Deposit") || "Deposit"}
              </button>
              <button
                type="button"
                role="menuitem"
                className="w-full text-left rounded-lg px-3 py-2.5 text-[13px] text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                onClick={() => openProfile("/balance-management/withdraw")}
              >
                {tCommon("Withdraw") || "Withdraw"}
              </button>

              <div className="my-1 h-px bg-white/10" />

              <button
                type="button"
                role="menuitem"
                className="w-full text-left rounded-lg px-3 py-2.5 text-[13px] text-red-200 transition hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                onClick={onLogout}
              >
                {tHeader("logout") || "Logout"}
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

