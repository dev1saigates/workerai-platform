"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Work email is required")
    .email("Enter a valid email"),
  password: z.string().min(1, "Password is required."),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: SignInValues) {
    setServerMessage(null);

    await new Promise((r) => setTimeout(r, 400));
    console.log("Sign-in payload(wire to API next):", data);
    setServerMessage(
      "Demo only:add your API call here. Redirecting to dashboard...",
    );
    router.push("/dashboard");
  }
  return (
    <div className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#0f1523] dark:shadow-2xl dark:shadow-black/40">
      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#3b5bfd] text-lg font-bold text-white">
          W
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">
            WorkerAI
          </p>
          <p className="text-sm text-slate-400">Your AI workforce platform</p>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-white">Sign in</h1>
      <p className="mt-1 text-sm text-slate-400">Access your AI workspace.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-white"
          >
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full rounded-lg border border-white/10 bg-[#151c2e] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none ring-2 ring-transparent transition focus:border-[#5b6cff]/50 focus:ring-[#5b6cff]/25"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-white"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-[#151c2e] py-2.5 pr-11 pl-3 text-sm text-white placeholder:text-slate-500 outline-none ring-2 ring-transparent transition focus:border-[#5b6cff]/50 focus:ring-[#5b6cff]/25"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.password.message}
            </p>
          )}
        </div>
        {serverMessage && (
          <p className="text-center text-xs text-slate-300">{serverMessage}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#5b6cff] to-[#7c3aed] py-3 text-sm font-semibold text-white shadow-lg shadow-[#5b6cff]/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-[#7ab6ff] hover:underline"
        >
          Get started free
        </Link>
      </p>
      <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-500">
        By signing in you agree to our Terms of Service and Privacy Policy. UK
        GDPR compliant.
      </p>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 9.88A3 3 0 0117 12c.21 0 .42-.02.62-.06M12 5c-4.42 0-7.27 3.11-9 5 .67 1 2.1 2.8 4 4M6.53 6.53C8.23 5.06 10 4 12 4c7 0 11 8 11 8a18.1 18.1 0 01-2.64 3.36M12 19c-7 0-11-8-11-8a18 18 0 014.06-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
