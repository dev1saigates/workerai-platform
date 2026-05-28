import type { AuthSession } from "@workerai/shared/schemas/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

const SESSION_KEY = "workerai:session";

type ApiSuccess<T> = { success: true; data: T };
type ApiError = {
  success: false;
  error: { code: string; message: string; status: number };
};

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

async function postJson<T>(
  path: string,
  body: unknown,
): Promise<ApiSuccess<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let json: ApiSuccess<T> | ApiError;
  try {
    json = (await res.json()) as ApiSuccess<T> | ApiError;
  } catch {
    throw new Error(
      res.ok
        ? "Invalid response from server"
        : `Server error (${res.status}). Is the API running on ${API_BASE}?`,
    );
  }

  if (!json.success) {
    throw new Error(json.error?.message ?? `Request failed (${res.status})`);
  }

  return json;
}

export async function registerAccount(body: {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}): Promise<AuthSession> {
  const { data } = await postJson<AuthSession>("/auth/register", body);
  storeSession(data);
  return data;
}

export async function loginAccount(body: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const { data } = await postJson<AuthSession>("/auth/login", body);
  storeSession(data);
  return data;
}
