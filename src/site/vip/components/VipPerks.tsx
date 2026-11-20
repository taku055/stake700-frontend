"use client";

import type { CSSProperties } from "react";
import { BadgeDollarSign, Crown, RotateCcw } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";

const PERKS = [
  { key: "levelup", Icon: BadgeDollarSign, color: "#3ee08f" },
  { key: "cashback", Icon: RotateCcw, color: "#4aa3ff" },
  { key: "promos", Icon: Crown, color: "#ffc83d" },
] as const;

/** What membership gives you — only perks the platform actually provides. */
export default function VipPerks() {
  const t = useTranslations("VipClub");
  return (
    <section aria-labelledby="vip-perks">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-6 w-1 shrink-0 rounded-full bg-[var(--primary-color)] shadow-[0_0_12px_var(--primary-color)]" />
        <h2 id="vip-perks" className="text-[20px] font-extrabold text-white">
          {t("perks_title")}
        </h2>
      </div>
      <ul className="grid gap-3 md:grid-cols-3">
        {PERKS.map(({ key, Icon, color }) => (
          <li
            key={key}
            style={{ "--c1": color } as CSSProperties}
            className="group relative overflow-hidden rounded-3xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-5 transition-colors hover:border-[color-mix(in_srgb,var(--c1)_55%,transparent)]"
          >
            <span aria-hidden className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-[var(--c1)] opacity-10 blur-2xl transition-opacity group-hover:opacity-25" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--c1)_16%,transparent)] text-[var(--c1)]">
              <Icon size={22} />
            </span>
            <h3 className="relative mt-4 text-[16px] font-extrabold text-white">{t(`perk_${key}_title`)}</h3>
            <p className="relative mt-1 text-[13px] leading-relaxed text-[var(--text-muted-color)]">{t(`perk_${key}_desc`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
