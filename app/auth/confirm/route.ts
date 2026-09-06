import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const tokenHash = requestUrl.searchParams.get("token_hash");
    const type = requestUrl.searchParams.get("type");

    if (!tokenHash || type !== "invite") {
        return NextResponse.redirect(
            new URL("/login?error=invalid-invitation", requestUrl.origin),
        );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "invite",
    });

    if (error) {
        return NextResponse.redirect(
            new URL("/login?error=expired-invitation", requestUrl.origin),
        );
    }

    return NextResponse.redirect(
        new URL("/set-password", requestUrl.origin),
    );
}
