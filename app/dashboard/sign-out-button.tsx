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
        <div className="flex w-full flex-col items-start gap-2">
            <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="group inline-flex h-12 w-full items-center justify-between rounded-xl border border-[#477065] bg-[#21483e] px-3.5 text-left text-sm font-semibold text-[#fffaf1] transition hover:border-[#ef6b54] hover:bg-[#285247] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54] disabled:cursor-not-allowed disabled:opacity-60"
            >
                <span className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-lg bg-[#ef6b54]/15 text-[#f5a08f] transition group-hover:bg-[#ef6b54]/25">
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" className="size-4">
                            <path d="M8 4.5H5.5A1.5 1.5 0 0 0 4 6v8a1.5 1.5 0 0 0 1.5 1.5H8M11.5 13l3-3-3-3M8.5 10h6" />
                        </svg>
                    </span>
                    <span>
                        <span className="block">{isSigningOut ? "Signing out..." : "Sign out"}</span>
                        <span className="mt-0.5 block text-xs font-normal text-[#b8cec3]">End your session</span>
                    </span>
                </span>
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" className="size-4 text-[#91b1a4] transition group-hover:translate-x-0.5 group-hover:text-[#fffaf1]">
                    <path d="m8 5 5 5-5 5" />
                </svg>
            </button>

            {errorMessage && (
                <p role="alert" className="rounded-lg bg-[#fff3ed] px-3 py-2 text-sm text-[#a94435]">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
