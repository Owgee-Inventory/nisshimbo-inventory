"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-10 shrink-0 grid-cols-2 gap-1 rounded-xl bg-[#ef6b54] p-2 shadow-[0_8px_20px_rgba(239,107,84,0.22)]"
    >
      <span className="rounded-[3px] bg-[#fffaf1]" />
      <span className="rounded-[3px] bg-[#fffaf1]/65" />
      <span className="rounded-[3px] bg-[#fffaf1]/65" />
      <span className="rounded-[3px] bg-[#fffaf1]" />
    </span>
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
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

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
    <main className="min-h-dvh bg-[#f4f1ea] text-[#173b33]">
      <div className="grid min-h-dvh lg:grid-cols-[minmax(0,0.9fr)_minmax(500px,1.1fr)]">
        <aside className="relative hidden overflow-hidden bg-[#173b33] px-10 py-10 text-[#fffaf1] lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
          <div className="relative z-10 flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-[1.05rem] font-semibold tracking-[-0.02em]">Nisshimbo</p>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#b8cec3]">Inventory</p>
            </div>
          </div>

          <div className="relative z-10 max-w-lg pb-8">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[#ef9a85]">Your stock, in sync</p>
            <h1 className="max-w-md text-4xl font-semibold leading-[1.08] tracking-[-0.045em] xl:text-6xl">
              Keep every item moving in the right direction.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#c6d8d0]">
              A clear, focused workspace for your inventory and the team that keeps it running.
            </p>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-3 border-t border-[#477064] pt-5 text-xs text-[#c6d8d0]">
              <div>
                <p className="mb-1 text-lg font-semibold text-[#fffaf1]">01</p>
                <p>See what is in stock</p>
              </div>
              <div>
                <p className="mb-1 text-lg font-semibold text-[#fffaf1]">02</p>
                <p>Move with confidence</p>
              </div>
              <div>
                <p className="mb-1 text-lg font-semibold text-[#fffaf1]">03</p>
                <p>Work as one team</p>
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-28 size-[30rem] rounded-full border border-[#477064]/70" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-12 size-80 rounded-full border border-[#477064]/45" />
          <div aria-hidden="true" className="pointer-events-none absolute right-24 top-28 size-3 rounded-full bg-[#ef6b54] shadow-[0_0_0_10px_rgba(239,107,84,0.12)]" />
        </aside>

        <section className="flex min-h-dvh items-center justify-center px-5 py-8 sm:px-10 lg:px-14 xl:px-24">
          <div className="w-full max-w-[440px]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <BrandMark />
              <div>
                <p className="text-[1.05rem] font-semibold tracking-[-0.02em]">Nisshimbo</p>
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#71817b]">Inventory</p>
              </div>
            </div>

            <div className="mb-9">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#ef6b54]">Welcome back</p>
              <h2 className="text-3xl font-semibold tracking-[-0.045em] text-[#173b33] sm:text-4xl">Sign in to your workspace</h2>
              <p className="mt-3 text-[0.95rem] leading-6 text-[#71817b]">Use your invited account to continue.</p>
            </div>

            <button
              type="button"
              data-auth-provider="google"
              onClick={handleGoogleSignIn}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#d6ded9] bg-[#fffdf8] px-5 text-sm font-semibold text-[#23443c] shadow-[0_2px_8px_rgba(23,59,51,0.03)] transition hover:border-[#a8b9b1] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
            >
              <GoogleMark />
              Continue with Google
            </button>

            <div className="my-7 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.16em] text-[#9aa9a3]">
              <span className="h-px flex-1 bg-[#dce2de]" />
              <span>or</span>
              <span className="h-px flex-1 bg-[#dce2de]" />
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#23443c]">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                  className="h-14 w-full rounded-xl border border-[#d6ded9] bg-[#fffdf8] px-4 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label htmlFor="password" className="block text-sm font-semibold text-[#23443c]">Password</label>
                  <button type="button" className="text-xs font-semibold text-[#d95642] transition hover:text-[#b94433] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]">Forgot password?</button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    className="h-14 w-full rounded-xl border border-[#d6ded9] bg-[#fffdf8] px-4 pr-12 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
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

              <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-[#71817b]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="size-4 accent-[#173b33]"
                />
                Remember me on this device
              </label>

              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-xl bg-[#ef6b54] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(239,107,84,0.22)] transition hover:bg-[#df5d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b33]"
              >
                Sign in
              </button>

              {errorMessage && (
                <p role="alert" className="rounded-lg bg-[#fff3ed] px-4 py-3 text-center text-sm text-[#a94435]">
                  {errorMessage}
                </p>
              )}
            </form>

            <p className="mt-9 text-center text-xs leading-5 text-[#8a9993]">
              Access is invite-only. Contact your administrator if you need an account.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
