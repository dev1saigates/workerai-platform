"use client";

import { useMemo, useState } from "react";
import { IconDoc, IconSearch } from "@/components/app-icons";
import {
  KNOWLEDGE_DOCUMENTS,
  KNOWLEDGE_STATS,
  type KnowledgeDocStatus,
  type KnowledgeDocument,
} from "@/lib/knowledge-data";

export function KnowledgeContent() {
  const [query, setQuery] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return KNOWLEDGE_DOCUMENTS;
    return KNOWLEDGE_DOCUMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.usedBy.some((w) => w.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Knowledge Hub
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Documents your AI workers use for context-aware drafts
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5b6cff] to-[#7c3aed] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5b6cff]/25 transition hover:opacity-95"
        >
          <span className="text-lg leading-none">+</span>
          Upload document
        </button>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <StatCard label="Documents" value={String(KNOWLEDGE_STATS.documents)} />
        <StatCard
          label="Indexed"
          value={String(KNOWLEDGE_STATS.indexed)}
          tone="green"
        />
        <StatCard
          label="Storage"
          value={`${KNOWLEDGE_STATS.storageMb} MB`}
          tone="violet"
        />
      </div>

      <section
        className={[
          "mb-8 rounded-xl border-2 border-dashed p-8 text-center transition",
          dragOver
            ? "border-violet-500/60 bg-violet-50/50 dark:border-violet-500/50 dark:bg-violet-500/[0.08]"
            : "border-slate-300 bg-slate-50/80 dark:border-white/15 dark:bg-white/[0.02]",
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
      >
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Drop files here or click Upload
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          PDF, DOCX, Markdown, TXT — max 25 MB per file
        </p>
      </section>

      <div className="mb-6 relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <IconSearch />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents or workers…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500"
          aria-label="Search knowledge documents"
        />
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Documents ({visible.length})
        </h3>
        <ul className="space-y-3">
          {visible.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </ul>
        {visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            No documents match your search.
          </p>
        ) : null}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "green" | "violet";
}) {
  const valueStyles = {
    muted: "text-slate-700 dark:text-slate-200",
    green: "text-emerald-600 dark:text-emerald-400",
    violet: "text-violet-600 dark:text-violet-400",
  };
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-center shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
      <p className={`text-2xl font-bold tabular-nums ${valueStyles[tone]}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function DocumentRow({ doc }: { doc: KnowledgeDocument }) {
  return (
    <li>
      <article className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03] sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
            <IconDoc />
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-medium text-slate-900 dark:text-white">
              {doc.name}
            </h4>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {doc.type} · {doc.size} · {doc.uploaded}
            </p>
            {doc.usedBy.length > 0 ? (
              <p className="mt-1 text-xs text-violet-600/90 dark:text-violet-300/90">
                Used by: {doc.usedBy.join(", ")}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">Not linked to workers yet</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
          <StatusBadge status={doc.status} />
          {doc.status === "indexed" ? (
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/[0.08]"
            >
              View
            </button>
          ) : null}
        </div>
      </article>
    </li>
  );
}

function StatusBadge({ status }: { status: KnowledgeDocStatus }) {
  const styles: Record<KnowledgeDocStatus, string> = {
    indexed:
      "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
    processing:
      "bg-amber-500/15 text-amber-800 ring-amber-500/30 dark:text-amber-200",
    failed: "bg-rose-500/15 text-rose-700 ring-rose-500/25 dark:text-rose-300",
  };
  return (
    <span
      className={[
        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        styles[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}
