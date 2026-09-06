"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

function BrandMark() {
  return (
    <Image
      src="/nisshimbo-logo.png"
      alt=""
      aria-hidden="true"
      width={96}
      height={96}
      priority
      className="size-20 shrink-0 object-contain"
    />
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
      />
      <path
        fill="#34A853"
        d="M12 21.6c2.63 0 4.84-.87 6.45-2.37l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.02H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.68a5.84 5.84 0 0 1 0-3.36V7.79H3.3a9.72 9.72 0 0 0 0 8.42l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.3c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.39 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.02 9.46 6.3 12 6.3Z"
      />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.58 10.59a2 2 0 0 0 2.83 2.83M9.88 5.24A10.76 10.76 0 0 1 12 5c5.05 0 8.39 4.5 9.45 6.2a1.5 1.5 0 0 1 0 1.6 18.57 18.57 0 0 1-3.04 3.55M6.23 6.23A18.3 18.3 0 0 0 2.55 11.2a1.5 1.5 0 0 0 0 1.6C3.61 14.5 6.95 19 12 19c1.08 0 2.1-.2 3.04-.55" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.55 12.8a1.5 1.5 0 0 1 0-1.6C3.61 9.5 6.95 5 12 5s8.39 4.5 9.45 6.2a1.5 1.5 0 0 1 0 1.6C20.39 14.5 17.05 19 12 19s-8.39-4.5-9.45-6.2Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");

      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Invalid email or password.");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("id, active")
        .eq("id", user?.id)
        .maybeSingle();

      if (!profile || !profile.active) {
        await supabase.auth.signOut();
        setErrorMessage("User account is inactive.");
        return;
      }

      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <main className="min-h-dvh bg-[#f4f6fa] px-5 py-8 text-[#173b33] sm:px-8">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[460px] flex-col justify-start pt-4 sm:pt-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <BrandMark />
          <div>
            <p className="text-xl font-semibold tracking-[-0.03em]">Nisshimbo</p>
            <p className="mt-0.5 text-xs uppercase tracking-[0.22em] text-[#71817b]">Inventory</p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e2e8e4] bg-white p-6 shadow-[0_12px_35px_rgba(23,59,51,0.07)] sm:p-9">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Sign in</h1>
            <p className="mt-3 text-[0.95rem] leading-6 text-[#71817b]">Use your invited account to continue.</p>
          </div>

          {errorMessage && (
            <p role="alert" className="mb-5 rounded-lg border border-[#f2d0c8] bg-[#fff6f2] px-4 py-3 text-center text-sm text-[#a94435]">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            data-auth-provider="google"
            onClick={handleGoogleSignIn}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#dce7df] bg-white px-5 text-sm font-semibold text-[#23443c] shadow-sm transition hover:border-[#a8b9b1] hover:bg-[#f8fbf8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
          >
            <GoogleMark />
            Continue with Google
          </button>

          <div className="my-7 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.16em] text-[#9aa9a3]">
            <span className="h-px flex-1 bg-[#dce7df]" />
            <span>or</span>
            <span className="h-px flex-1 bg-[#dce7df]" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#173b33]">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                className="h-14 w-full rounded-xl border border-[#dce7df] bg-white px-4 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#173b33]">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="h-14 w-full rounded-xl border border-[#dce7df] bg-white px-4 pr-12 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#82918b] transition hover:bg-[#f0f3ef] hover:text-[#23443c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
                >
                  <EyeIcon hidden={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-[#173b33] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,59,51,0.18)] transition hover:bg-[#245247] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54] disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
