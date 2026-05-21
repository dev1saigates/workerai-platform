/**
 * Shared worker list + UI-only onboarding state.
 *
 * Until the backend exists, onboarding "completion" is stored in localStorage
 * so the demo feels real (refresh-safe). Replace with API calls in Phase 2.
 *
 * PHP analogy: this is like a small read-only "model" + a $_SESSION flag.
 */

export type Worker = {
  id: string;
  slug: string;
  emoji: string;
  name: string;
  role: string;
  description: string;
  active: boolean;
  tasks: number;
  approvalRate: number;
  autoExec: string;
  onboarded: boolean;
};

export const WORKERS: Worker[] = [
  {
    id: "1",
    slug: "executive-assistant",
    emoji: "🎯",
    name: "Executive Assistant",
    role: "Executive Assistant",
    description: "Drafts emails, schedules meetings, and prepares briefings.",
    active: true,
    tasks: 234,
    approvalRate: 94,
    autoExec: "Never",
    onboarded: true,
  },
  {
    id: "2",
    slug: "receptionist",
    emoji: "📞",
    name: "Receptionist",
    role: "Receptionist",
    description: "Answers calls, takes messages, and routes enquiries.",
    active: true,
    tasks: 189,
    approvalRate: 91,
    autoExec: "Med",
    onboarded: true,
  },
  {
    id: "3",
    slug: "blog-writer",
    emoji: "✏️",
    name: "Blog Writer",
    role: "Blog Writer",
    description: "Drafts blog posts, outlines, and editorial pieces.",
    active: true,
    tasks: 156,
    approvalRate: 88,
    autoExec: "Never",
    onboarded: false,
  },
  {
    id: "4",
    slug: "social-manager",
    emoji: "📱",
    name: "Social Manager",
    role: "Social Manager",
    description: "Creates LinkedIn, Instagram and Twitter posts.",
    active: true,
    tasks: 312,
    approvalRate: 92,
    autoExec: "High",
    onboarded: true,
  },
  {
    id: "5",
    slug: "customer-success",
    emoji: "🤝",
    name: "Customer Success",
    role: "Customer Success",
    description: "Replies to customers and handles onboarding follow-ups.",
    active: true,
    tasks: 278,
    approvalRate: 95,
    autoExec: "Med",
    onboarded: false,
  },
  {
    id: "6",
    slug: "finance-clerk",
    emoji: "📊",
    name: "Finance Clerk",
    role: "Finance Clerk",
    description: "Drafts invoices, chases payments and reconciles entries.",
    active: true,
    tasks: 142,
    approvalRate: 97,
    autoExec: "Never",
    onboarded: false,
  },
];

export function findWorker(slug: string): Worker | undefined {
  return WORKERS.find((w) => w.slug === slug);
}

// ⚠️ TEMP (UI-only): swap this for a real API call once the backend lands.
const STORAGE_KEY = "workerai:onboarding";

/** Custom event the sidebar listens to so the green dot updates instantly. */
export const ONBOARDING_EVENT = "workerai:onboarding-changed";

export function getOnboardingOverrides(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function isOnboarded(worker: Worker): boolean {
  const overrides = getOnboardingOverrides();
  return worker.slug in overrides ? overrides[worker.slug] : worker.onboarded;
}

export function setOnboarded(slug: string, value: boolean): void {
  if (typeof window === "undefined") return;
  const overrides = getOnboardingOverrides();
  overrides[slug] = value;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new Event(ONBOARDING_EVENT));
}
