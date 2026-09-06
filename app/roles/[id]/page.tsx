import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/app/components/app-shell";
import DeleteButton from "@/app/components/delete-button";
import { getRole, getRolePermissions } from "@/app/data/rbac";

export default async function RoleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const role = getRole(id);

    if (!role) notFound();

    const permissions = getRolePermissions(role);

    return (
        <AppShell activeSection="roles">
            <div className="mx-auto max-w-4xl">
                <Link href="/roles" className="text-sm font-semibold text-[#71817b] transition hover:text-[#d95642]">← Back to roles</Link>
                <section className="mt-6 rounded-2xl bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(23,59,51,0.06)] sm:p-9">
                    <div className="flex flex-col gap-5 border-b border-[#e5e9e5] pb-7 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">Role details</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">{role.name}</h1>
                            <p className="mt-3 max-w-xl leading-6 text-[#71817b]">{role.description}</p>
                        </div>
                        <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${role.active ? "bg-[#edf7f0] text-[#276943]" : "bg-[#f0f1ef] text-[#71817b]"}`}>
                            {role.active ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div className="pt-7">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Assigned permissions</h2>
                                <p className="mt-1 text-sm text-[#71817b]">{permissions.length} permission{permissions.length === 1 ? "" : "s"} currently assigned.</p>
                            </div>
                            <p className="text-xs text-[#8a9993]">Last updated {role.updatedAt}</p>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="rounded-xl border border-[#e1e7e2] bg-white p-4">
                                    <p className="font-semibold text-[#23443c]">{permission.name}</p>
                                    <p className="mt-1 font-mono text-xs text-[#8a9993]">{permission.key}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#e5e9e5] pt-6">
                        <Link href={`/roles/${role.id}/edit`} className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ef6b54] px-5 text-sm font-semibold text-white transition hover:bg-[#df5d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b33]">Edit role</Link>
                        <DeleteButton itemName={role.name} />
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
