import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(
            new URL("/login?error=google-callback", requestUrl.origin),
        );
    }

    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
        console.error("OAuth exchange failed:", exchangeError);

        return NextResponse.redirect(
            new URL("/login?error=google-callback", requestUrl.origin),
        );
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(
            new URL("/login?error=not-authorized", requestUrl.origin),
        );
    }

    const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id, active")
        .eq("id", user.id)
        .maybeSingle();

    if (!profile || !profile.active || profileError) {
        await supabase.auth.signOut();

        return NextResponse.redirect(
            new URL("/login?error=not-authorized", requestUrl.origin),
        )
    }

    return NextResponse.redirect(
        new URL("/dashboard", requestUrl.origin),
    )
}
