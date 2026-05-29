import type { Metadata } from "next";
import { GuestGuard } from "@/components/guest-guard";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Get started | WorkerAI",
  description: "Create your WorkerAI workspace",
};

export default function SignUpPage() {
  return (
    <GuestGuard>
      <div className="app-canvas relative flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10 dark:bg-transparent">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <SignUpForm />
      </div>
    </GuestGuard>
  );
}
