"use client";

import { useState } from "react";
import { AddEntryModal } from "@/components/add-entry-modal";
import { IconCopy } from "@/components/app-icons";
import {
  CLAW_CHANNELS,
  CLAW_RECENT_ITEMS,
  CLAW_STATS,
  CLAW_WEBHOOK_URL,
  type ClawChannel,
  type ClawIngestItem,
} from "@/lib/claw-data";

const TEST_INGEST_FIELDS = [
  { name: "channel", label: "Channel", required: true, placeholder: "Email, Web Form…" },
  { name: "source", label: "Source", required: true },
  { name: "subject", label: "Subject", required: true },
  { name: "snippet", label: "Preview text", type: "textarea" as const },
];

export function ClawContent() {
  const [copied, setCopied] = useState(false);
  const [recent, setRecent] = useState(CLAW_RECENT_ITEMS);
  const [ingestOpen, setIngestOpen] = useState(false);

  async function copyWebhook() {
    try {
      await navigator.clipboard.writeText(CLAW_WEBHOOK_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Claw — Data Ingestion
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Universal data capture from email, forms, social &amp; more
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIngestOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg btn-brand px-4 py-2.5 text-sm font-semibold text-white"
        >
          <span className="text-lg leading-none">+</span>
          Test Ingest
        </button>
      </div>

      <AddEntryModal
        open={ingestOpen}
        onClose={() => setIngestOpen(false)}
        title="Test ingestion"
        subtitle="Adds a demo row to Recent Ingestion (webhook API later)."
        fields={TEST_INGEST_FIELDS}
        submitLabel="Ingest"
        onSubmit={(v) => {
          setRecent((prev) => [
            {
              id: `i-${Date.now()}`,
              channel: v.channel.trim(),
              source: v.source.trim(),
              subject: v.subject.trim(),
              snippet: v.snippet.trim() || "—",
              tag: "test",
              sentiment: "neutral",
              ago: "just now",
            },
            ...prev,
          ]);
        }}
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Today" value={CLAW_STATS.today} tone="muted" />
        <StatCard
          label="Unprocessed"
          value={CLAW_STATS.unprocessed}
          tone="amber"
        />
        <StatCard
          label="Channels"
          value={CLAW_STATS.channels}
          tone="violet"
        />
        <StatCard label="Total Items" value={CLAW_STATS.total} tone="green" />
      </div>

      <section className="mb-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CLAW_CHANNELS.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Webhook Endpoint
          </h3>
          <span className="inline-flex rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-500/25 ring-inset dark:text-emerald-300">
            Active
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            readOnly
            value={CLAW_WEBHOOK_URL}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
            aria-label="Webhook URL"
          />
          <button
            type="button"
            onClick={() => void copyWebhook()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            <IconCopy />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Recent Ingestion ({recent.length})
        </h3>
        <ul className="space-y-3">
          {recent.map((item) => (
            <IngestRow key={item.id} item={item} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "muted" | "amber" | "violet" | "green";
}) {
  const valueStyles = {
    muted: "text-slate-700 dark:text-slate-200",
    amber: "text-amber-600 dark:text-amber-400",
    violet: "text-[#00b4ff] dark:text-[#38bdf8]",
    green: "text-emerald-600 dark:text-emerald-400",
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

function ChannelCard({ channel }: { channel: ClawChannel }) {
  const connected = channel.status === "connected";
  return (
    <li>
      <article
        className={[
          "flex h-full flex-col rounded-xl border bg-white p-5 shadow-sm dark:bg-white/[0.03]",
          connected
            ? "border-emerald-500/40 ring-1 ring-emerald-500/20 dark:border-emerald-500/35"
            : "border-slate-200/80 dark:border-white/[0.08]",
        ].join(" ")}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className={[
              "flex h-10 w-10 items-center justify-center rounded-lg text-xl",
              channel.iconBg,
            ].join(" ")}
            aria-hidden
          >
            {channel.icon}
          </span>
          {connected ? (
            <span className="inline-flex rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-500/25 ring-inset dark:text-emerald-300">
              Connected
            </span>
          ) : null}
        </div>
        <h4 className="font-semibold text-slate-900 dark:text-white">
          {channel.name}
        </h4>
        <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">
          {channel.hint}
        </p>
        <button
          type="button"
          className={[
            "mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium transition",
            connected
              ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              : "btn-brand font-semibold text-white",
          ].join(" ")}
        >
          {connected ? "Manage" : "Connect"}
        </button>
      </article>
    </li>
  );
}

function IngestRow({ item }: { item: ClawIngestItem }) {
  const sentimentDot = {
    positive: "bg-emerald-500",
    neutral: "bg-slate-400",
    negative: "bg-rose-500",
  };
  return (
    <li>
      <article className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200/80 ring-inset dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/10">
                {item.channel}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {item.source}
              </span>
            </div>
            <h4 className="font-medium text-slate-900 dark:text-white">
              {item.subject}
            </h4>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              {item.snippet}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
            <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200/80 ring-inset dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/10">
              {item.tag}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  sentimentDot[item.sentiment],
                ].join(" ")}
                aria-hidden
              />
              <span className="capitalize">{item.sentiment}</span>
              <span aria-hidden>·</span>
              <span>{item.ago}</span>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
