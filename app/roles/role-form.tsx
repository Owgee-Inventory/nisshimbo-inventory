"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import type { PermissionRecord, RoleRecord } from "@/app/data/rbac";

type Props = {
    mode: "new" | "edit";
    permissions: PermissionRecord[];
    initialRole?: RoleRecord;
};

export default function RoleForm({ mode, permissions, initialRole }: Props) {
    const [name, setName] = useState(initialRole?.name ?? "");
    const [description, setDescription] = useState(initialRole?.description ?? "");
    const [active, setActive] = useState(initialRole?.active ?? true);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
        initialRole?.permissionIds ?? [],
    );
    const [status, setStatus] = useState<string | null>(null);

    function togglePermission(permissionId: string) {
        setSelectedPermissionIds((current) =>
            current.includes(permissionId)
                ? current.filter((id) => id !== permissionId)
                : [...current, permissionId],
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus(
            mode === "new"
                ? "Create UI is ready. Connect this form to your create endpoint."
                : "Updated state previewed. Connect this form to your update endpoint.",
        );
    }

    return (
        <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-[#23443c]">Role name</span>
                    <input
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Warehouse manager"
                        required
                        className="h-14 w-full rounded-xl border border-[#d6ded9] bg-white px-4 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                    />
                </label>

                <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-[#23443c]">Description</span>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Explain what people with this role can access."
                        rows={4}
                        required
                        className="w-full resize-y rounded-xl border border-[#d6ded9] bg-white px-4 py-3 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                    />
                </label>
            </div>

            <fieldset>
                <legend className="text-sm font-semibold text-[#23443c]">Permissions</legend>
                <p className="mt-1 text-xs leading-5 text-[#8a9993]">
                    Select the permissions this role should grant.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {permissions.map((permission) => (
                        <label
                            key={permission.id}
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e1e7e2] bg-white p-4 transition hover:border-[#b9c9c1]"
                        >
                            <input
                                type="checkbox"
                                name="permissionIds"
                                value={permission.id}
                                checked={selectedPermissionIds.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="mt-0.5 size-4 shrink-0 accent-[#173b33]"
                            />
                            <span className="min-w-0">
                                <span className="block text-sm font-semibold text-[#23443c]">{permission.name}</span>
                                <span className="mt-1 block font-mono text-xs text-[#8a9993]">{permission.key}</span>
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#23443c]">
                <input
                    type="checkbox"
                    name="active"
                    checked={active}
                    onChange={(event) => setActive(event.target.checked)}
                    className="size-4 accent-[#173b33]"
                />
                Active role
            </label>

            {status && (
                <p role="status" className="rounded-xl bg-[#edf7f0] px-4 py-3 text-sm leading-6 text-[#276943]">
                    {status}
                </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-[#e5e9e5] pt-6 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => history.back()}
                    className="h-12 rounded-xl border border-[#d6ded9] bg-white px-5 text-sm font-semibold text-[#23443c] transition hover:border-[#a8b9b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="h-12 rounded-xl bg-[#ef6b54] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(239,107,84,0.18)] transition hover:bg-[#df5d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b33]"
                >
                    {mode === "new" ? "Create role" : "Save changes"}
                </button>
            </div>
        </form>
    );
}
