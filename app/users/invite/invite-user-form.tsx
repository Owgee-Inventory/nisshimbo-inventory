"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

type Role = {
    id: string;
    name: string;
    description: string;
};

type Props = {
    roles: Role[];
};

export default function InviteUserForm({ roles }: Props) {
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [roleMenuOpen, setRoleMenuOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const roleMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!roleMenuOpen) {
            return;
        }

        function handlePointerDown(event: PointerEvent) {
            if (
                roleMenuRef.current &&
                !roleMenuRef.current.contains(event.target as Node)
            ) {
                setRoleMenuOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setRoleMenuOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [roleMenuOpen]);

    function toggleRole(roleId: string) {
        setSelectedRoleIds((current) =>
            current.includes(roleId)
                ? current.filter((id) => id !== roleId)
                : [...current, roleId],
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        setMessage(null);
        setError(null);
        setSubmitting(true);

        try {
            const formData = new FormData(form);
            const response = await fetch("/api/admin/invitations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: String(formData.get("email") ?? "").trim(),
                    roleIds: selectedRoleIds,
                }),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(result.error ?? "Unable to send invitation.");
                return;
            }

            setMessage("Invitation sent and roles assigned.");
            setSelectedRoleIds([]);
            setRoleMenuOpen(false);
            form.reset();
        } catch {
            setError("Unable to send invitation. Check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    }

    const selectedRoles = roles.filter((role) => selectedRoleIds.includes(role.id));
    const roleSummary = selectedRoles.length
        ? selectedRoles.map((role) => role.name).join(", ")
        : "Select one or more roles";

    return (
        <form className="space-y-7" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#173b33]">
                    Email address
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="person@company.com"
                    required
                    className="h-14 w-full rounded-xl border border-[#dce7df] bg-white px-4 text-base text-[#173b33] outline-none transition placeholder:text-[#aab5b0] focus:border-[#ef6b54] focus:ring-4 focus:ring-[#ef6b54]/10"
                />
            </div>

            <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-[#173b33]">
                    Roles
                </legend>

                <div ref={roleMenuRef} className="relative">
                    <button
                        type="button"
                        aria-expanded={roleMenuOpen}
                        aria-haspopup="listbox"
                        disabled={roles.length === 0}
                        onClick={() => setRoleMenuOpen((open) => !open)}
                        className="flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border border-[#dce7df] bg-white px-4 text-left text-sm text-[#23443c] outline-none transition hover:border-[#a8b9b1] focus-visible:border-[#ef6b54] focus-visible:ring-4 focus-visible:ring-[#ef6b54]/10 disabled:cursor-not-allowed disabled:bg-[#f4f6fa] disabled:text-[#8a9993]"
                    >
                        <span className={selectedRoles.length ? "font-medium" : "text-[#8a9993]"}>
                            {roleSummary}
                        </span>
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className={`size-5 shrink-0 transition-transform ${roleMenuOpen ? "rotate-180" : ""}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
                        </svg>
                    </button>

                    {roleMenuOpen && (
                        <div
                            role="listbox"
                            aria-label="Available roles"
                            aria-multiselectable="true"
                            className="absolute z-10 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#dce7df] bg-white py-2 shadow-[0_12px_30px_rgba(23,59,51,0.12)]"
                        >
                            {roles.map((role) => {
                                const selected = selectedRoleIds.includes(role.id);

                                return (
                                    <label
                                        key={role.id}
                                        className="flex cursor-pointer items-start gap-3 px-4 py-3 transition hover:bg-[#f4f6fa]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() => toggleRole(role.id)}
                                            className="mt-0.5 size-4 shrink-0 accent-[#173b33]"
                                        />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold text-[#173b33]">
                                                {role.name}
                                            </span>
                                            <span className="mt-1 block text-xs leading-5 text-[#71817b]">
                                                {role.description}
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

                <p className="mt-2 text-xs leading-5 text-[#8a9993]">
                    Choose one or more roles. You can change access later.
                </p>
            </fieldset>

            {roles.length === 0 && (
                <p className="rounded-lg border border-[#f2d0c8] bg-[#fff6f2] px-4 py-3 text-sm text-[#a94435]">
                    No active roles are available. Create an active role before sending an invitation.
                </p>
            )}

            {error && (
                <p role="alert" className="rounded-lg border border-[#f2d0c8] bg-[#fff6f2] px-4 py-3 text-sm text-[#a94435]">
                    {error}
                </p>
            )}
            {message && (
                <p role="status" className="rounded-lg border border-[#d3e8d8] bg-[#f1faf3] px-4 py-3 text-sm text-[#276943]">
                    {message}
                </p>
            )}

            <button
                type="submit"
                disabled={submitting || selectedRoleIds.length === 0}
                className="flex h-14 w-full items-center justify-center rounded-xl bg-[#ef6b54] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(239,107,84,0.2)] transition hover:bg-[#df5d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b33] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {submitting ? "Sending..." : "Send invitation"}
            </button>
        </form>
    );
}
