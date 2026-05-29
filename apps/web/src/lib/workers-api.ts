import type { CreateWorkerBody, Worker } from "@workerai/shared/schemas/workers";
import { getAuthHeaders, getStoredSession } from "./auth-api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

type ApiSuccess<T> = { success: true; data: T };
type ApiError = {
  success: false;
  error: { code: string; message: string; status: number };
};

/** UI worker shape (includes demo stats until tasks API exists). */
export type UiWorker = Worker & {
  tasks: number;
  approvalRate: number;
  autoExec: string;
};

function toUiWorker(worker: Worker): UiWorker {
  return {
    ...worker,
    tasks: 0,
    approvalRate: 0,
    autoExec: "Never",
  };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!getStoredSession()?.token) {
    throw new Error("You must be signed in.");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  let json: ApiSuccess<T> | ApiError;
  try {
    json = (await res.json()) as ApiSuccess<T> | ApiError;
  } catch {
    throw new Error(
      res.ok
        ? "Invalid response from server"
        : `Server error (${res.status}). Is the API running?`,
    );
  }

  if (!json.success) {
    throw new Error(json.error?.message ?? `Request failed (${res.status})`);
  }

  return json.data;
}

export async function fetchWorkers(): Promise<UiWorker[]> {
  const data = await apiFetch<Worker[]>("/workers");
  return data.map(toUiWorker);
}

export async function fetchWorkerBySlug(slug: string): Promise<UiWorker> {
  const data = await apiFetch<Worker>(`/workers/${encodeURIComponent(slug)}`);
  return toUiWorker(data);
}

export async function createWorker(body: CreateWorkerBody): Promise<UiWorker> {
  const data = await apiFetch<Worker>("/workers", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return toUiWorker(data);
}

export async function markWorkerOnboarded(slug: string): Promise<void> {
  await apiFetch<Worker>(`/workers/${encodeURIComponent(slug)}`, {
    method: "PATCH",
    body: JSON.stringify({ onboarded: true }),
  });
}
