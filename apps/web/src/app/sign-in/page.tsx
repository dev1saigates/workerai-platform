import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in | WorkerAI",
  description: "Sign in to your WorkerAI workspace",
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10 dark:bg-[#070b14]">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <SignInForm />
    </div>
  );
}
