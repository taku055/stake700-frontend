import { useEffect, useMemo, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import {
  BonusExpiryCountdownLabels,
  formatExpiryCountdown,
  formatExpiryDateTime,
  isBonusExpired,
  isBonusExpiryUrgent,
} from "@/helpers/bonusExpiry";

type BonusExpiryCountdownProps = {
  bonusExpiresAt: string | null | undefined;
  /** Show absolute deadline under the countdown */
  showDateTime?: boolean;
  className?: string;
  urgentClassName?: string;
  normalClassName?: string;
  expiredClassName?: string;
};

export default function BonusExpiryCountdown({
  bonusExpiresAt,
  showDateTime = false,
  className = "",
  urgentClassName = "text-amber-300",
  normalClassName = "text-emerald-300",
  expiredClassName = "text-red-300",
}: BonusExpiryCountdownProps) {
  const t = useTranslations("BonusExpiry");
  const [, setTick] = useState(0);

  const labels = useMemo<BonusExpiryCountdownLabels>(
    () => ({
      expired: t("expired"),
      days_hours_left: t("days_hours_left"),
      hours_mins_left: t("hours_mins_left"),
      mins_secs_left: t("mins_secs_left"),
      secs_left: t("secs_left"),
    }),
    [t],
  );

  useEffect(() => {
    if (!bonusExpiresAt) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [bonusExpiresAt]);

  if (!bonusExpiresAt) return null;

  const countdown = formatExpiryCountdown(bonusExpiresAt, labels);
  if (!countdown) return null;

  const tone = isBonusExpired(bonusExpiresAt)
    ? expiredClassName
    : isBonusExpiryUrgent(bonusExpiresAt)
      ? urgentClassName
      : normalClassName;

  return (
    <span className={className}>
      <span className={tone}>{countdown}</span>
      {showDateTime && (
        <span className="block text-[11px] opacity-80 mt-0.5">
          {formatExpiryDateTime(bonusExpiresAt)}
        </span>
      )}
    </span>
  );
}
