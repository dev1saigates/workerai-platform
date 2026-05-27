"use client";

import { useState } from "react";
import { AUDIT_EVENTS, type AuditEvent } from "@/lib/audit-data";
import { BILLING_PLANS, CURRENT_PLAN_USAGE } from "@/lib/billing-data";
import {
  INTEGRATION_CATEGORY_LABELS,
  INTEGRATIONS,
  PROFILE_DEFAULTS,
  WORKSPACE_DEFAULTS,
  type IntegrationItem,
} from "@/lib/settings-data";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white";

export function WorkspacePanel() {
  const [form, setForm] = useState(WORKSPACE_DEFAULTS);
  const [saved, setSaved] = useState(false);

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
        Workspace Settings
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company name">
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Industry">
          <input
            type="text"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            placeholder="Technology, Finance, Legal..."
            className={inputClass}
          />
        </Field>
        <Field label="Website" className="sm:col-span-2">
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
        <Field label="Work hours start">
          <input
            type="time"
            value={form.workStart}
            onChange={(e) => setForm({ ...form, workStart: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Work hours end">
          <input
            type="time"
            value={form.workEnd}
            onChange={(e) => setForm({ ...form, workEnd: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Timezone" className="sm:col-span-2">
          <select
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className={inputClass}
          >
            <option value="Europe/London">Europe/London</option>
            <option value="Europe/Dublin">Europe/Dublin</option>
          </select>
        </Field>
      </div>
      <button
        type="button"
        onClick={() => {
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2500);
        }}
        className="mt-8 rounded-lg btn-brand px-5 py-2.5 text-sm font-semibold text-white"
      >
        Save Changes
      </button>
      {saved ? (
        <span className="ml-3 text-sm text-emerald-600 dark:text-emerald-400">
          Saved
        </span>
      ) : null}
    </section>
  );
}

export function ProfilePanel() {
  const [fullName, setFullName] = useState(PROFILE_DEFAULTS.fullName);
  const [email, setEmail] = useState(PROFILE_DEFAULTS.email);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [photoHint, setPhotoHint] = useState<string | null>(null);

  const initials =
    fullName
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || PROFILE_DEFAULTS.initials;

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoHint("Please choose an image file (JPG, PNG, or WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      setPhotoHint("Photo updated (demo — not saved to server yet).");
      window.setTimeout(() => setPhotoHint(null), 3000);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removePhoto() {
    setAvatarUrl(null);
    setPhotoHint("Photo removed (demo).");
    window.setTimeout(() => setPhotoHint(null), 3000);
  }

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
        Profile
      </h2>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 dark:border-white/15">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- demo preview from FileReader
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#00b4ff] to-[#0066ff] text-xl font-semibold text-white">
              {initials}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg btn-brand px-4 py-2 text-sm font-semibold text-white">
            Change photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={onPhotoChange}
            />
          </label>
          {avatarUrl ? (
            <button
              type="button"
              onClick={removePhoto}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/15 dark:text-slate-200"
            >
              Remove photo
            </button>
          ) : null}
        </div>
      </div>
      {photoHint ? (
        <p className="mb-6 text-sm text-emerald-600 dark:text-emerald-400">
          {photoHint}
        </p>
      ) : null}

      <div className="grid max-w-lg gap-5">
        <Field label="Full name">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Work email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Role">
          <input
            type="text"
            defaultValue={PROFILE_DEFAULTS.role}
            disabled
            className={inputClass}
          />
        </Field>
        <button
          type="button"
          className="w-fit rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium dark:border-white/15"
        >
          Change password
        </button>
      </div>
    </section>
  );
}

export function IntegrationsPanel() {
  const [items, setItems] = useState(INTEGRATIONS);

  const categories = [
    "email",
    "calendar",
    "social",
    "crm",
    "finance",
    "automation",
  ] as const;

  function toggleConnect(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "connected" ? "not_connected" : "connected",
            }
          : item,
      ),
    );
  }

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
        Integrations
      </h2>
      <p className="mb-6 max-w-xl text-sm text-slate-500 dark:text-slate-400">
        Connect tools your AI workers use. Only UK/EU-approved services are listed.
      </p>

      <div className="space-y-8">
        {categories.map((cat) => {
          const group = items.filter((i) => i.category === cat);
          if (group.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                {INTEGRATION_CATEGORY_LABELS[cat]}
              </h3>
              <ul className="space-y-3">
                {group.map((item) => (
                  <IntegrationRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleConnect(item.id)}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function IntegrationRow({
  item,
  onToggle,
}: {
  item: IntegrationItem;
  onToggle: () => void;
}) {
  const connected = item.status === "connected";
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl dark:bg-white/[0.06]"
          aria-hidden
        >
          {item.emoji}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-slate-900 dark:text-white">
              {item.name}
            </p>
            {connected ? (
              <span className="inline-flex rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
                Connected
              </span>
            ) : null}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {item.description}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={[
          "shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition",
          connected
            ? "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200"
            : "btn-brand text-white",
        ].join(" ")}
      >
        {connected ? "Disconnect" : "Connect"}
      </button>
    </li>
  );
}

export function GdprPanel() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
        GDPR &amp; Privacy
      </h2>
      <p className="mb-6 max-w-xl text-sm text-slate-500 dark:text-slate-400">
        Export and deletion requests will be processed in UK/EU only when the
        GDPR API is connected.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium dark:border-white/15"
        >
          Export my data
        </button>
        <button
          type="button"
          className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-700 dark:text-rose-300"
        >
          Request account deletion
        </button>
      </div>
    </section>
  );
}

export function BillingPanel() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
        Billing &amp; Plan
      </h2>

      <div className="mb-6 rounded-xl border border-slate-200/80 bg-slate-50 px-5 py-4 dark:border-white/[0.08] dark:bg-white/[0.04]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {CURRENT_PLAN_USAGE.name}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Action limit: {CURRENT_PLAN_USAGE.limit} · Used this month:{" "}
              {CURRENT_PLAN_USAGE.used}
            </p>
          </div>
          <span className="inline-flex rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold uppercase text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
            {CURRENT_PLAN_USAGE.status}
          </span>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-800 dark:text-rose-200">
        Stripe not configured — add STRIPE_SECRET_KEY when billing API is wired
        (Stripe Irish entity is approved for UK/EU).
      </div>

      <ul className="grid gap-4 lg:grid-cols-3">
        {BILLING_PLANS.map((plan) => (
          <li
            key={plan.id}
            className={[
              "flex flex-col rounded-xl border p-5",
              plan.current
                ? "border-[#00b4ff]/40 ring-1 ring-[#00b4ff]/25 dark:bg-white/[0.04]"
                : "border-slate-200/80 dark:border-white/[0.08] dark:bg-white/[0.03]",
            ].join(" ")}
          >
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {plan.name}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {plan.price}
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={plan.current}
              className={[
                "mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition",
                plan.current
                  ? "cursor-default bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                  : "btn-brand text-white",
              ].join(" ")}
            >
              {plan.current ? "Current plan" : "Upgrade"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AuditPanel() {
  const [events, setEvents] = useState(AUDIT_EVENTS);

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
        Audit Log
      </h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-white/[0.08]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/[0.08]">
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map((row) => (
              <AuditRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Showing {events.length} events (UI mock — hash chain in Phase 4).
      </p>
    </section>
  );
}

function AuditRow({ row }: { row: AuditEvent }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 dark:border-white/[0.04]">
      <td className="px-4 py-3 font-mono text-xs text-[#00b4ff] dark:text-[#7dd3fc]">
        {row.action}
      </td>
      <td className="px-4 py-3">
        <span className="text-slate-900 dark:text-white">{row.actor}</span>
        <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-white/[0.06]">
          user
        </span>
      </td>
      <td className="px-4 py-3 text-slate-500">{row.resource}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.ip}</td>
      <td className="px-4 py-3 text-slate-500">{row.ago}</td>
    </tr>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={["block", className].join(" ")}>
      <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
