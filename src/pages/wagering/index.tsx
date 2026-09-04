import { useEffect, useState } from "preact/hooks";
import Loader from "@/components/Loader";
import LoginRequest from "@/components/LoginRequest";
import BonusExpiryCountdown from "@/components/BonusExpiryCountdown";
import { userState } from "@/state/userState";
import { WageringProgress } from "@/types/tUserLedger";
import { Progress, Chip, Button } from "@heroui/react";
import { toast } from "@/helpers/toast";
import { isBonusExpired, isBonusExpiryUrgent } from "@/helpers/bonusExpiry";
import { apiCancelWagering } from "@/api/ledger/apiCancelUserWagering";
import { apiGetFreespinAvailableGames } from "@/api/ledger/apiGetFreespinAvailableGames";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { useTranslations } from "@/context/I18nContext";
import { Loader as LoaderIcon } from "lucide-preact";
import { Link } from "@/components/common";
import { placeholderGameImage } from "@/config/constants";
import type { tFreespinAvailableGame } from "@/types/tFreespinAvailableGame";
import { requireLogin } from "@/helpers/requireAuth";

function formatMoney(n: number | string | null | undefined) {
  const v = typeof n === "string" ? Number(n) : (n ?? 0);
  if (!Number.isFinite(v)) return "0";
  return v.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

type WageringCardProps = {
  title: string;
  balanceLabel: string;
  balanceValue: number;
  wagering: WageringProgress;
  rightChip?: preact.ComponentChildren;
  bare?: boolean;
};

function WageringCard({
  title,
  balanceLabel,
  balanceValue,
  wagering,
  rightChip,
  bare,
}: WageringCardProps) {
  const t = useTranslations("Wagering");

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-white font-semibold">{title}</div>
          <div className="mt-1 text-sm text-slate-300">
            {balanceLabel}:{" "}
            <span className="text-slate-100 font-medium">
              {formatMoney(balanceValue)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {rightChip}
          <Chip
            size="sm"
            variant="flat"
            className={
              wagering.isMet
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-slate-700/40 text-slate-200"
            }
          >
            {wagering.isMet ? t("Completed") : t("In progress")}
          </Chip>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-300 mb-2">
          <span>
            {t("Completed")}:{" "}
            <span className="text-slate-100">
              {formatMoney(wagering.completed)}
            </span>
          </span>
          <span>
            {t("Required")}:{" "}
            <span className="text-slate-100">
              {formatMoney(wagering.required)}
            </span>
          </span>
        </div>
        <Progress
          aria-label={`${title} progress`}
          value={wagering.progress}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{wagering.progress.toFixed(0)}%</span>
          <span>
            {t("Remaining")}:{" "}
            <span className="text-slate-200">
              {formatMoney(wagering.remaining)}
            </span>
          </span>
        </div>
      </div>
    </>
  );

  if (bare) return <div>{inner}</div>;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-5 py-4">
      {inner}
    </div>
  );
}

type CancelWageringModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function CancelWageringModal({
  open,
  loading,
  onClose,
  onConfirm,
}: CancelWageringModalProps) {
  const t = useTranslations("Wagering");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white">
          {t("Cancel wagering?")}
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          {t("cancel_wagering_confirm")}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 disabled:opacity-60"
            onClick={onClose}
            disabled={loading}
          >
            {t("No, keep it")}
          </button>
          <button
            className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading}
          >
            {t("Yes, cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

type FreespinsCardProps = {
  count: number;
  cost: number;
  expireHours: number;
  games: tFreespinAvailableGame[];
  loading: boolean;
};

function FreespinsCard({
  count,
  cost,
  expireHours,
  games,
  loading,
}: FreespinsCardProps) {
  const t = useTranslations("Wagering");

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-white font-semibold">{t("Free Spins")}</div>
          <div className="mt-1 text-sm text-slate-300">
            {t("Remaining")}:{" "}
            <span className="text-slate-100 font-medium">{count}</span>
            {" • "}
            {t("Per spin")}:{" "}
            <span className="text-slate-100 font-medium">
              {formatMoney(cost)}
            </span>
            {" • "}
            {t("Expires")}:{" "}
            <span className="text-slate-100 font-medium">{expireHours}h</span>
          </div>
        </div>
        <Chip
          size="sm"
          variant="flat"
          className="bg-emerald-500/15 text-emerald-300 shrink-0"
        >
          {t("Available")}
        </Chip>
      </div>

      {(loading || games.length > 0) && (
        <div className="mt-4 border-t border-slate-700/50 pt-4">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-3">
            {t("Available games")}
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <LoaderIcon size={16} className="animate-spin" />
              {t("Loading games")}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {games.map((item) => {
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
                    onClick={(e) => {
                      if (!requireLogin()) e.preventDefault();
                    }}
                    className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-950/40 px-3 py-2 hover:border-emerald-500/40 transition"
                  >
                    <img
                      src={imgSrc}
                      alt={game.name}
                      className="w-10 h-10 rounded-md object-cover shrink-0 border border-white/10"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          placeholderGameImage;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white truncate">
                        {game.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.remaining}{" "}
                        {item.remaining === 1 ? t("spin left") : t("spins left")}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type WageringPageProps = {
  /** When true, renders without standalone page chrome (for promotions tab). */
  embedded?: boolean;
};

export default function WageringPage({ embedded = false }: WageringPageProps) {
  const t = useTranslations("Wagering");
  const userId = userState.value?.id ?? null;

  const [loading, setLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [freespinGames, setFreespinGames] = useState<tFreespinAvailableGame[]>(
    [],
  );
  const [freespinGamesLoading, setFreespinGamesLoading] = useState(false);

  const currencyCode = currencyState.value.code;
  const balance = balanceState.value[currencyCode];
  const freespinCount = Number(balance?.freespin?.count ?? 0);
  const hasActivePromotion = Boolean(balance?.bonus.isActive);

  useEffect(() => {
    if (!userId || freespinCount <= 0) {
      setFreespinGames([]);
      setFreespinGamesLoading(false);
      return;
    }

    let cancelled = false;
    setFreespinGamesLoading(true);

    (async () => {
      try {
        const games = await apiGetFreespinAvailableGames(userId, currencyCode);
        if (!cancelled) setFreespinGames(games);
      } catch {
        if (!cancelled) setFreespinGames([]);
      } finally {
        if (!cancelled) setFreespinGamesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, currencyCode, freespinCount]);

  const handleCancelWagering = async () => {
    if (!userId) return;
    setIsCancelModalOpen(false);
    setLoading(true);
    try {
      const res = await apiCancelWagering(userId);
      toast.success(t("Wagering cancelled"));
    } catch (e: any) {
      toast.error(e?.message ?? t("Failed to cancel wagering"));
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className={embedded ? "py-4" : "container mx-auto px-4 py-8"}>
        {!embedded && (
          <h1 className="text-2xl font-semibold text-white mb-6">
            {t("Wagering")}
          </h1>
        )}
        <LoginRequest />
      </div>
    );
  }

  return (
    <div className={embedded ? "" : "container mx-auto px-4 py-6"}>
      {(!embedded || hasActivePromotion) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {!embedded && (
              <h1 className="text-2xl font-semibold text-white">{t("Wagering")}</h1>
            )}

            {hasActivePromotion && (
              <Button
                size="sm"
                variant="flat"
                isDisabled={loading}
                onPress={() => setIsCancelModalOpen(true)}
                className="bg-slate-800/60 text-slate-100"
              >
                {t("Cancel Wagering")}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main panel container like screenshot */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-950/35 p-5">
        {loading && !balance ? (
          <Loader />
        ) : !balance ? (
          <div className="text-slate-300 text-sm">{t("No balance data")}</div>
        ) : (
          <div className="space-y-4">
            {freespinCount > 0 && (
              <FreespinsCard
                count={freespinCount}
                cost={Number(balance.freespin.cost ?? 0)}
                expireHours={Number(balance.freespin.expireHours ?? 0)}
                games={freespinGames}
                loading={freespinGamesLoading}
              />
            )}

            {/* Bonus row */}
            {(() => {
              const bal = balance;
              const promo = bal.promotion;

              if (!bal.bonus.isActive) {
                if (freespinCount > 0) {
                  return null;
                }
                return (
                  <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-5 py-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-white font-semibold">
                        {t("Bonus")}
                      </div>
                      <div className="mt-1 text-sm text-slate-300">
                        {t("No active bonus right now")}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-slate-800/60 text-slate-100"
                      onPress={() => toast.info("Redeem flow here")}
                    >
                      {t("Redeem")}
                    </Button>
                  </div>
                );
              }

              return (
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 overflow-hidden">
                  {promo && (
                    <div
                      className="px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3"
                      style={{
                        borderColor: "#2e7d4f44",
                        background: "rgba(46,125,79,0.08)",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="shrink-0 rounded-full w-2 h-2"
                          style={{
                            background: "#4caf78",
                            boxShadow: "0 0 6px #4caf78",
                          }}
                        />
                        <div className="min-w-0">
                          <div
                            className="text-sm font-semibold truncate"
                            style={{ color: "#a0c8b0" }}
                          >
                            {promo.name}
                            {promo.isPercentBonus && (
                              <span
                                className="ml-1.5"
                                style={{ color: "#4caf78" }}
                              >
                                {promo.bonusValue}%
                              </span>
                            )}
                            {promo.maxBonusLimit && (
                              <span
                                className="ml-1 text-xs font-normal"
                                style={{ color: "#4a6a56" }}
                              >
                                up to {promo.maxBonusLimit} {promo.currency}
                              </span>
                            )}
                          </div>
                          <div
                            className="flex flex-wrap gap-x-3 text-xs mt-0.5"
                            style={{ color: "#4a6a56" }}
                          >
                            <span>
                              Code:{" "}
                              <span style={{ color: "#6b8c78" }}>
                                {promo.code}
                              </span>
                            </span>
                            {promo.wageringMultiplier > 0 && (
                              <span>
                                {promo.wageringMultiplier}× wagering (
                                {promo.wageringBase})
                              </span>
                            )}
                            {promo.wageringMaxWithdrawMultiplier > 0 && (
                              <span>
                                max withdraw{" "}
                                {promo.wageringMaxWithdrawMultiplier}× bonus
                              </span>
                            )}
                            {bal.bonusExpiresAt ? (
                              <span>
                                {t("Bonus expires")}:{" "}
                                <BonusExpiryCountdown
                                  bonusExpiresAt={bal.bonusExpiresAt}
                                  normalClassName="text-emerald-300 font-medium"
                                  urgentClassName="text-amber-300 font-medium"
                                  expiredClassName="text-red-300 font-medium"
                                />
                              </span>
                            ) : promo.expiresAfterhours > 0 ? (
                              <span>
                                {t("wagering_window_after_claim", {
                                  hours: String(promo.expiresAfterhours),
                                })}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {bal.bonusExpiresAt &&
                          isBonusExpiryUrgent(bal.bonusExpiresAt) &&
                          !isBonusExpired(bal.bonusExpiresAt) && (
                            <Chip
                              size="sm"
                              variant="flat"
                              className="bg-amber-500/15 text-amber-300"
                            >
                              {t("bonus_expiry_urgent")}
                            </Chip>
                          )}
                        <Chip
                          size="sm"
                          variant="flat"
                          className="bg-emerald-500/15 text-emerald-300 shrink-0"
                        >
                          {promo.type}
                        </Chip>
                      </div>
                    </div>
                  )}
                  {bal.bonusExpiresAt && (
                    <div
                      className={[
                        "px-5 py-2.5 border-b text-xs flex flex-wrap items-center justify-between gap-2",
                        isBonusExpired(bal.bonusExpiresAt)
                          ? "bg-red-500/10 text-red-300"
                          : isBonusExpiryUrgent(bal.bonusExpiresAt)
                            ? "bg-amber-500/10 text-amber-200"
                            : "bg-slate-800/40 text-slate-300",
                      ].join(" ")}
                      style={{ borderColor: "#2e7d4f44" }}
                    >
                      <span>{t("Bonus expires")}</span>
                      <BonusExpiryCountdown
                        bonusExpiresAt={bal.bonusExpiresAt}
                        showDateTime
                        normalClassName="text-emerald-200 font-semibold text-right"
                        urgentClassName="text-amber-200 font-semibold text-right"
                        expiredClassName="text-red-200 font-semibold text-right"
                      />
                    </div>
                  )}
                  <div className="px-5 py-4">
                    <WageringCard
                      title={t("Bonus")}
                      balanceLabel={t("Bonus Balance")}
                      balanceValue={bal.bonus.balance}
                      wagering={bal.bonus.wagering}
                      bare
                      rightChip={
                        bal.bonus.wageringMultiplier > 0 ? (
                          <Chip
                            size="sm"
                            variant="flat"
                            className="bg-slate-700/40 text-slate-200"
                          >
                            x{bal.bonus.wageringMultiplier}
                          </Chip>
                        ) : undefined
                      }
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <CancelWageringModal
        open={isCancelModalOpen}
        loading={loading}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelWagering}
      />
    </div>
  );
}
