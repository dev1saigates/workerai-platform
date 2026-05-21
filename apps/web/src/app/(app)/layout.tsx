import { AppShell } from "@/components/app-shell";

/**
 * Layout for all logged-in app pages (dashboard, approvals, workers, …).
 * Sidebar + header are defined here only — child pages supply main content.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
