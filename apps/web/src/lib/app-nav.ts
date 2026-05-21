import { findWorker } from "@/lib/workers-data";

/** Header titles for each static app route (shown in the top bar). */
export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Command Centre",
  "/approvals": "Approvals Queue",
  "/workers": "AI Workers",
  "/workflows": "Workflows",
  "/claw": "Claw — Ingestion",
  "/task-log": "Task Log",
  "/reports": "Reports",
  "/team": "Team",
  "/knowledge": "Knowledge Hub",
  "/settings": "Settings",
};

/**
 * Build the header title from the current pathname.
 * Handles dynamic worker chat routes like `/workers/executive-assistant`.
 */
export function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  if (pathname.startsWith("/workers/")) {
    const slug = pathname.split("/")[2] ?? "";
    const worker = findWorker(slug);
    if (worker) return `Chat — ${worker.name}`;
  }

  return "WorkerAI";
}

export const APPROVALS_BADGE_COUNT = 6;
