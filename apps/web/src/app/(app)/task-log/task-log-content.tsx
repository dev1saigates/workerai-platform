"use client";

import { useMemo, useState } from "react";
import { AddEntryModal } from "@/components/add-entry-modal";
import { IconSparkles } from "@/components/app-icons";
import {
  FILTER_LABELS,
  TASK_LOG_ENTRIES,
  type TaskFilter,
  type TaskLogEntry,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/task-log-data";

const FILTERS: TaskFilter[] = [
  "all",
  "pending",
  "approved",
  "rejected",
  "auto_executed",
];

const CREATE_TASK_FIELDS = [
  { name: "title", label: "Task title", required: true },
  { name: "worker", label: "AI worker", required: true },
  { name: "type", label: "Type", placeholder: "email draft, social…" },
  {
    name: "priority",
    label: "Priority",
    type: "select" as const,
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
];

const AI_GENERATE_FIELDS = [
  { name: "prompt", label: "What should the AI draft?", type: "textarea" as const, required: true },
  { name: "worker", label: "AI worker", required: true },
];

export function TaskLogContent() {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [tasks, setTasks] = useState(TASK_LOG_ENTRIES);
  const [createOpen, setCreateOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  const counts = useMemo(() => {
    const base: Record<TaskFilter, number> = {
      all: tasks.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      auto_executed: 0,
    };
    for (const t of tasks) {
      base[t.status] += 1;
    }
    return base;
  }, [tasks]);

  const visible = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [filter, tasks]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Task Log
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {tasks.length} recent tasks
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGenerateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            <IconSparkles />
            AI Generate
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg btn-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            <span className="text-lg leading-none">+</span>
            Create Task
          </button>
        </div>
      </div>

      <AddEntryModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        title="AI Generate"
        subtitle="Queues a demo task (vLLM on DGX when API is wired)."
        fields={AI_GENERATE_FIELDS}
        submitLabel="Generate"
        onSubmit={(v) => {
          setTasks((prev) => [
            {
              id: `t-${Date.now()}`,
              icon: "✨",
              title: v.prompt.slice(0, 80),
              worker: v.worker.trim(),
              type: "ai draft",
              ago: "just now",
              priority: "medium",
              status: "pending",
            },
            ...prev,
          ]);
        }}
      />
      <AddEntryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create task"
        fields={CREATE_TASK_FIELDS}
        submitLabel="Create task"
        onSubmit={(v) => {
          setTasks((prev) => [
            {
              id: `t-${Date.now()}`,
              icon: "📌",
              title: v.title.trim(),
              worker: v.worker.trim(),
              type: v.type.trim() || "manual",
              ago: "just now",
              priority: (v.priority || "medium") as TaskPriority,
              status: "pending",
            },
            ...prev,
          ]);
        }}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((key) => (
          <FilterChip
            key={key}
            active={filter === key}
            onClick={() => setFilter(key)}
          >
            {FILTER_LABELS[key]} ({counts[key]})
          </FilterChip>
        ))}
      </div>

      <ul className="space-y-3">
        {visible.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          No tasks in this filter yet.
        </p>
      ) : null}
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
          ? "bg-[#00b4ff]/15 text-[#0088ff] ring-1 ring-[#00b4ff]/30 dark:bg-[#00b4ff]/20 dark:text-[#bae6fd]"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-400 dark:hover:bg-white/[0.1]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TaskRow({ task }: { task: TaskLogEntry }) {
  return (
    <li>
      <article className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-white/[0.06]"
          aria-hidden
        >
          {task.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-slate-900 dark:text-white">
            {task.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
            {task.worker} · {task.type} · {task.ago}
          </p>
        </div>
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
      </article>
    </li>
  );
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles: Record<TaskPriority, string> = {
    high: "bg-rose-500/15 text-rose-700 ring-rose-500/25 dark:text-rose-300",
    medium: "bg-amber-500/15 text-amber-800 ring-amber-500/30 dark:text-amber-300",
    low: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
  };
  return (
    <span
      className={[
        "hidden shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset sm:inline-flex",
        styles[priority],
      ].join(" ")}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = {
    pending: "bg-amber-500/15 text-amber-800 ring-amber-500/30 dark:text-amber-200",
    approved: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
    rejected: "bg-rose-500/15 text-rose-700 ring-rose-500/25 dark:text-rose-300",
    auto_executed: "bg-sky-500/15 text-sky-700 ring-sky-500/25 dark:text-sky-300",
  };
  const label =
    status === "auto_executed" ? "auto executed" : status;
  return (
    <span
      className={[
        "shrink-0 rounded-md px-2.5 py-1 text-[10px] font-semibold capitalize ring-1 ring-inset",
        styles[status],
      ].join(" ")}
    >
      {label}
    </span>
  );
}
