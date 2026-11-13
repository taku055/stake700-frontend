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
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { useTranslations } from "@/context/I18nContext";
import { cashDetailAmountForUnit } from "@/helpers/multipleBalance";
import { openAccountDialog } from "@/state/accountDialogs";
import { ChevronDown, Loader } from "lucide-react";
import { Link } from "@/components/common";
import { requireLogin } from "@/helpers/requireAuth";
import { placeholderGameImage } from "@/config/constants";
import { apiGetFreespinAvailableGames } from "@/api/ledger/apiGetFreespinAvailableGames";
import type { tFreespinAvailableGame } from "@/types/tFreespinAvailableGame";
import BonusExpiryCountdown from "@/components/BonusExpiryCountdown";
import { routes } from "@/config/routes";

type Pos = { top: number; left: number; width: number };

const VIEWPORT_MARGIN = 8;
const BELOW_TRIGGER_GAP = 10;

function clampDropdownLeft(
  triggerRect: DOMRect,
  panelWidth: number,
): number {
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

function computePosFromTrigger(triggerRect: DOMRect): Pos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxPanelW = Math.max(0, vw - VIEWPORT_MARGIN * 2);

  let width = Math.max(160, triggerRect.width);
  width = Math.min(width, maxPanelW);

  const estPanelW = Math.min(Math.max(width, 260), maxPanelW);
  const estHeight = 260;
  let left = clampDropdownLeft(triggerRect, estPanelW);

  let top = triggerRect.bottom + BELOW_TRIGGER_GAP;
  if (top + estHeight > vh - VIEWPORT_MARGIN) {
    top = Math.max(
      VIEWPORT_MARGIN,
      triggerRect.top - estHeight - BELOW_TRIGGER_GAP,
    );
  }

  return { top, left, width };
}

export default function WalletBox() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [freespinGames, setFreespinGames] = useState<tFreespinAvailableGame[]>(
    [],
  );
  const [freespinGamesLoading, setFreespinGamesLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("WalletBox");

  const [pos, setPos] = useState<Pos | null>(null);

  const applyClampFromDropdown = useCallback(() => {
    const el = triggerRef.current;
    const d = dropdownRef.current;
    if (!el || !d) return;

    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxPanelW = Math.max(0, vw - VIEWPORT_MARGIN * 2);

    let width = Math.max(160, Math.min(r.width, maxPanelW));
    const panelW = d.getBoundingClientRect().width;
    const panelH = d.getBoundingClientRect().height;

    const left = clampDropdownLeft(r, panelW);

    let top = r.bottom + BELOW_TRIGGER_GAP;
    if (top + panelH > vh - VIEWPORT_MARGIN) {
      top = Math.max(
        VIEWPORT_MARGIN,
        r.top - panelH - BELOW_TRIGGER_GAP,
      );
    }

    setPos((prev) => {
      if (!prev) return { top, left, width };
      if (
        Math.abs(prev.left - left) < 0.5 &&
        Math.abs(prev.top - top) < 0.5 &&
        Math.abs(prev.width - width) < 0.5
      ) {
        return prev;
      }
      return { top, left, width };
    });
  }, []);

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const d = dropdownRef.current;
    if (d) {
      applyClampFromDropdown();
      return;
    }
    setPos(computePosFromTrigger(el.getBoundingClientRect()));
  }, [applyClampFromDropdown]);

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

  useLayoutEffect(() => {
    if (!isSelectorOpen) return;

    const d = dropdownRef.current;
    if (!d) return;

    applyClampFromDropdown();

    const ro = new ResizeObserver(() => {
      applyClampFromDropdown();
    });
    ro.observe(d);

    const onScroll = () => updatePos();
    const onResize = () => updatePos();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [isSelectorOpen, applyClampFromDropdown, updatePos]);

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

  const freeSpins = useMemo(() => {
    const cur = currencyState.value;
    const user = userState.value;
    if (!cur || !user) return 0;
    if (user.role !== "NORMAL") return 0;
    return Number(balanceState.value?.[cur.code]?.freespin?.count ?? 0);
  }, [balanceState.value, currencyState.value, userState.value]);

  const bonusExpiresAt = useMemo(() => {
    const cur = currencyState.value;
    const user = userState.value;
    if (!cur || !user || user.role !== "NORMAL") return null;
    const bal = balanceState.value?.[cur.code];
    if (!bal?.bonus?.isActive) return null;
    return bal.bonusExpiresAt ?? null;
  }, [balanceState.value, currencyState.value, userState.value]);

  useEffect(() => {
    if (!isSelectorOpen) {
      setFreespinGames([]);
      setFreespinGamesLoading(false);
      return;
    }

    const user = userState.value;
    const cur = currencyState.value;
    if (!user || user.role !== "NORMAL" || !cur) {
      setFreespinGames([]);
      setFreespinGamesLoading(false);
      return;
    }

    let cancelled = false;
    setFreespinGamesLoading(true);

    (async () => {
      try {
        const games = await apiGetFreespinAvailableGames(user.id, cur.code);
        if (!cancelled) {
          setFreespinGames(games);
        }
      } catch {
        if (!cancelled) {
          setFreespinGames([]);
        }
      } finally {
        if (!cancelled) {
          setFreespinGamesLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSelectorOpen, currencyState.value?.code, userState.value?.id, userState.value?.role]);

  const displayedFreeSpins = useMemo(() => {
    if (freespinGames.length > 0) {
      return freespinGames.reduce((sum, item) => sum + item.remaining, 0);
    }
    return freeSpins;
  }, [freespinGames, freeSpins]);

  return (
    <div
      ref={wrapperRef}
      className="relative inline-flex items-center select-none"
    >
      {/* Balance trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (isSelectorOpen) {
            setIsSelectorOpen(false);
            setPos(null);
            return;
          }
          const el = triggerRef.current;
          if (el) {
            setPos(computePosFromTrigger(el.getBoundingClientRect()));
          } else {
            setPos({
              top: VIEWPORT_MARGIN,
              left: VIEWPORT_MARGIN,
              width: 160,
            });
          }
          setIsSelectorOpen(true);
        }}
        aria-haspopup="menu"
        aria-expanded={isSelectorOpen}
        className={[
          "flex h-10 items-center gap-2 rounded-md border border-[#2f4553] bg-[#1a2c38] px-3 text-white",
          "hover:border-[#1475e1]",
          isSelectorOpen ? "border-[#1475e1]" : "",
        ].join(" ")}
      >
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#7eb6ff]">
          {symbol}
        </span>
        <span className="text-sm font-bold tabular-nums">{formattedTotal}</span>
        <ChevronDown
          size={14}
          className={[
            "text-[#b1bad3] transition-transform duration-200",
            isSelectorOpen ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown rendered in a Portal so it won't be clipped */}
      {isSelectorOpen && pos && (
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
            <div className="flex w-[320px] max-w-[calc(100vw-1rem)] flex-col">
              <div className="border-b border-[#2f4553] px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7eb6ff]">
                  {t("Total Balance")}
                </p>
                <p className="mt-1 text-3xl font-extrabold tabular-nums text-white">
                  {symbol} {formattedTotal}
                </p>
                <button
                  type="button"
                  className="mt-3 h-10 w-full rounded-md bg-[#1475e1] text-sm font-bold text-white hover:bg-[#0f62c2]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAccountDialog("/balance-management/deposit");
                    setIsSelectorOpen(false);
                  }}
                >
                  {t("Deposit") || "Deposit"}
                </button>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[#2f4553]">
                <div className="px-3 py-3">
                  <p className="text-[11px] text-[#b1bad3]">{t("Cash")}</p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-white">
                    {symbol} {cash.toFixed(2)}
                  </p>
                </div>
                <div className="px-3 py-3">
                  <p className="text-[11px] text-[#b1bad3]">{t("Bonus")}</p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-white">
                    {symbol} {bonus.toFixed(2)}
                  </p>
                  {bonusExpiresAt && (
                    <BonusExpiryCountdown
                      bonusExpiresAt={bonusExpiresAt}
                      className="mt-1 block text-[11px]"
                      normalClassName="text-emerald-300/90"
                      urgentClassName="text-amber-300"
                      expiredClassName="text-red-300"
                    />
                  )}
                </div>
                <div className="px-3 py-3">
                  <p className="flex items-center gap-1 text-[11px] text-[#b1bad3]">
                    {freespinGamesLoading && (
                      <Loader size={12} className="animate-spin" aria-hidden="true" />
                    )}
                    {t("Available spins")}
                  </p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-white">
                    {displayedFreeSpins}
                  </p>
                </div>
              </div>

              {!freespinGamesLoading && freespinGames.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-[#2f4553] px-3 py-3">
                    <div className="mt-2 flex flex-col gap-2">
                      {freespinGames.map((item) => {
                        const game = item.game;
                        if (!game) return null;
                        const imgSrc =
                          game.img_custom || game.img || placeholderGameImage;
                        return (
                          <Link
                            key={item.gameId}
                            href={routes.game(game.id, game.name)}
                            scrollToTop
                            preventDefaultOnClick={false}
                            stopPropagationOnClick={false}
                            className="flex items-center gap-2.5 rounded-md bg-[#1a2c38] px-2 py-1.5 hover:bg-[#213743]"
                            title={game.name}
                            onClick={(e) => {
                              if (!requireLogin()) {
                                e.preventDefault();
                                return;
                              }
                              setIsSelectorOpen(false);
                            }}
                          >
                            <img
                              src={imgSrc}
                              alt={game.name}
                              className="w-10 h-10 rounded-md object-cover shrink-0 border border-white/15"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  placeholderGameImage;
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-[12px] font-semibold text-white truncate">
                                {game.name}
                              </div>
                              <div className="mt-0.5 text-[11px] text-white/70 tabular-nums">
                                {item.remaining} {t("left")}
                                {" · "}
                                {symbol}
                                {Number(item.perSpinCost).toFixed(2)}{" "}
                                {t("Per spin")}
                              </div>
                              <BonusExpiryCountdown
                                bonusExpiresAt={item.expireAt}
                                className="mt-0.5 block text-[11px]"
                                normalClassName="text-emerald-300/90"
                                urgentClassName="text-amber-300"
                                expiredClassName="text-red-300"
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
