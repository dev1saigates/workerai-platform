"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconGear, IconRobotSm } from "@/components/app-icons";
import {
  ONBOARDING_EVENT,
  WORKERS,
  getOnboardingOverrides,
  type Worker,
} from "@/lib/workers-data";

export function WorkersContent() {
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
            {WORKERS.length} workers in your workspace · click any to open a
            chat
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert("Wire to create-worker flow later")}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5b6cff] to-[#7c3aed] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5b6cff]/25 transition hover:opacity-95"
        >
          <span className="text-lg leading-none">+</span>
          Add Worker
        </button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {WORKERS.map((w) => {
          const onboarded = isWorkerOnboarded(w);
          return (
            <li
              key={w.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0e131d]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl dark:bg-white/[0.06]"
                    aria-hidden
                  >
                    {w.emoji}
                  </span>
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
                  className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-violet-600 transition hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-white/[0.04]"
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
