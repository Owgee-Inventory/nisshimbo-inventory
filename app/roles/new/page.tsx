import Link from "next/link";

import AppShell from "@/app/components/app-shell";
import { permissionRecords } from "@/app/data/rbac";
import RoleForm from "@/app/roles/role-form";

export default function NewRolePage() {
    return (
        <AppShell activeSection="roles">
            <div className="mx-auto max-w-3xl">
                <Link href="/roles" className="text-sm font-semibold text-[#71817b] transition hover:text-[#d95642]">← Back to roles</Link>
                <div className="mt-6 rounded-2xl bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(23,59,51,0.06)] sm:p-9">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">Roles</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Create a role</h1>
                    <p className="mt-3 text-sm leading-6 text-[#71817b]">Define a reusable access profile and choose the permissions it grants.</p>
                    <div className="mt-8"><RoleForm mode="new" permissions={permissionRecords} /></div>
                </div>
            </div>
        </AppShell>
    );
}
