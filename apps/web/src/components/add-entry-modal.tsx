"use client";

import { useEffect, useState } from "react";
import { IconX } from "@/components/app-icons";

export type ModalField = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select" | "number" | "url";
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
  options?: { value: string; label: string }[];
};

type AddEntryModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fields: ModalField[];
  submitLabel?: string;
  size?: "md" | "lg";
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
};

export function AddEntryModal({
  open,
  onClose,
  title,
  subtitle,
  fields,
  submitLabel = "Add",
  size = "md",
  onSubmit,
}: AddEntryModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const initial: Record<string, string> = {};
    for (const f of fields) initial[f.name] = f.defaultValue ?? "";
    setValues(initial);
    setError(null);
  }, [open, fields]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        setError(`${f.label} is required.`);
        return;
      }
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const panelClass =
    size === "lg"
      ? "relative z-10 w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#121820]"
      : "relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#121820]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-entry-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className={panelClass}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/[0.08]">
          <div>
            <h2
              id="add-entry-title"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[min(80vh,720px)] space-y-4 overflow-y-auto px-5 py-4">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                {field.label}
                {field.required ? " *" : ""}
              </span>
              {field.hint ? (
                <span className="mb-1.5 block text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                  {field.hint}
                </span>
              ) : null}
              {field.type === "textarea" ? (
                <textarea
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  rows={field.rows ?? 3}
                  className={inputClass}
                />
              ) : field.type === "select" ? (
                <select
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="">Select…</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type ?? "text"}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}
            </label>
          ))}

          {error ? (
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg btn-brand px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500";
