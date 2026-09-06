import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/app/components/app-shell";
import DeleteButton from "@/app/components/delete-button";
import { getPermission, roleRecords } from "@/app/data/rbac";

export default async function PermissionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const permission = getPermission(id);

    if (!permission) notFound();

    const assignedRoles = roleRecords.filter((role) => role.permissionIds.includes(permission.id));

    return (
        <AppShell activeSection="permissions">
            <div className="mx-auto max-w-4xl">
                <Link href="/permissions" className="text-sm font-semibold text-[#71817b] transition hover:text-[#d95642]">← Back to permissions</Link>
                <section className="mt-6 rounded-2xl bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(23,59,51,0.06)] sm:p-9">
                    <div className="flex flex-col gap-5 border-b border-[#e5e9e5] pb-7 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">Permission details</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">{permission.name}</h1>
                            <p className="mt-3 font-mono text-sm text-[#71817b]">{permission.key}</p>
                        </div>
                        <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${permission.active ? "bg-[#edf7f0] text-[#276943]" : "bg-[#f0f1ef] text-[#71817b]"}`}>
                            {permission.active ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <dl className="grid gap-4 border-b border-[#e5e9e5] py-7 sm:grid-cols-2">
                        <div className="rounded-xl bg-[#faf9f4] p-4"><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9993]">Resource</dt><dd className="mt-2 font-semibold text-[#23443c]">{permission.resource}</dd></div>
                        <div className="rounded-xl bg-[#faf9f4] p-4"><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9993]">Action</dt><dd className="mt-2 font-semibold text-[#23443c]">{permission.action}</dd></div>
                    </dl>

                    <div className="pt-7">
                        <h2 className="text-lg font-semibold">Assigned to roles</h2>
                        <p className="mt-1 text-sm text-[#71817b]">{assignedRoles.length} role{assignedRoles.length === 1 ? "" : "s"} currently grant this permission.</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {assignedRoles.map((role) => <span key={role.id} className="rounded-full border border-[#d6ded9] bg-white px-3 py-1.5 text-sm font-semibold text-[#23443c]">{role.name}</span>)}
                        </div>
                        <p className="mt-5 text-xs text-[#8a9993]">Last updated {permission.updatedAt}</p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#e5e9e5] pt-6">
                        <Link href={`/permissions/${permission.id}/edit`} className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ef6b54] px-5 text-sm font-semibold text-white transition hover:bg-[#df5d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b33]">Edit permission</Link>
                        <DeleteButton itemName={permission.name} />
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
