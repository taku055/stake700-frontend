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
import { profileOpenedState } from "@/state/profileOpenedState";
import { Loader } from "lucide-preact";
import { Link } from "@/components/common";
import { placeholderGameImage } from "@/config/constants";
import { apiGetFreespinAvailableGames } from "@/api/ledger/apiGetFreespinAvailableGames";
import type { tFreespinAvailableGame } from "@/types/tFreespinAvailableGame";

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

  useEffect(() => {
    if (!isSelectorOpen) {
      setFreespinGames([]);
      setFreespinGamesLoading(false);
      return;
    }

    const user = userState.value;
    const cur = currencyState.value;
    if (!user || user.role !== "NORMAL" || !cur || freeSpins <= 0) {
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
  }, [isSelectorOpen, freeSpins, currencyState.value?.code, userState.value?.id, userState.value?.role]);

  const userInitial =
    userState.value?.userName?.trim()?.at(0)?.toUpperCase() ?? "?";

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
          "flex items-center gap-1",
          "rounded-full px-2 py-1",
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

      {/* Dropdown rendered in a Portal so it won't be clipped */}
      {isSelectorOpen && pos && (
        <Portal>
          <div
            ref={dropdownRef}
            role="menu"
            className={[
              "z-[9999]",
              "rounded-xl overflow-hidden",
              "bg-[#323232] backdrop-blur-md",
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
            <div className="flex flex-col gap-3 p-4">
              {/* Top row: avatar */}
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "w-10 h-10 rounded-[4px]",
                    "grid place-items-center",
                    "bg-white border border-white/10",
                    "text-black font-bold",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] tracking-[0.14em] text-white/55">
                    {userState.value?.email}
                  </div>
                  <div className="text-[13px] text-white font-semibold truncate">
                    {userState.value?.userName}
                  </div>
                </div>
              </div>

              {/* Total balance card + deposit */}
              <div
                className={[
                  "rounded-xl",
                  "bg-white/10 border border-white/10",
                  "px-4 py-3",
                  "flex items-center justify-between gap-[100px] md:gap-[150px]",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <div className="text-[11px] tracking-[0.14em] text-white/55">
                    {t("Total Balance")}
                  </div>
                  <div className="text-[18px] leading-[22px] font-bold text-white tabular-nums truncate">
                    {symbol} {formattedTotal}
                  </div>
                </div>

                <button
                  type="button"
                  className={[
                    "shrink-0",
                    "w-10 h-10 rounded-lg",
                    "grid place-items-center",
                    "bg-[var(--green-color)]/30 hover:bg-[var(--green-color)]/45",
                    "border border-white/10",
                    "text-white text-[20px] leading-none font-semibold",
                    "transition",
                    "focus:outline-none focus:ring-2 focus:ring-white/20",
                  ].join(" ")}
                  onClick={(e) => {
                    e.stopPropagation();
                    profileOpenedState.value = {
                      isOpen: true,
                      defaultTab: "/balance-management/deposit",
                    };
                    setIsSelectorOpen(false);
                  }}
                  aria-label={t("Deposit") || "Deposit"}
                >
                  +
                </button>
              </div>

              {/* Balances */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-black/10">
                  <span className="text-[13px] text-white/80">
                    {t("Cash")}
                  </span>
                  <span className="text-[13px] font-semibold text-white tabular-nums">
                    {symbol} {cash.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-black/10">
                  <span className="text-[13px] text-white/80">
                    {t("Bonus")}
                  </span>
                  <span className="text-[13px] font-semibold text-white tabular-nums">
                    {symbol} {bonus.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-black/10">
                  <span className="text-[13px] text-white/80">
                    {t("Available spins") || "Available spins"}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[13px] font-semibold text-white tabular-nums shrink-0">
                      {freeSpins}
                    </span>
                    {freeSpins > 0 && freespinGamesLoading && (
                      <Loader
                        size={14}
                        className="animate-spin text-white/60 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {!freespinGamesLoading && freespinGames.length > 0 && (
                      <div className="flex items-center gap-1">
                        {freespinGames.map((item) => {
                          const game = item.game;
                          if (!game) return null;
                          const imgSrc =
                            game.img_custom || game.img || placeholderGameImage;
                          return (
                            <Link
                              key={item.gameId}
                              href={`/game/${game.id}`}
                              scrollToTop
                              preventDefaultOnClick={false}
                              stopPropagationOnClick={false}
                              className={[
                                "shrink-0 block",
                                "w-7 h-7 rounded-md overflow-hidden",
                                "border border-white/15",
                                "hover:border-white/35 transition",
                              ].join(" ")}
                              title={game.name}
                              onClick={() => setIsSelectorOpen(false)}
                            >
                              <img
                                src={imgSrc}
                                alt={game.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    placeholderGameImage;
                                }}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
