import React, { useMemo, useState } from "react";
import { useTranslations } from "@/context/I18nContext";

export type BetLeg = {
  event: string;
  stage: number;
  market: string;
  eventId: string;
  outcome: string;
  marketId: string;
  eventDate: string;
  outcomeId: string;
  discipline: string;
  tournament: string;
  coefficient: number;
  disciplineId: string;
  tournamentId: string;
  tournamentRegionCode: string | null;
};

export type BetContext = {
  metadata: BetLeg[];
  coefficient: number;
};

export type BetRecord = {
  eventId: string;
  bet_amount: number;
  win_amount: number;
  first_tx_at: string;
  last_tx_at: string;
  context: BetContext;
  eventType: string; // "won" | "lost" | ...
};

type SortKey =
  | "last_tx_at"
  | "first_tx_at"
  | "bet_amount"
  | "win_amount"
  | "eventType"
  | "legs"
  | "slip_coef";

type SortDir = "asc" | "desc";

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function fmtDT(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Badge({
  value,
  t,
}: {
  value: string;
  t: (key: string, values?: Record<string, unknown>, fallback?: string) => string;
}) {
  const v = value?.toLowerCase() ?? "";
  const cls =
    v === "won"
      ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
      : v === "lost"
      ? "bg-rose-100 text-rose-800 ring-rose-200"
      : "bg-neutral-100 text-neutral-800 ring-neutral-200";

  const key = `sb_result_${v.replace(/[^a-z0-9]+/g, "_")}`;
  const label = t(key, undefined, value);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${cls}`}
    >
      {label}
    </span>
  );
}

function IconSort({ dir }: { dir: SortDir }) {
  return (
    <span className="ml-1 inline-flex h-4 w-4 items-center justify-center text-neutral-500">
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
}

export default function SportsbookHistoryTable({
  data,
}: {
  data: BetRecord[];
}) {
  const t = useTranslations("BetHistory");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | string>("all");
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [sortKey, setSortKey] = useState<SortKey>("last_tx_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const types = useMemo(() => {
    const s = new Set(data.map((d) => d.eventType));
    return ["all", ...Array.from(s)];
  }, [data]);

  const filtered = useMemo(() => {
    const q = query?.trim()?.toLowerCase() ?? "";

    return data.filter((r) => {
      if (typeFilter !== "all" && r.eventType !== typeFilter) return false;
      if (!q) return true;

      const legs = r.context?.metadata ?? [];
      const haystack = [
        r.eventId,
        r.eventType,
        String(r.bet_amount),
        String(r.win_amount),
        String(r.context?.coefficient ?? ""),
        ...legs.flatMap((m) => [
          m.event,
          m.market,
          m.outcome,
          m.tournament,
          m.discipline,
          m.eventId,
          m.marketId,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [data, query, typeFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];

    const getVal = (r: BetRecord) => {
      switch (sortKey) {
        case "last_tx_at":
          return new Date(r.last_tx_at).getTime();
        case "first_tx_at":
          return new Date(r.first_tx_at).getTime();
        case "bet_amount":
          return Number(r.bet_amount ?? 0);
        case "win_amount":
          return Number(r.win_amount ?? 0);
        case "eventType":
          return r.eventType?.toLowerCase() ?? "";
        case "legs":
          return (r.context?.metadata ?? []).length;
        case "slip_coef":
          return Number(r.context?.coefficient ?? 0);
        default:
          return 0;
      }
    };

    copy.sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return copy;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir("desc");
    }
  }

  function toggleOpen(eventId: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }

  return (
    <div className="rounded-2xl bg-neutral-900 shadow-sm ring-1 ring-neutral-800">
      {/* Controls */}
      <div className="flex flex-col gap-3 border-b border-neutral-800 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-300">{t("sb_search")}</span>
            <input
              value={query}
              onChange={(e: any) => setQuery(e.target.value)}
              placeholder={t("sb_search_placeholder")}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-700 md:w-96"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-300">{t("sb_result")}</span>
            <select
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-700"
            >
              {types.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "all"
                    ? t("sb_all")
                    : t(
                        `sb_result_${opt.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
                        undefined,
                        opt
                      )}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-neutral-400">
          {t("sb_rows", { shown: sorted.length, total: data.length })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-neutral-900">
            <tr className="text-left text-xs text-neutral-400">
              <th className="w-10 border-b border-neutral-800 px-4 py-3" />
              <th className="border-b border-neutral-800 px-4 py-3">
                {t("sb_event_id")}
              </th>

              <ThSort
                label={t("sb_last_tx")}
                active={sortKey === "last_tx_at"}
                dir={sortDir}
                onClick={() => toggleSort("last_tx_at")}
              />
              <ThSort
                label={t("sb_first_tx")}
                active={sortKey === "first_tx_at"}
                dir={sortDir}
                onClick={() => toggleSort("first_tx_at")}
              />

              <ThSort
                label={t("Bet")}
                active={sortKey === "bet_amount"}
                dir={sortDir}
                onClick={() => toggleSort("bet_amount")}
                right
              />
              <ThSort
                label={t("Win")}
                active={sortKey === "win_amount"}
                dir={sortDir}
                onClick={() => toggleSort("win_amount")}
                right
              />
              <ThSort
                label={t("sb_slip_coef")}
                active={sortKey === "slip_coef"}
                dir={sortDir}
                onClick={() => toggleSort("slip_coef")}
                right
              />
              <ThSort
                label={t("sb_legs")}
                active={sortKey === "legs"}
                dir={sortDir}
                onClick={() => toggleSort("legs")}
                right
              />

              <ThSort
                label={t("sb_result")}
                active={sortKey === "eventType"}
                dir={sortDir}
                onClick={() => toggleSort("eventType")}
              />
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => {
              const isOpen = open.has(r.eventId);
              const legs = r.context?.metadata ?? [];
              const net = (r.win_amount ?? 0) - (r.bet_amount ?? 0);

              return (
                <React.Fragment key={r.eventId}>
                  <tr className="hover:bg-neutral-800/40">
                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => toggleOpen(r.eventId)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-sm text-neutral-200 hover:bg-neutral-900"
                        aria-label={
                          isOpen ? t("aria_collapse") : t("aria_expand")
                        }
                      >
                        {isOpen ? "–" : "+"}
                      </button>
                    </td>

                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top">
                      <div className="font-medium text-neutral-100">
                        {r.eventId}
                      </div>
                      <div className="mt-1 text-xs text-neutral-400">
                        {t("sb_net")}{" "}
                        <span
                          className={
                            net >= 0 ? "text-emerald-400" : "text-rose-400"
                          }
                        >
                          {fmtMoney(net)}
                        </span>
                      </div>
                    </td>

                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top text-sm text-neutral-200">
                      {fmtDT(r.last_tx_at)}
                    </td>
                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top text-sm text-neutral-200">
                      {fmtDT(r.first_tx_at)}
                    </td>

                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top text-sm text-right tabular-nums text-neutral-200">
                      {fmtMoney(r.bet_amount ?? 0)}
                    </td>
                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top text-sm text-right tabular-nums text-neutral-200">
                      {fmtMoney(r.win_amount ?? 0)}
                    </td>
                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top text-sm text-right tabular-nums text-neutral-200">
                      {fmtMoney(r.context?.coefficient ?? 0)}
                    </td>
                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top text-sm text-right tabular-nums text-neutral-200">
                      {legs.length}
                    </td>

                    <td className="border-b border-neutral-800/60 px-4 py-3 align-top">
                      <Badge value={r.eventType} t={t} />
                    </td>
                  </tr>

                  {isOpen ? (
                    <tr>
                      <td className="border-b border-neutral-800/60 px-4 py-3" />
                      <td
                        colSpan={8}
                        className="border-b border-neutral-800/60 px-4 py-3"
                      >
                        <div className="rounded-xl bg-neutral-950 p-3 ring-1 ring-neutral-800">
                          <div className="flex items-baseline justify-between">
                            <div className="text-sm font-semibold text-neutral-100">
                              {t("sb_legs")}
                            </div>
                            <div className="text-xs text-neutral-400">
                              {t("sb_slip_coefficient")}{" "}
                              <span className="font-medium text-neutral-100">
                                {fmtMoney(r.context?.coefficient ?? 0)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 overflow-x-auto">
                            <table className="min-w-[1000px] w-full border-separate border-spacing-0">
                              <thead>
                                <tr className="text-left text-xs text-neutral-400">
                                  <th className="border-b border-neutral-800 px-3 py-2">
                                    {t("sb_event")}
                                  </th>
                                  <th className="border-b border-neutral-800 px-3 py-2">
                                    {t("sb_market")}
                                  </th>
                                  <th className="border-b border-neutral-800 px-3 py-2">
                                    {t("sb_outcome")}
                                  </th>
                                  <th className="border-b border-neutral-800 px-3 py-2">
                                    {t("sb_tournament")}
                                  </th>
                                  <th className="border-b border-neutral-800 px-3 py-2">
                                    {t("sb_discipline")}
                                  </th>
                                  <th className="border-b border-neutral-800 px-3 py-2 text-right">
                                    {t("sb_coef")}
                                  </th>
                                  <th className="border-b border-neutral-800 px-3 py-2">
                                    {t("sb_event_date")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {legs.map((m, idx) => (
                                  <tr
                                    key={`${m.marketId}-${idx}`}
                                    className="hover:bg-neutral-900"
                                  >
                                    <td className="border-b border-neutral-800 px-3 py-2 align-top">
                                      <div className="text-sm font-medium text-neutral-100">
                                        {m.event}
                                      </div>
                                      <div className="text-xs text-neutral-500">
                                        {t("sb_leg_meta", {
                                          stage: String(m.stage),
                                          eventId: m.eventId,
                                        })}
                                      </div>
                                    </td>
                                    <td className="border-b border-neutral-800 px-3 py-2 text-sm text-neutral-200">
                                      {m.market}
                                    </td>
                                    <td className="border-b border-neutral-800 px-3 py-2 text-sm text-neutral-200">
                                      {m.outcome}
                                    </td>
                                    <td className="border-b border-neutral-800 px-3 py-2 text-sm text-neutral-200">
                                      {m.tournament}
                                    </td>
                                    <td className="border-b border-neutral-800 px-3 py-2 text-sm text-neutral-200">
                                      {m.discipline}
                                    </td>
                                    <td className="border-b border-neutral-800 px-3 py-2 text-sm text-right tabular-nums text-neutral-200">
                                      {fmtMoney(m.coefficient)}
                                    </td>
                                    <td className="border-b border-neutral-800 px-3 py-2 text-sm text-neutral-200">
                                      {fmtDT(m.eventDate)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <details className="mt-3">
                            <summary className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-300">
                              {t("sb_view_raw_json")}
                            </summary>
                            <pre className="mt-2 max-h-72 overflow-auto rounded-xl bg-black/60 p-3 text-xs text-neutral-100 ring-1 ring-white/10">
                              {JSON.stringify(r.context, null, 2)}
                            </pre>
                          </details>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-neutral-800 p-3 text-xs text-neutral-400">
        {t("sb_expand_tip")}
      </div>
    </div>
  );
}

function ThSort({
  label,
  active,
  dir,
  onClick,
  right,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  right?: boolean;
}) {
  return (
    <th
      className={`border-b border-neutral-200 px-4 py-3 ${
        right ? "text-right" : "text-left"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 hover:text-neutral-900 ${
          active ? "text-neutral-900" : "text-neutral-600"
        }`}
      >
        {label}
        {active ? (
          <span className="text-neutral-500">{dir === "asc" ? "▲" : "▼"}</span>
        ) : null}
      </button>
    </th>
  );
}
