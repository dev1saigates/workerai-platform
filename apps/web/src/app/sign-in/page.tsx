import type { Metadata } from "next";
import { GuestGuard } from "@/components/guest-guard";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in | WorkerAI",
  description: "Sign in to your WorkerAI workspace",
};

export default function SignInPage() {
  return (
    <GuestGuard>
      <div className="app-canvas relative flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10 dark:bg-transparent">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <SignInForm />
      </div>
    </GuestGuard>
  );
}
