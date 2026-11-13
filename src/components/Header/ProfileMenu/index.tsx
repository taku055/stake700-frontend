import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "@/router";
import { Portal } from "../WalletBox/Portal";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { openAccountDialog } from "@/state/accountDialogs";
import { userState } from "@/state/userState";
import { accessTokenState } from "@/state/accessTokenState";
import { setAxiosAuthToken } from "@/api/instance";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { KeyRound, LogOut, Wallet, X } from "lucide-react";
import {
  PROFILE_MENU_ITEMS,
  isProfileMenuHrefItem,
  type ProfileMenuActionKey,
} from "./profileMenuData";

type Pos = { top: number; left: number; width: number };

const VIEWPORT_MARGIN = 8;
const BELOW_TRIGGER_GAP = 10;

function clampDropdownLeft(triggerRect: DOMRect, panelWidth: number): number {
  const vw = window.innerWidth;
  const clampedW = Math.min(panelWidth, vw - VIEWPORT_MARGIN * 2);
  let left = triggerRect.left;
  if (left + clampedW > vw - VIEWPORT_MARGIN) {
    left = Math.max(VIEWPORT_MARGIN, triggerRect.right - clampedW);
  }
  if (left < VIEWPORT_MARGIN) {
    left = VIEWPORT_MARGIN;
  }
  return left;
}

function dispatchProfileMenuAction(
  action: ProfileMenuActionKey,
  ctx: {
    defaultTab?: string;
    openProfile: (defaultTab?: string) => void;
    onLogout: () => void;
  },
): void {
  switch (action) {
    case "openProfile":
      ctx.openProfile(ctx.defaultTab);
      return;
    case "logout":
      ctx.onLogout();
      return;
    default: {
      const _never: never = action;
      return _never;
    }
  }
}

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);
  const location = useLocation();
  const { handleNavigate } = useAffiliateNavigation();

  const tHeader = useTranslations("Header");
  const tCommon = useTranslations("Common");

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxPanelW = Math.max(0, vw - VIEWPORT_MARGIN * 2);

    let width = Math.max(280, r.width);
    width = Math.min(width, maxPanelW);

    let left = r.left;
    if (left + width > vw - VIEWPORT_MARGIN) {
      left = vw - VIEWPORT_MARGIN - width;
    }
    if (left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN;
    }

    const estHeight = 320;
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

  const openProfile = useCallback((defaultTab?: string) => {
    openAccountDialog(defaultTab);
    setOpen(false);
  }, []);

  const onLogout = useCallback(() => {
    userState.value = null;
    setAxiosAuthToken("");
    accessTokenState.value = null;
    setOpen(false);
    if (location.path.includes("agent")) {
      location.route("/");
    }
  }, [location.path]);

  const userInitial =
    userState.value?.userName?.trim()?.at(0)?.toUpperCase() ?? "?";

  return (
    <div ref={wrapperRef} className="relative inline-flex items-center select-none">
      <button
        ref={triggerRef}
        type="button"
        className="flex h-10 max-w-[9rem] items-center rounded-md bg-[#1475e1] px-3 text-sm font-bold text-white hover:bg-[#0f62c2]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={tHeader("Open profile") || "Open profile"}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span className="truncate">
          {userState.value?.userName?.trim() || userInitial}
        </span>
      </button>

      {open && pos && (
        <Portal>
          <div
            ref={dropdownRef}
            role="menu"
            className={[
              "z-[9999]",
              "overflow-hidden rounded-md",
              "bg-[#0f212e]",
              "border border-[#2f4553]",
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
            <div className="border-b border-[#2f4553] bg-[#1a2c38] px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">
                    {userState.value?.userName}
                  </div>
                  <div className="truncate text-xs text-[#b1bad3]">
                    {userState.value?.email}
                  </div>
                </div>
                <button
                  type="button"
                  className={[
                    "shrink-0 rounded-lg p-1.5",
                    "text-white/70 hover:bg-white/10 hover:text-white",
                    "transition focus:outline-none focus:ring-2 focus:ring-white/25",
                  ].join(" ")}
                  aria-label={tHeader("Close menu")}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                >
                  <X className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>

            <div className="py-1">
              <div className="flex flex-col">
                {PROFILE_MENU_ITEMS.map((item) => {
                  const label = tHeader(item.labelKey) || item.labelKey;
                  const isLogout = item.id === "logout";
                  const baseBtn = [
                    "flex w-full items-center gap-3 border-b border-[#213743] px-4 py-3 text-left text-sm font-semibold last:border-b-0",
                    isLogout
                      ? "text-[#b1bad3] hover:bg-[#213743] hover:text-white"
                      : "text-white hover:bg-[#213743]",
                  ].join(" ");

                  const menuIcon = isLogout ? (
                    <LogOut
                      className="w-4 h-4 shrink-0 opacity-90"
                      strokeWidth={2}
                      aria-hidden
                    />
                  ) : item.id === "wallet" ? (
                    <Wallet
                      className="w-4 h-4 shrink-0 opacity-90"
                      strokeWidth={2}
                      aria-hidden
                    />
                  ) : item.id === "change-password" ? (
                    <KeyRound
                      className="w-4 h-4 shrink-0 opacity-90"
                      strokeWidth={2}
                      aria-hidden
                    />
                  ) : (
                    <img
                      src={item.iconSrc!}
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4 shrink-0 opacity-90 object-contain"
                      aria-hidden
                    />
                  );

                  if (isProfileMenuHrefItem(item)) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        role="menuitem"
                        className={baseBtn}
                        scrollToTop
                        onClick={() => {
                          handleNavigate(item.href);
                          setOpen(false);
                        }}
                      >
                        {menuIcon}
                        <span className="min-w-0 leading-snug">{label}</span>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      className={baseBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatchProfileMenuAction(item.action, {
                          defaultTab: item.defaultTab,
                          openProfile,
                          onLogout,
                        });
                      }}
                    >
                      {menuIcon}
                      <span className="min-w-0 leading-snug text-left">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
