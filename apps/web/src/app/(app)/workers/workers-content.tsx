"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AddEntryModal } from "@/components/add-entry-modal";
import { IconGear, IconRobotSm } from "@/components/app-icons";
import { WorkerAvatar } from "@/components/worker-avatar";
import { brandCta } from "@/lib/brand";
import {
  ONBOARDING_EVENT,
  WORKERS,
  getOnboardingOverrides,
  type Worker,
} from "@/lib/workers-data";

const ADD_WORKER_FIELDS = [
  { name: "name", label: "Worker name", required: true, placeholder: "e.g. Sales Assistant" },
  { name: "role", label: "Role", required: true, placeholder: "e.g. Sales" },
  { name: "tone", label: "Tone", placeholder: "Professional, friendly…" },
  { name: "description", label: "Description", type: "textarea" as const },
];

export function WorkersContent() {
  const [extraWorkers, setExtraWorkers] = useState<Worker[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const workers = useMemo(() => [...WORKERS, ...extraWorkers], [extraWorkers]);

  // Keep a local "overrides" map so the badge re-renders when the user
  // finishes (or resets) onboarding inside the chat page.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const sync = () => setOverrides(getOnboardingOverrides());
    sync();
    window.addEventListener(ONBOARDING_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ONBOARDING_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isWorkerOnboarded = (w: Worker) =>
    w.slug in overrides ? overrides[w.slug] : w.onboarded;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            AI Workers
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {workers.length} workers in your workspace · click any to open a
            chat
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className={`${brandCta} shrink-0 gap-2 rounded-lg px-4 py-2.5 text-sm`}
        >
          <span className="text-lg leading-none">+</span>
          Add Worker
        </button>
      </div>

      <AddEntryModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add AI worker"
        subtitle="Creates a demo worker in this browser session (API later)."
        fields={ADD_WORKER_FIELDS}
        submitLabel="Create worker"
        onSubmit={(v) => {
          const name = v.name.trim();
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "new-worker";
          setExtraWorkers((prev) => [
            ...prev,
            {
              id: `local-${Date.now()}`,
              slug,
              emoji: "🤖",
              name,
              role: v.role.trim() || "Assistant",
              description: v.description.trim() || "New worker persona.",
              active: true,
              tasks: 0,
              approvalRate: 0,
              autoExec: "Never",
              onboarded: false,
            },
          ]);
        }}
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workers.map((w) => {
          const onboarded = isWorkerOnboarded(w);
          return (
            <li
              key={w.id}
              className="app-card flex flex-col rounded-xl border border-slate-200 bg-white"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <WorkerAvatar worker={w} size="lg" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {w.name}
                    </p>
                    <p className="text-xs text-slate-500">{w.role}</p>
                  </div>
                </div>
                {onboarded ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Onboarded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Needs onboarding
                  </span>
                )}
              </div>

              <p className="border-b border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-white/[0.06] dark:text-slate-400">
                {w.description}
              </p>

              <div className="grid grid-cols-3 gap-2 px-4 py-4 text-center">
                <Stat label="Tasks" value={String(w.tasks)} />
                <Stat label="Approval" value={`${w.approvalRate}%`} />
                <Stat label="Auto-exec" value={w.autoExec} />
              </div>

              <div className="mt-auto flex border-t border-slate-100 dark:border-white/[0.06]">
                <Link
                  href={`/workers/${w.slug}`}
                  className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-[#0088ff] transition hover:bg-[#00b4ff]/10 dark:text-[#7dd3fc] dark:hover:bg-[#00b4ff]/10"
                >
                  <IconRobotSm />
                  {onboarded ? "Chat" : "Start onboarding"}
                </Link>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 border-l border-slate-100 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.06] dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
                >
                  <IconGear />
                  Config
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
