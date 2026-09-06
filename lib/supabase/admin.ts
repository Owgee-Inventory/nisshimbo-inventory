import "server-only"
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
            }
        }
    )
}
