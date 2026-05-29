"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AddEntryModal } from "@/components/add-entry-modal";
import { IconGear, IconRobotSm } from "@/components/app-icons";
import { WorkerAvatar } from "@/components/worker-avatar";
import { brandCta } from "@/lib/brand";
import {
  ONBOARDING_EVENT,
  getOnboardingOverrides,
  isOnboarded,
  type Worker,
} from "@/lib/workers-data";
import { createWorker, fetchWorkers } from "@/lib/workers-api";

const ADD_WORKER_FIELDS = [
  {
    name: "name",
    label: "Worker name",
    required: true,
    placeholder: "e.g. Executive Assistant",
    hint: "Display name shown in the sidebar and on worker cards.",
  },
  {
    name: "role",
    label: "Role / job title",
    required: true,
    placeholder: "e.g. Executive Assistant",
    hint: "What this worker does day-to-day (emails, social, admin, etc.).",
  },
  {
    name: "emoji",
    label: "Avatar emoji",
    type: "select" as const,
    defaultValue: "🤖",
    options: [
      { value: "🤖", label: "🤖 Robot (default)" },
      { value: "🎯", label: "🎯 Executive" },
      { value: "📞", label: "📞 Reception" },
      { value: "✏️", label: "✏️ Writing" },
      { value: "📱", label: "📱 Social" },
      { value: "🤝", label: "🤝 Customer success" },
      { value: "📊", label: "📊 Finance" },
      { value: "⭐", label: "⭐ General" },
      { value: "💼", label: "💼 Business" },
    ],
    hint: "Shown on the worker card and in chat.",
  },
  {
    name: "tone",
    label: "Tone of voice",
    type: "select" as const,
    defaultValue: "Professional",
    options: [
      { value: "Professional", label: "Professional" },
      { value: "Friendly", label: "Friendly" },
      { value: "Formal", label: "Formal" },
      { value: "Warm", label: "Warm" },
      { value: "Direct", label: "Direct & concise" },
      { value: "Casual", label: "Casual" },
    ],
    hint: "How drafts should sound to your customers.",
  },
  {
    name: "description",
    label: "Short description",
    type: "textarea" as const,
    rows: 2,
    placeholder: "Drafts emails, schedules meetings, and prepares briefings.",
    hint: "One or two sentences — shown on the worker card.",
  },
  {
    name: "systemPrompt",
    label: "System prompt (AI instructions)",
    type: "textarea" as const,
    rows: 6,
    placeholder:
      "You are an executive assistant for a UK small business. Draft clear, professional emails in British English. Always wait for human approval before anything is sent externally.",
    hint: "Core instructions sent to the AI model. Be specific about language (UK English), approval rules, and what this worker must never do.",
  },
];

export function WorkersContent() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    fetchWorkers()
      .then((list) => {
        if (!cancelled) setWorkers(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load workers.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
    w.slug in overrides ? overrides[w.slug]! : isOnboarded(w);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            AI Workers
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {workers.length} workers in your workspace · click any to open a chat
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

      {error ? (
        <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}

      <AddEntryModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add AI worker"
        subtitle="Configure the persona. All drafts still require human approval before use."
        fields={ADD_WORKER_FIELDS}
        submitLabel="Create worker"
        size="lg"
        onSubmit={async (v) => {
          const worker = await createWorker({
            name: v.name.trim(),
            role: v.role.trim(),
            emoji: v.emoji.trim() || "🤖",
            tone: v.tone.trim() || "Professional",
            description: v.description.trim() || undefined,
            systemPrompt: v.systemPrompt.trim() || undefined,
          });
          setWorkers((prev) => [...prev, worker]);
        }}
      />

      {loading ? (
        <p className="text-sm text-slate-500">Loading workers…</p>
      ) : workers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03]">
          No workers yet. Click <strong>Add Worker</strong> to create your first AI persona.
        </p>
      ) : (
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
                  {w.description || "No description yet."}
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
      )}
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
