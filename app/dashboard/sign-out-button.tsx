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
    <div className="signOutAction">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="signOutButton"
      >
        <span className="signOutButtonContent">
          <span className="signOutButtonIconBox">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              className="signOutButtonIcon"
            >
              <path d="M8 4.5H5.5A1.5 1.5 0 0 0 4 6v8a1.5 1.5 0 0 0 1.5 1.5H8M11.5 13l3-3-3-3M8.5 10h6" />
            </svg>
          </span>
          <span>
            <span className="signOutButtonLabel">
              {isSigningOut ? "Signing out..." : "Sign out"}
            </span>
            <span className="signOutButtonDescription">End your session</span>
          </span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          className="signOutButtonArrow"
        >
          <path d="m8 5 5 5-5 5" />
        </svg>
      </button>

      {errorMessage && (
        <p role="alert" className="signOutError">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
