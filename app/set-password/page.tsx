"use client";

import "./set-password.css";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const activationResponse = await fetch("/api/auth/activate", {
      method: "POST",
    });

    if (!activationResponse.ok) {
      setErrorMessage(
        "Password saved, but application access could not be activated."
      );
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <main className="passwordSetupPage">
      <form onSubmit={handleSubmit} className="passwordSetupForm">
        <p className="passwordSetupEyebrow">Finish setting up</p>

        <h1 className="passwordSetupTitle">Create your password</h1>

        <p className="passwordSetupDescription">
          Choose a password to finish creating your Nisshimbo Inventory account.
        </p>

        <label className="passwordSetupLabel passwordSetupFirstLabel">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="passwordSetupInput"
          />
        </label>

        <label className="passwordSetupLabel">
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="passwordSetupInput"
          />
        </label>

        {errorMessage && (
          <p role="alert" className="passwordSetupError">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="passwordSetupSubmit"
        >
          {isSubmitting ? "Saving..." : "Create password"}
        </button>
      </form>
    </main>
  );
}
