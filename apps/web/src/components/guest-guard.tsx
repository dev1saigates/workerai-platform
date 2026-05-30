"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredSession } from "@/lib/auth-api";

/** Redirects to dashboard when already signed in (sign-in / sign-up pages). */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (getStoredSession()?.token) {
      router.replace("/dashboard");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-100 dark:bg-[#030818]">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
