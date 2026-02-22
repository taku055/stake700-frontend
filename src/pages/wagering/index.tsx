import { useEffect, useMemo, useCallback, useState } from "preact/hooks";
import Loader from "@/components/Loader";
import LoginRequest from "@/components/LoginRequest";
import { userState } from "@/state/userState";
import { tUserBalance } from "@/types/tUserLedger";
import { Progress, Chip, Button } from "@heroui/react";
import { toast } from "@/helpers/toast";
import { apiGetUserBalance } from "@/api/ledger/apiGetUserBalance";
import { apiCancelWagering } from "@/api/ledger/apiCancelUserWagering";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";

function formatMoney(n: number | string | null | undefined) {
  const v = typeof n === "string" ? Number(n) : (n ?? 0);
  if (!Number.isFinite(v)) return "0";
  return v.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

function clampPct(value: number) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

type WageringCardProps = {
  title: string;
  balanceLabel: string;
  balanceValue: number;
  completed: number;
  required: number;
  rightChip?: preact.ComponentChildren;
};

function WageringCard({
  title,
  balanceLabel,
  balanceValue,
  completed,
  required,
  rightChip,
}: WageringCardProps) {
  const pct = useMemo(() => {
    if (!required || required <= 0) return 100;
    return clampPct((completed / required) * 100);
  }, [completed, required]);

  const remaining = useMemo(() => {
    const r = (required ?? 0) - (completed ?? 0);
    return r > 0 ? r : 0;
  }, [completed, required]);

  const isDone = required <= 0 || completed >= required;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-5 py-4">
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
              isDone
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-slate-700/40 text-slate-200"
            }
          >
            {isDone ? "Completed" : "In progress"}
          </Chip>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-300 mb-2">
          <span>
            Completed:{" "}
            <span className="text-slate-100">{formatMoney(completed)}</span>
          </span>
          <span>
            Required:{" "}
            <span className="text-slate-100">{formatMoney(required)}</span>
          </span>
        </div>

        <Progress
          aria-label={`${title} progress`}
          value={pct}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{pct.toFixed(0)}%</span>
          <span>
            Remaining:{" "}
            <span className="text-slate-200">{formatMoney(remaining)}</span>
          </span>
        </div>
      </div>
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white">Cancel wagering?</h2>
        <p className="mt-2 text-sm text-slate-300">
          Are you sure you want to cancel wagering? This will reset your
          wagering progress and bonus balance but keep your cash balance.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 disabled:opacity-60"
            onClick={onClose}
            disabled={loading}
          >
            No, keep it
          </button>
          <button
            className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading}
          >
            Yes, cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WageringPage() {
  const userId = userState.value?.id ?? null;

  const [loading, setLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleCancelWagering = async () => {
    if (!userId) return;
    setIsCancelModalOpen(false);
    setLoading(true);
    try {
      const res = await apiCancelWagering(userId);
      toast.success("Wagering cancelled and balance updated.");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to cancel wagering.");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-white mb-6">Wagering</h1>
        <LoginRequest />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Top bar like screenshot */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Wagering</h1>

          <Button
            size="sm"
            variant="flat"
            isDisabled={loading}
            onPress={() => setIsCancelModalOpen(true)}
            className="bg-slate-800/60 text-slate-100"
          >
            Cancel Wagering
          </Button>
        </div>
      </div>

      {/* Main panel container like screenshot */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-950/35 p-5">
        {loading && !balanceState.value[currencyState.value] ? (
          <Loader />
        ) : !balanceState.value[currencyState.value] ? (
          <div className="text-slate-300 text-sm">No balance data.</div>
        ) : (
          <div className="space-y-4">
            <WageringCard
              title="Cash Wagering"
              balanceLabel="Cash Balance"
              balanceValue={
                balanceState.value[currencyState.value].cash.balance
              }
              completed={
                balanceState.value[currencyState.value].cash.wageringCompleted
              }
              required={
                balanceState.value[currencyState.value].cash.wageringRequired
              }
            />

            {/* Freespins row like screenshot */}
            {/* <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-white font-semibold">Freespins</div>
                  <div className="mt-1 text-sm text-slate-300">
                    Count:{" "}
                    <span className="text-slate-100 font-medium">
                      {balanceState.value[currencyState.value].freespin.count}
                    </span>
                    {" • "}
                    Cost:{" "}
                    <span className="text-slate-100 font-medium">
                      {formatMoney(balanceState.value[currencyState.value].freespin.cost)}
                    </span>
                    {" • "}
                    Expires:{" "}
                    <span className="text-slate-100 font-medium">
                      {balanceState.value[currencyState.value].freespin.expireHours}h
                    </span>
                  </div>
                </div> 

                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-slate-700/40 text-slate-200"
                >
                  {balanceState.value[currencyState.value].freespin.count > 0 ? "Available" : "None"}
                </Chip>
              </div>
            </div>
            */}

            {/* Bonus row like screenshot */}
            {balanceState.value[currencyState.value].bonus.isActive ? (
              <WageringCard
                title="Bonus"
                balanceLabel="Bonus Balance"
                balanceValue={
                  balanceState.value[currencyState.value].bonus.balance
                }
                completed={
                  balanceState.value[currencyState.value].bonus
                    .wageringCompleted
                }
                required={
                  balanceState.value[currencyState.value].bonus.wageringRequired
                }
                rightChip={
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-slate-700/40 text-slate-200"
                  >
                    x
                    {
                      balanceState.value[currencyState.value].bonus
                        .wageringMultiplier
                    }
                  </Chip>
                }
              />
            ) : (
              <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-5 py-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-white font-semibold">Bonus</div>
                  <div className="mt-1 text-sm text-slate-300">
                    No active bonus right now.
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="flat"
                  className="bg-slate-800/60 text-slate-100"
                  onPress={() => toast.info("Redeem flow here")}
                >
                  Redeem
                </Button>
              </div>
            )}
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
