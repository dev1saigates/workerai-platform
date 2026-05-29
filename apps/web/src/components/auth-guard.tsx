"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredSession } from "@/lib/auth-api";

/**
 * Blocks (app) routes until a session exists in localStorage.
 * PHP analogy: if (!$_SESSION['user']) { header('Location: /sign-in'); exit; }
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = getStoredSession();
    if (!session?.token) {
      router.replace("/sign-in");
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
