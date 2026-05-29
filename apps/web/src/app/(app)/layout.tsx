import { AppShell } from "@/components/app-shell";
import { AuthGuard } from "@/components/auth-guard";

/**
 * Layout for all logged-in app pages (dashboard, approvals, workers, …).
 * AuthGuard redirects to /sign-in when there is no session.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
