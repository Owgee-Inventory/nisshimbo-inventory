import Link from "next/link";

import AppShell from "@/app/components/app-shell";
import DeleteButton from "@/app/components/delete-button";
import { getRolePermissions, permissionRecords, roleRecords } from "@/app/data/rbac";

function StatusPill({ active }: { active: boolean }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-[#edf7f0] text-[#276943]" : "bg-[#f0f1ef] text-[#71817b]"}`}
        >
            {active ? "Active" : "Inactive"}
        </span>
    );
}

export default function RolesPage() {
    return (
        <AppShell activeSection="roles">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">Access control</p>
                        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">Roles</h1>
                        <p className="mt-3 max-w-xl text-[#71817b]">
                            Group permissions into reusable access profiles for your team.
                        </p>
                    </div>

                    <Link
                        href="/roles/new"
                        className="inline-flex h-12 items-center justify-center rounded-xl bg-[#ef6b54] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(239,107,84,0.18)] transition hover:bg-[#df5d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b33]"
                    >
                        New role
                    </Link>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#fffdf8] p-5 shadow-[0_8px_25px_rgba(23,59,51,0.05)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a9993]">Total roles</p>
                        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{roleRecords.length}</p>
                    </div>
                    <div className="rounded-2xl bg-[#fffdf8] p-5 shadow-[0_8px_25px_rgba(23,59,51,0.05)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a9993]">Active roles</p>
                        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{roleRecords.filter((role) => role.active).length}</p>
                    </div>
                    <div className="rounded-2xl bg-[#fffdf8] p-5 shadow-[0_8px_25px_rgba(23,59,51,0.05)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a9993]">Available permissions</p>
                        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{permissionRecords.length}</p>
                    </div>
                </div>

                <section className="mt-6 overflow-hidden rounded-2xl border border-[#e1e7ee] bg-white shadow-[0_10px_30px_rgba(23,59,51,0.04)]">
                    <div className="flex flex-col gap-3 border-b border-[#e1e7ee] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5686a6]">Permission matrix</p>
                            <h2 className="mt-2 text-lg font-semibold">Role access at a glance</h2>
                            <p className="mt-1 text-sm text-[#71817b]">Review which roles can perform each application action.</p>
                        </div>
                        <Link href="/permissions" className="text-sm font-semibold text-[#5686a6] transition hover:text-[#d95642]">Manage permissions →</Link>
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-6">
                        <table className="w-full min-w-[640px] overflow-hidden rounded-xl text-left text-sm">
                            <thead className="bg-[#183550] text-xs uppercase tracking-[0.12em] text-white">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Capability</th>
                                    {roleRecords.map((role) => <th key={role.id} className="px-4 py-3 text-center font-semibold">{role.name}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8edf2] border-x border-b border-[#e8edf2]">
                                {permissionRecords.map((permission) => (
                                    <tr key={permission.id} className="transition hover:bg-[#f7fafe]">
                                        <td className="px-4 py-3.5">
                                            <span className="block font-semibold text-[#23443c]">{permission.name}</span>
                                            <span className="mt-1 block font-mono text-[0.68rem] text-[#91a0ad]">{permission.key}</span>
                                        </td>
                                        {roleRecords.map((role) => {
                                            const granted = role.permissionIds.includes(permission.id);
                                            return <td key={role.id} className="px-4 py-3.5 text-center"><span className={granted ? "font-semibold text-[#2f9d75]" : "text-[#c4cdd5]"}>{granted ? "✓" : "—"}</span></td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mt-6 overflow-hidden rounded-2xl border border-[#e1e7ee] bg-white shadow-[0_10px_30px_rgba(23,59,51,0.04)]">
                    <div className="border-b border-[#e1e7ee] px-5 py-5 sm:px-6">
                        <h2 className="text-lg font-semibold">All roles</h2>
                        <p className="mt-1 text-sm text-[#71817b]">Review access profiles and their assigned permissions.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left">
                            <thead className="bg-[#183550] text-xs uppercase tracking-[0.14em] text-white">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Permissions</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#edf0ec]">
                                {roleRecords.map((role) => (
                                    <tr key={role.id} className="align-middle transition hover:bg-[#fcfbf7]">
                                        <td className="px-6 py-5">
                                            <Link href={`/roles/${role.id}`} className="group block">
                                                <span className="block font-semibold text-[#23443c] group-hover:text-[#d95642]">{role.name}</span>
                                                <span className="mt-1 block max-w-sm text-sm text-[#71817b]">{role.description}</span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-[#71817b]">
                                            {getRolePermissions(role).length} assigned
                                        </td>
                                        <td className="px-6 py-5"><StatusPill active={role.active} /></td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/roles/${role.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#71817b] transition hover:bg-[#f4f1ea] hover:text-[#23443c]">View</Link>
                                                <Link href={`/roles/${role.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#d95642] transition hover:bg-[#fff3ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]">Edit</Link>
                                                <DeleteButton itemName={role.name} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
