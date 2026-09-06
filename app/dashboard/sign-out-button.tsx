"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSignOut() {
        setIsSigningOut(true);
        setErrorMessage(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            setErrorMessage("Unable to sign out. Please try again.");
            setIsSigningOut(false);
            return;
        }

        router.replace("/login");
        router.refresh();
    }

    return (
        <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d6ded9] bg-[#fffdf8] px-4 text-sm font-semibold text-[#23443c] transition hover:border-[#ef6b54] hover:text-[#d95642] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSigningOut ? "Signing out..." : "Sign out"}
            </button>

            {errorMessage && (
                <p role="alert" className="text-sm text-[#a94435]">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
