"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAccount } from "@/lib/auth-api";
import {
  authBrandSubtitle,
  authBrandTitle,
  authCard,
  authEyeButton,
  authFieldError,
  authFooter,
  authHeading,
  authInput,
  authLabel,
  authLink,
  authMuted,
  authServerMessage,
  brandCta,
} from "@/lib/brand";
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
    try {
      await loginAccount({
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch (err) {
      setServerMessage(
        err instanceof Error ? err.message : "Could not sign in.",
      );
    }
  }
  return (
    <div className={`${authCard} max-w-[440px]`}>
      <div className="mb-8 flex items-start gap-3">
        <div className="brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white shadow-[0_0_20px_rgba(0,180,255,0.4)]">
          W
        </div>
        <div>
          <p className={authBrandTitle}>WorkerAI</p>
          <p className={authBrandSubtitle}>Your AI workforce platform</p>
        </div>
      </div>
      <h1 className={authHeading}>Sign in</h1>
      <p className={`mt-1 ${authMuted}`}>Access your AI workspace.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className={authLabel}>
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={authInput}
            {...register("email")}
          />
          {errors.email && (
            <p className={authFieldError}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className={authLabel}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${authInput} pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={authEyeButton}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && (
            <p className={authFieldError}>{errors.password.message}</p>
          )}
        </div>
        {serverMessage && (
          <p className={authServerMessage}>{serverMessage}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex w-full rounded-lg py-3 text-sm ${brandCta} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className={`mt-6 text-center ${authMuted}`}>
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className={authLink}>
          Get started free
        </Link>
      </p>
      <p className={`mt-8 text-center ${authFooter}`}>
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
