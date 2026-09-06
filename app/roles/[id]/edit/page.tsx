import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/app/components/app-shell";
import { getRole, permissionRecords } from "@/app/data/rbac";
import RoleForm from "@/app/roles/role-form";

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const role = getRole(id);

    if (!role) notFound();

    return (
        <AppShell activeSection="roles">
            <div className="mx-auto max-w-3xl">
                <Link href={`/roles/${role.id}`} className="text-sm font-semibold text-[#71817b] transition hover:text-[#d95642]">← Back to role</Link>
                <div className="mt-6 rounded-2xl bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(23,59,51,0.06)] sm:p-9">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">Roles / Edit</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Edit {role.name}</h1>
                    <p className="mt-3 text-sm leading-6 text-[#71817b]">Update the role details and permission assignments.</p>
                    <div className="mt-8"><RoleForm mode="edit" permissions={permissionRecords} initialRole={role} /></div>
                </div>
            </div>
        </AppShell>
    );
}
