"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import type { PermissionRecord } from "@/app/data/rbac";

type Props = {
    mode: "new" | "edit";
    initialPermission?: PermissionRecord;
};

export default function PermissionForm({ mode, initialPermission }: Props) {
    const [key, setKey] = useState(initialPermission?.key ?? "");
    const [resource, setResource] = useState(initialPermission?.resource ?? "");
    const [action, setAction] = useState(initialPermission?.action ?? "");
    const [name, setName] = useState(initialPermission?.name ?? "");
    const [active, setActive] = useState(initialPermission?.active ?? true);
    const [status, setStatus] = useState<string | null>(null);

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
                    <span className="mb-2 block text-sm font-semibold text-[#23443c]">Permission name</span>
                    <input
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Invite users"
                        required
                        className="h-14 w-full rounded-xl border border-[#d6ded9] bg-white px-4 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                    />
                </label>

                <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-[#23443c]">Permission key</span>
                    <input
                        name="key"
                        value={key}
                        onChange={(event) => setKey(event.target.value)}
                        placeholder="e.g. users:invite"
                        pattern="[a-z0-9_-]+:[a-z0-9_-]+"
                        required
                        className="h-14 w-full rounded-xl border border-[#d6ded9] bg-white px-4 font-mono text-sm text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                    />
                    <span className="mt-2 block text-xs text-[#8a9993]">Use the resource:action format.</span>
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#23443c]">Resource</span>
                    <input
                        name="resource"
                        value={resource}
                        onChange={(event) => setResource(event.target.value)}
                        placeholder="users"
                        required
                        className="h-14 w-full rounded-xl border border-[#d6ded9] bg-white px-4 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#23443c]">Action</span>
                    <input
                        name="action"
                        value={action}
                        onChange={(event) => setAction(event.target.value)}
                        placeholder="invite"
                        required
                        className="h-14 w-full rounded-xl border border-[#d6ded9] bg-white px-4 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                    />
                </label>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#23443c]">
                <input
                    type="checkbox"
                    name="active"
                    checked={active}
                    onChange={(event) => setActive(event.target.checked)}
                    className="size-4 accent-[#173b33]"
                />
                Active permission
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
                    {mode === "new" ? "Create permission" : "Save changes"}
                </button>
            </div>
        </form>
    );
}
