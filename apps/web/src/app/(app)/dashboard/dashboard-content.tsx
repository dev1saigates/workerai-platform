"use client";

import Link from "next/link";
import {
  IconBolt,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconDoc,
  IconRobotSm,
  IconX,
} from "@/components/app-icons";

const liveActivity = [
  {
    title: "Executive Assistant — Email reply to TechCorp inquiry",
    meta: "20d ago · email draft",
    status: "pending" as const,
    selected: true,
  },
  {
    title: "Receptionist — Call script for supplier follow-up",
    meta: "2h ago · phone script",
    status: "pending" as const,
    selected: false,
  },
  {
    title: "Social Manager — LinkedIn post draft",
    meta: "1d ago · social",
    status: "running" as const,
    selected: false,
  },
];

const needsApproval = [
  { title: "Invoice wording — Finance review", priority: "high" as const },
  { title: "Customer apology email", priority: "medium" as const },
  { title: "Newsletter intro paragraph", priority: "low" as const },
];

const workerStatus = [
  { name: "Executive Assistant", tasks: 12, online: true },
  { name: "Receptionist", tasks: 8, online: true },
  { name: "Social Manager", tasks: 24, online: true },
  { name: "Finance Clerk", tasks: 3, online: false },
];

export function DashboardContent() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white lg:text-3xl">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Overview of AI tasks, workers, and approvals for your workspace.
        </p>
      </div>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tasks today"
          value="0"
          icon={<IconBolt />}
          iconWrap="from-violet-500/30 to-purple-600/20 text-violet-600 dark:text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.25)]"
        />
        <StatCard
          label="Awaiting approval"
          value="6"
          icon={<IconClock />}
          iconWrap="from-amber-500/25 to-yellow-600/15 text-amber-600 dark:text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
        />
        <StatCard
          label="Active workers"
          value="6"
          icon={<IconRobotSm />}
          iconWrap="from-emerald-500/25 to-teal-600/15 text-emerald-600 dark:text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.2)]"
        />
        <StatCard
          label="Approval rate"
          value="93%"
          icon={<IconCheckCircle />}
          iconWrap="from-sky-500/25 to-blue-600/15 text-sky-600 dark:text-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.2)]"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7 xl:col-span-8">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Live Activity
              </h2>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400/90">
                live
              </span>
            </div>
            <Link
              href="/approvals"
              className="text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
            >
              View all
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {liveActivity.map((row) => (
              <li
                key={row.title}
                className={[
                  "flex items-center gap-3 rounded-xl border p-4 transition-colors",
                  row.selected
                    ? "border-violet-500/50 bg-violet-500/[0.07] shadow-[0_0_0_1px_rgba(139,92,246,0.15)] dark:bg-violet-500/[0.07]"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#0e131d] dark:hover:border-white/[0.12]",
                ].join(" ")}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                  <IconBolt />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{row.meta}</p>
                </div>
                <StatusPill status={row.status} />
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
          <section className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0e131d]">
            <div className="border-b border-slate-100 px-4 py-3 dark:border-white/[0.08]">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Needs your approval
              </h2>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {needsApproval.map((item) => (
                <li key={item.title} className="flex items-start gap-3 px-4 py-3.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
                    <IconDoc />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {item.title}
                    </p>
                    <PriorityBadge level={item.priority} />
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                      aria-label="Approve"
                    >
                      <IconCheck />
                    </button>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                      aria-label="Reject"
                    >
                      <IconX />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0e131d]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-white/[0.08]">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Worker status
              </h2>
              <Link
                href="/workers"
                className="shrink-0 text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Configure
              </Link>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {workerStatus.map((w) => (
                <li key={w.name} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                    <IconRobotSm />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {w.name}
                    </p>
                    <p className="text-xs text-slate-500">{w.tasks} tasks completed</p>
                  </div>
                  <span
                    className={[
                      "h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white dark:ring-[#0e131d]",
                      w.online
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                        : "bg-slate-400 dark:bg-slate-600",
                    ].join(" ")}
                    title={w.online ? "Online" : "Offline"}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconWrap,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconWrap: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#0e131d]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
            iconWrap,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "pending" | "running" }) {
  if (status === "running") {
    return (
      <span className="inline-flex min-w-[5.5rem] shrink-0 items-center justify-center rounded-full bg-sky-500/15 px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide text-sky-700 uppercase ring-1 ring-sky-500/25 dark:text-sky-300">
        running
      </span>
    );
  }
  return (
    <span className="inline-flex min-w-[5.5rem] shrink-0 items-center justify-center rounded-full bg-amber-500/15 px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide text-amber-800 uppercase ring-1 ring-amber-500/30 dark:text-amber-300">
      pending
    </span>
  );
}

function PriorityBadge({ level }: { level: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-rose-500/15 text-rose-700 ring-rose-500/25 dark:text-rose-300",
    medium: "bg-orange-500/15 text-orange-700 ring-orange-500/25 dark:text-orange-300",
    low: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
  };
  return (
    <span
      className={[
        "mt-1.5 inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        styles[level],
      ].join(" ")}
    >
      {level}
    </span>
  );
}
