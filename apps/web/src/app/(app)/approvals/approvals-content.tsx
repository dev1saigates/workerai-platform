"use client";

import { useState } from "react";
import { IconCheck, IconEdit, IconRobotSm, IconShield, IconX } from "@/components/app-icons";

type PriorityTag = "high" | "medium" | "low" | "urgent";

type ApprovalItem = {
  id: string;
  worker: string;
  ago: string;
  title: string;
  description: string;
  tags: PriorityTag[];
  preview: string;
  safeToBulkApprove?: boolean;
};

const initialQueue: ApprovalItem[] = [
  {
    id: "1",
    worker: "Admin Assistant",
    ago: "20d ago",
    title: "Send 3 overdue invoices (total £8,750)",
    description:
      "Chase payment for three overdue client invoices. Draft emails are ready for your review before sending.",
    tags: ["high", "urgent"],
    safeToBulkApprove: false,
    preview: JSON.stringify(
      {
        action: "send_invoices",
        invoices: [
          { ref: "INV-1042", client: "TechCorp Ltd", amount: 3200, days_overdue: 14 },
          { ref: "INV-1088", client: "Greenfield Co", amount: 2550, days_overdue: 21 },
          { ref: "INV-1101", client: "Northline", amount: 3000, days_overdue: 7 },
        ],
        total_gbp: 8750,
      },
      null,
      2,
    ),
  },
  {
    id: "2",
    worker: "Executive Assistant",
    ago: "20d ago",
    title: "Email reply to TechCorp inquiry",
    description:
      "Reply to meeting request from TechCorp. Tone is professional; confirms availability next week.",
    tags: ["medium", "high"],
    safeToBulkApprove: true,
    preview: JSON.stringify(
      {
        subject: "Re: Partnership discussion — TechCorp",
        to: "partnerships@techcorp.example",
        body: "Thank you for reaching out. We would be happy to meet next Tuesday or Wednesday afternoon...",
        risk: "low",
      },
      null,
      2,
    ),
  },
  {
    id: "3",
    worker: "Social Manager",
    ago: "1d ago",
    title: "LinkedIn post — product launch teaser",
    description: "Short-form post announcing the Q2 feature release. Includes hashtags and CTA.",
    tags: ["medium"],
    safeToBulkApprove: true,
    preview: JSON.stringify(
      {
        platform: "linkedin",
        body: "Excited to share what we have been building... #SME #AI #UKBusiness",
        scheduled: null,
      },
      null,
      2,
    ),
  },
];

export function ApprovalsContent() {
  const [queue, setQueue] = useState(initialQueue);
  const [filter, setFilter] = useState<"all" | "urgent">("all");

  const visible =
    filter === "urgent" ? queue.filter((q) => q.tags.includes("urgent")) : queue;

  function remove(id: string) {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }

  function approveAllSafe() {
    setQueue((prev) => prev.filter((item) => !item.safeToBulkApprove));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Approvals Queue
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {queue.length} item{queue.length === 1 ? "" : "s"} awaiting your decision
          </p>
        </div>
        <button
          type="button"
          onClick={approveAllSafe}
          disabled={!queue.some((q) => q.safeToBulkApprove)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#5b6cff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5b6cff]/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconShield />
          Approve All Safe
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All ({queue.length})
        </FilterChip>
        <FilterChip active={filter === "urgent"} onClick={() => setFilter("urgent")}>
          Urgent only
        </FilterChip>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-white/15 dark:bg-[#0e131d]">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No items in this view.
          </p>
          <p className="mt-1 text-xs text-slate-500">You are all caught up — great work.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#0e131d] dark:shadow-none"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                    <IconRobotSm />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.worker}
                    </p>
                    <p className="text-xs text-slate-500">{item.ago}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </div>

              <div className="px-5 py-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
                <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700 dark:border-white/[0.08] dark:bg-[#070b14] dark:text-slate-300">
                  {item.preview}
                </pre>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-4 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  <IconCheck />
                  Approve
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
                >
                  <IconEdit />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-400"
                >
                  <IconX />
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1.5 text-xs font-medium transition",
        active
          ? "bg-violet-600/15 text-violet-700 ring-1 ring-violet-500/30 dark:bg-violet-600/25 dark:text-violet-200"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-400 dark:hover:bg-white/[0.1]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TagBadge({ tag }: { tag: PriorityTag }) {
  const styles: Record<PriorityTag, string> = {
    high: "bg-rose-500/15 text-rose-700 ring-rose-500/25 dark:text-rose-300",
    urgent: "bg-orange-600/15 text-orange-800 ring-orange-500/30 dark:text-orange-300",
    medium: "bg-amber-500/15 text-amber-800 ring-amber-500/30 dark:text-amber-300",
    low: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
  };
  return (
    <span
      className={[
        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        styles[tag],
      ].join(" ")}
    >
      {tag}
    </span>
  );
}
