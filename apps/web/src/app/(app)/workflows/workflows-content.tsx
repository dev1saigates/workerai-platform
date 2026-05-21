"use client";

import { useState } from "react";
import { IconPause, IconPlay } from "@/components/app-icons";
import {
  TRIGGER_LABELS,
  USER_WORKFLOWS,
  WORKFLOW_TEMPLATES,
  type UserWorkflow,
  type WorkflowTrigger,
} from "@/lib/workflows-data";

export function WorkflowsContent() {
  const [workflows, setWorkflows] = useState(USER_WORKFLOWS);

  function toggleStatus(id: string) {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "paused" : "active" }
          : w,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Workflows
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Automate multi-step processes across your AI workers.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5b6cff] to-[#7c3aed] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5b6cff]/25 transition hover:opacity-95"
        >
          <span className="text-lg leading-none">+</span>
          New Workflow
        </button>
      </div>

      <section className="mb-10">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Templates
        </h3>
        <ul className="grid gap-4 md:grid-cols-3">
          {WORKFLOW_TEMPLATES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className="flex h-full w-full flex-col rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-left transition hover:border-violet-400/50 hover:bg-violet-50/30 dark:border-white/15 dark:bg-white/[0.02] dark:hover:border-violet-500/40 dark:hover:bg-violet-500/[0.06]"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl shadow-sm dark:bg-white/[0.06]"
                    aria-hidden
                  >
                    {t.emoji}
                  </span>
                  <span className="rounded-md bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700 ring-1 ring-violet-500/25 dark:text-violet-300">
                    Template
                  </span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t.steps}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Your workflows
        </h3>
        <ul className="flex flex-col gap-3">
          {workflows.map((w) => (
            <WorkflowRow key={w.id} workflow={w} onToggle={() => toggleStatus(w.id)} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function WorkflowRow({
  workflow: w,
  onToggle,
}: {
  workflow: UserWorkflow;
  onToggle: () => void;
}) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0e131d]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <TriggerIcon trigger={w.trigger} />
            <span className="text-[10px] font-bold tracking-wider text-slate-500">
              {TRIGGER_LABELS[w.trigger]}
            </span>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{w.name}</p>
          <p className="mt-1 text-sm text-violet-600/90 dark:text-violet-300/90">{w.steps}</p>
          <p className="mt-2 text-xs text-slate-500">
            {w.runs} runs · {w.successRate}% success · by {w.createdBy}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <StatusBadge status={w.status} />
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onToggle}
              className={[
                "flex h-9 w-9 items-center justify-center rounded-lg border transition",
                w.status === "active"
                  ? "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              ].join(" ")}
              aria-label={w.status === "active" ? "Pause workflow" : "Run workflow"}
            >
              {w.status === "active" ? <IconPause /> : <IconPlay />}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function StatusBadge({ status }: { status: "active" | "paused" }) {
  if (status === "active") {
    return (
      <span className="inline-flex min-w-[4.5rem] items-center justify-center rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
        active
      </span>
    );
  }
  return (
    <span className="inline-flex min-w-[4.5rem] items-center justify-center rounded-full bg-slate-200/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-300/50 dark:bg-white/10 dark:text-slate-400 dark:ring-white/10">
      paused
    </span>
  );
}

function TriggerIcon({ trigger }: { trigger: WorkflowTrigger }) {
  const className = "text-slate-400 dark:text-slate-500";
  if (trigger === "email") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 8l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (trigger === "crm") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 16V11M12 16V8M16 16v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 3v3M8 7l-2 4M16 7l2 4M6 15h12l-2 5H8l-2-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
