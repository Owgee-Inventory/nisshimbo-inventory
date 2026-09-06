"use client";

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
            setErrorMessage("Password saved, but application access could not be activated.");
            setIsSubmitting(false);
            return;
        }

        router.replace("/dashboard");
    }

    return (
        <main className="flex min-h-dvh items-center justify-center bg-[#f4f1ea] px-5 py-8 text-[#173b33]">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl bg-[#fffdf8] p-6 shadow-sm sm:p-8"
            >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">
                    Finish setting up
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                    Create your password
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#71817b]">
                    Choose a password to finish creating your Nisshimbo Inventory account.
                </p>

                <label className="mt-8 block text-sm font-semibold">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className="mt-2 h-14 w-full rounded-xl border border-[#d6ded9] bg-white px-4 outline-none focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                    />
                </label>

                <label className="mt-5 block text-sm font-semibold">
                    Confirm password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className="mt-2 h-14 w-full rounded-xl border border-[#d6ded9] bg-white px-4 outline-none focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                    />
                </label>

                {errorMessage && (
                    <p role="alert" className="mt-5 rounded-lg bg-[#fff3ed] px-4 py-3 text-sm text-[#a94435]">
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 h-14 w-full rounded-xl bg-[#ef6b54] font-semibold text-white transition hover:bg-[#df5d49] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Saving..." : "Create password"}
                </button>
            </form>
        </main>
    );
}
