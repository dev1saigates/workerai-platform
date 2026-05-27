"use client";

import { useState } from "react";
import { AddEntryModal } from "@/components/add-entry-modal";
import { IconFolder, IconUpload } from "@/components/app-icons";
import {
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_QUICK_SLOTS,
  type KnowledgeCategory,
} from "@/lib/knowledge-data";

const UPLOAD_FIELDS = [
  { name: "fileName", label: "Document name", required: true, placeholder: "Brand guidelines.pdf" },
  {
    name: "category",
    label: "Category",
    type: "select" as const,
    options: KNOWLEDGE_CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
      value: c.id,
      label: c.label,
    })),
  },
];

export function KnowledgeContent() {
  const [category, setCategory] = useState<KnowledgeCategory>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Knowledge Hub
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Brand assets, SOPs, AI training materials
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg btn-brand px-4 py-2.5 text-sm font-semibold text-white"
        >
          <IconUpload />
          Upload
        </button>
      </div>

      <AddEntryModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload document"
        subtitle="Demo only — file is not sent to a server yet."
        fields={UPLOAD_FIELDS}
        submitLabel="Upload"
        onSubmit={(v) => setUploaded((prev) => [...prev, v.fileName.trim()])}
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {KNOWLEDGE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              category === cat.id
                ? "bg-[#00b4ff]/15 text-[#0088ff] ring-1 ring-[#00b4ff]/30 dark:bg-[#00b4ff]/20 dark:text-[#bae6fd]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-400 dark:hover:bg-white/[0.1]",
            ].join(" ")}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {uploaded.length > 0 ? (
        <ul className="mb-8 space-y-2">
          {uploaded.map((name) => (
            <li
              key={name}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-800 dark:text-emerald-200"
            >
              Uploaded (demo): {name}
            </li>
          ))}
        </ul>
      ) : (
        <section className="mb-10 flex flex-col items-center py-8 text-center">
          <span className="mb-4 text-slate-300 dark:text-slate-600">
            <IconFolder />
          </span>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            No documents yet
          </h3>
          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Upload brand guidelines, email templates, SOPs, and other materials to
            train your AI workers
          </p>
        </section>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KNOWLEDGE_QUICK_SLOTS.map((slot) => (
          <li key={slot.label}>
            <button
              type="button"
              className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-center transition hover:border-[#00b4ff]/40 hover:bg-[#00b4ff]/10 dark:border-white/15 dark:bg-white/[0.02] dark:hover:border-[#00b4ff]/40 dark:hover:bg-[#00b4ff]/[0.08]"
            >
              <span className="text-2xl" aria-hidden>
                {slot.emoji}
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {slot.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
