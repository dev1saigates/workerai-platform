"use client";

import { useMemo, useState } from "react";
import { IconChevronDown } from "@/components/app-icons";
import {
  APPROVAL_SPLIT,
  RANGE_LABELS,
  REPORT_KPIS,
  TASKS_BY_DAY,
  TOP_WORKERS,
  type ReportRange,
} from "@/lib/reports-data";

const RANGES: ReportRange[] = ["7d", "30d", "90d"];

export function ReportsContent() {
  const [range, setRange] = useState<ReportRange>("30d");

  const kpis = REPORT_KPIS[range];
  const tasksChart = TASKS_BY_DAY[range];
  const approvalChart = APPROVAL_SPLIT[range];
  const topWorkers = TOP_WORKERS[range];

  const maxTasks = useMemo(
    () => Math.max(...tasksChart.map((p) => p.value), 1),
    [tasksChart],
  );
  const approvalTotal = useMemo(
    () => approvalChart.reduce((s, p) => s + p.value, 0),
    [approvalChart],
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Reports
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Productivity, approvals, and ROI for your workspace
          </p>
        </div>
        <RangeSelect value={range} onChange={setRange} />
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Tasks completed">
          <div className="flex h-48 items-end justify-between gap-2 pt-4">
            {tasksChart.map((point) => (
              <div
                key={point.label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full max-w-[2.5rem] rounded-t-md bg-gradient-to-t from-[#5b6cff] to-[#7c3aed] transition-all"
                  style={{ height: `${(point.value / maxTasks) * 100}%`, minHeight: "8px" }}
                  title={`${point.value} tasks`}
                />
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Approval outcomes">
          <ul className="space-y-4 py-2">
            {approvalChart.map((segment) => {
              const pct = Math.round((segment.value / approvalTotal) * 100);
              return (
                <li key={segment.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">
                      {segment.label}
                    </span>
                    <span className="tabular-nums text-slate-500 dark:text-slate-400">
                      {segment.value} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                    <div
                      className={[
                        "h-full rounded-full transition-all",
                        segment.label === "Approved"
                          ? "bg-emerald-500"
                          : segment.label === "Edited"
                            ? "bg-violet-500"
                            : "bg-rose-500",
                      ].join(" ")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </ChartCard>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
          Top AI workers
        </h3>
        <ul className="divide-y divide-slate-200/80 dark:divide-white/[0.06]">
          {topWorkers.map((w, i) => (
            <li
              key={w.name}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-700 dark:text-violet-300">
                  {i + 1}
                </span>
                <span className="truncate font-medium text-slate-900 dark:text-white">
                  {w.name}
                </span>
              </div>
              <div className="flex shrink-0 gap-6 text-sm tabular-nums text-slate-500 dark:text-slate-400">
                <span>{w.tasks} tasks</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {w.rate}% approved
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RangeSelect({
  value,
  onChange,
}: {
  value: ReportRange;
  onChange: (r: ReportRange) => void;
}) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ReportRange)}
        className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200"
        aria-label="Date range"
      >
        {RANGES.map((r) => (
          <option key={r} value={r}>
            {RANGE_LABELS[r]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <IconChevronDown />
      </span>
    </div>
  );
}

function KpiCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
        {value}
      </p>
      <p
        className={[
          "mt-1 text-xs font-medium",
          positive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-400",
        ].join(" ")}
      >
        {change} vs previous period
      </p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
      <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{title}</h3>
      {children}
    </section>
  );
}
