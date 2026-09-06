import Link from "next/link";

import AppShell from "@/app/components/app-shell";
import PermissionForm from "@/app/permissions/permission-form";

export default function NewPermissionPage() {
    return (
        <AppShell activeSection="permissions">
            <div className="mx-auto max-w-3xl">
                <Link href="/permissions" className="text-sm font-semibold text-[#71817b] transition hover:text-[#d95642]">← Back to permissions</Link>
                <div className="mt-6 rounded-2xl bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(23,59,51,0.06)] sm:p-9">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">Permissions</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Create a permission</h1>
                    <p className="mt-3 text-sm leading-6 text-[#71817b]">Create one explicit action that can later be assigned to roles.</p>
                    <div className="mt-8"><PermissionForm mode="new" /></div>
                </div>
            </div>
        </AppShell>
    );
}
