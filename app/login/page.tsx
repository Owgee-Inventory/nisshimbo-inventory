"use client";

import "./login.css";

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
      className="loginBrandLogo"
    />
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="loginIcon">
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
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="loginIcon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.58 10.59a2 2 0 0 0 2.83 2.83M9.88 5.24A10.76 10.76 0 0 1 12 5c5.05 0 8.39 4.5 9.45 6.2a1.5 1.5 0 0 1 0 1.6 18.57 18.57 0 0 1-3.04 3.55M6.23 6.23A18.3 18.3 0 0 0 2.55 11.2a1.5 1.5 0 0 0 0 1.6C3.61 14.5 6.95 19 12 19c1.08 0 2.1-.2 3.04-.55"
      />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="loginIcon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.55 12.8a1.5 1.5 0 0 1 0-1.6C3.61 9.5 6.95 5 12 5s8.39 4.5 9.45 6.2a1.5 1.5 0 0 1 0 1.6C20.39 14.5 17.05 19 12 19s-8.39-4.5-9.45-6.2Z"
      />
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
    <main className="loginPage">
      <section className="loginContainer">
        <div className="loginBrand">
          <BrandMark />
          <div>
            <p className="loginBrandName">Nisshimbo</p>
            <p className="loginBrandSubtitle">Inventory</p>
          </div>
        </div>

        <div className="loginCard">
          <div className="loginHeading">
            <h1 className="loginTitle">Sign in</h1>
            <p className="loginDescription">
              Use your invited account to continue.
            </p>
          </div>

          {errorMessage && (
            <p role="alert" className="loginError">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            data-auth-provider="google"
            onClick={handleGoogleSignIn}
            className="loginGoogleButton"
          >
            <GoogleMark />
            Continue with Google
          </button>

          <div className="loginDivider">
            <span className="loginDividerLine" />
            <span>or</span>
            <span className="loginDividerLine" />
          </div>

          <form className="loginForm" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="loginLabel">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                className="loginInput"
              />
            </div>

            <div>
              <label htmlFor="password" className="loginLabel">
                Password
              </label>
              <div className="loginPasswordField">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="loginInput loginPasswordInput"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="loginPasswordToggle"
                >
                  <EyeIcon hidden={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="loginSubmitButton"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
