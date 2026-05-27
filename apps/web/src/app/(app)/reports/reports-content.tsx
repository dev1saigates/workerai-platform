"use client";

import { useMemo, useState } from "react";
import {
  IconBolt,
  IconChart,
  IconChevronDown,
  IconRobotSm,
  IconTrendUp,
} from "@/components/app-icons";
import {
  APPROVAL_TREND_30D,
  RANGE_LABELS,
  REPORT_DATA,
  WORKER_PERFORMANCE,
  type ReportRange,
} from "@/lib/reports-data";

const RANGES: ReportRange[] = ["7d", "30d", "90d"];
const TREND_WINDOWS = ["7-day window", "30-day window", "90-day window"] as const;

export function ReportsContent() {
  const [range, setRange] = useState<ReportRange>("30d");
  const [trendWindow, setTrendWindow] = useState<(typeof TREND_WINDOWS)[number]>(
    "30-day window",
  );
  const data = REPORT_DATA[range];

  const maxBar = useMemo(
    () => Math.max(...data.days.map((d) => d.total), 1),
    [data.days],
  );

  const trendPoints = useMemo(() => {
    const pts = APPROVAL_TREND_30D.map((p, i) => {
      const x = (i / (APPROVAL_TREND_30D.length - 1)) * 100;
      const y = 40 - (p.rate / 100) * 40;
      return `${x},${y}`;
    });
    return pts.join(" ");
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Reports &amp; Analytics
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Performance metrics and productivity insights
          </p>
        </div>
        <RangeSelect value={range} onChange={setRange} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Tasks Per Day">
          <div className="mb-4 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-[#00b4ff]" />
              Total tasks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-emerald-500" />
              Approved
            </span>
          </div>
          <div className="flex h-44 items-end justify-between gap-2 border-b border-slate-200/80 pb-2 dark:border-white/[0.08]">
            {data.days.map((day) => (
              <div
                key={day.date}
                className="flex flex-1 flex-col items-center justify-end gap-1"
              >
                <div className="flex w-full max-w-[2rem] items-end justify-center gap-0.5">
                  <div
                    className="w-2 rounded-t bg-[#00b4ff]"
                    style={{
                      height: `${(day.total / maxBar) * 120}px`,
                      minHeight: day.total > 0 ? "4px" : "0",
                    }}
                  />
                  <div
                    className="w-2 rounded-t bg-emerald-500"
                    style={{
                      height: `${(day.approved / maxBar) * 120}px`,
                      minHeight: day.approved > 0 ? "4px" : "0",
                    }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        </ChartPanel>

        <ChartPanel title="ROI Breakdown">
          <ul className="space-y-3 text-sm">
            <RoiRow label="Platform cost" value={data.roi.platform} />
            <RoiRow label="Hours saved" value={data.roi.hours} />
            <RoiRow label="Estimated value" value={data.roi.value} />
          </ul>
          <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Net saving</p>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {data.roi.net}
            </p>
          </div>
          <p className="mt-4 text-center text-3xl font-bold text-rose-600 dark:text-rose-400">
            {data.roi.pct}
          </p>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Return on Investment
          </p>
        </ChartPanel>
      </div>

      <ChartPanel
        title={
          <span className="flex items-center gap-2">
            <IconChart />
            Approval Rate Trend
          </span>
        }
        action={
          <select
            value={trendWindow}
            onChange={(e) =>
              setTrendWindow(e.target.value as (typeof TREND_WINDOWS)[number])
            }
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200"
          >
            {TREND_WINDOWS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        }
      >
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="h-0.5 w-4 bg-sky-500" />
          Approval rate %
        </div>
        <div className="relative h-48 border-b border-l border-slate-200/80 dark:border-white/[0.08]">
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-1 text-[10px] text-slate-400">
            <span>100%</span>
            <span>80%</span>
            <span>60%</span>
            <span>40%</span>
            <span>20%</span>
            <span>0%</span>
          </div>
          <svg
            className="absolute inset-0 ml-8 h-full w-[calc(100%-2rem)] text-sky-500"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            aria-hidden
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              points={trendPoints}
            />
          </svg>
          <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[9px] text-slate-500">
            {APPROVAL_TREND_30D.map((p) => (
              <span key={p.label}>{p.label}</span>
            ))}
          </div>
        </div>
      </ChartPanel>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
          Worker Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/[0.08]">
                <th className="pb-3 pr-4">Worker</th>
                <th className="pb-3 pr-4 text-right">Total tasks</th>
                <th className="pb-3 pr-4 text-right">In period</th>
                <th className="pb-3 pr-4 text-right">Approved</th>
                <th className="pb-3 pr-4 text-right">Rate</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {WORKER_PERFORMANCE.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-slate-100 last:border-0 dark:border-white/[0.04]"
                >
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                      <span aria-hidden>{w.emoji}</span>
                      {w.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-slate-700 dark:text-slate-200">
                    {w.totalTasks}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-slate-500">
                    {w.inPeriod}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="inline-flex min-w-[2.5rem] justify-center rounded-md bg-emerald-500/15 px-2 py-0.5 tabular-nums font-medium text-emerald-700 dark:text-emerald-300">
                      {w.approved}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-slate-700 dark:text-slate-200">
                    {w.rate}%
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
          Task outcomes (period)
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Breakdown of approved vs rejected vs pending for the selected range — useful
          for manager reviews alongside the approval trend.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          <OutcomeTile label="Approved" value="0" tone="green" />
          <OutcomeTile label="Rejected" value="0" tone="rose" />
          <OutcomeTile label="Pending review" value="6" tone="amber" />
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
  footer,
  valueTone = "default",
}: {
  label: string;
  value: string;
  footer: string;
  valueTone?: "default" | "danger";
}) {
  const icon = label.includes("Tasks") ? (
    <IconRobotSm />
  ) : label.includes("Auto") ? (
    <IconBolt />
  ) : (
    <IconTrendUp />
  );

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p
        className={[
          "mt-1 text-3xl font-bold tabular-nums",
          valueTone === "danger"
            ? "text-rose-600 dark:text-rose-400"
            : "text-slate-900 dark:text-white",
        ].join(" ")}
      >
        {value}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
        {icon}
        {footer}
      </p>
    </div>
  );
}

function ChartPanel({
  title,
  children,
  action,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function RoiRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex justify-between text-slate-700 dark:text-slate-200">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </li>
  );
}

function OutcomeTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "rose" | "amber";
}) {
  const styles = {
    green: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400",
  };
  return (
    <li className="rounded-lg border border-slate-200/80 px-4 py-3 dark:border-white/[0.08]">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={["mt-1 text-2xl font-bold tabular-nums", styles[tone]].join(" ")}>
        {value}
      </p>
    </li>
  );
}
