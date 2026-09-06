import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/app/components/app-shell";
import { getPermission } from "@/app/data/rbac";
import PermissionForm from "@/app/permissions/permission-form";

export default async function EditPermissionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const permission = getPermission(id);

    if (!permission) notFound();

    return (
        <AppShell activeSection="permissions">
            <div className="mx-auto max-w-3xl">
                <Link href={`/permissions/${permission.id}`} className="text-sm font-semibold text-[#71817b] transition hover:text-[#d95642]">← Back to permission</Link>
                <div className="mt-6 rounded-2xl bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(23,59,51,0.06)] sm:p-9">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">Permissions / Edit</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Edit {permission.name}</h1>
                    <p className="mt-3 text-sm leading-6 text-[#71817b]">Update the display details and active state for this permission.</p>
                    <div className="mt-8"><PermissionForm mode="edit" initialPermission={permission} /></div>
                </div>
            </div>
        </AppShell>
    );
}
