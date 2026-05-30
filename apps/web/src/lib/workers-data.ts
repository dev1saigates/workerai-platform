/**
 * Worker onboarding UI state (localStorage) + shared Worker type.
 * Worker list comes from the API — see workers-api.ts.
 */

export type { UiWorker as Worker } from "./workers-api";

export const ONBOARDING_EVENT = "workerai:onboarding-changed";

const STORAGE_KEY = "workerai:onboarding";

export function getOnboardingOverrides(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function isOnboarded(worker: { slug: string; onboarded: boolean }): boolean {
  const overrides = getOnboardingOverrides();
  return worker.slug in overrides ? overrides[worker.slug]! : worker.onboarded;
}

export function setOnboarded(slug: string, value: boolean): void {
  if (typeof window === "undefined") return;
  const overrides = getOnboardingOverrides();
  overrides[slug] = value;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new Event(ONBOARDING_EVENT));
}
