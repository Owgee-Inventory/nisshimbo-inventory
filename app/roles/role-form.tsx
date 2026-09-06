"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import type { RoleState } from "@/lib/role-actions";
import type { PermissionRecord, RoleRecord } from "@/app/data/rbac";

type RoleAction = (
    previousState: RoleState,
    formDate: FormData,
) => Promise<RoleState>;

type PermissionOption = {
    id: string;
    name: string;
    key: string;
}

type Props = {
    mode: "new" | "edit";
    permissions: PermissionOption[];
    initialRole?: RoleRecord;
    action?: RoleAction;
};

const emptyAction: RoleAction = async (previousState) => previousState;

export default function RoleForm({
    mode,
    permissions,
    initialRole,
    action,
}: Props) {
    const [state, formAction, pending] = useActionState(
        action ?? emptyAction,
        {},
    );
    const [name, setName] = useState(initialRole?.name ?? "");
    const [description, setDescription] = useState(initialRole?.description ?? "");
    const [active, setActive] = useState(initialRole?.active ?? true);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
        initialRole?.permissionIds ?? [],
    );
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [permissionSearch, setPermissionSearch] = useState("");
    const [debouncedPermissionSearch, setDebouncedPermissionSearch] = useState("");
    const [activePermissionIndex, setActivePermissionIndex] = useState(0);
    const [status, setStatus] = useState<string | null>(null);
    const permissionSearchRef = useRef<HTMLInputElement>(null);
    const selectedPermissionButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedPermissionSearch(permissionSearch);
        }, 250);

        return () => window.clearTimeout(timeoutId);
    }, [permissionSearch]);

    useEffect(() => {
        if (!state.values) {
            return;
        }

        setName(state.values.name ?? "");
        setDescription(state.values.description ?? "");
        setActive(state.values.active ?? false);
        setSelectedPermissionIds(state.values.permissionIds ?? []);
    }, [state.values]);

    const searchTerm = debouncedPermissionSearch.trim().toLowerCase();
    const availablePermissions = permissions.filter(
        (permission) =>
            !selectedPermissionIds.includes(permission.id) &&
            permission.key.toLowerCase().includes(searchTerm),
    );
    const selectedPermissions = selectedPermissionIds
        .map((permissionId) => permissions.find((permission) => permission.id === permissionId))
        .filter((permission): permission is PermissionRecord => Boolean(permission));
    const safeActivePermissionIndex = availablePermissions.length === 0
        ? 0
        : Math.min(activePermissionIndex, availablePermissions.length - 1);

    function togglePermission(permissionId: string) {
        setSelectedPermissionIds((current) =>
            current.includes(permissionId)
                ? current.filter((id) => id !== permissionId)
                : [...current, permissionId],
        );
    }

    function selectPermission(permissionId: string) {
        setSelectedPermissionIds((current) =>
            current.includes(permissionId) ? current : [...current, permissionId],
        );
        setPermissionSearch("");
        setDebouncedPermissionSearch("");
        setPermissionsOpen(true);
    }

    function focusSelectedPermission(index: number) {
        window.requestAnimationFrame(() => {
            if (index < 0) {
                permissionSearchRef.current?.focus();
                return;
            }

            selectedPermissionButtonRefs.current[index]?.focus();
        });
    }

    function handlePermissionSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setPermissionsOpen(true);
            setActivePermissionIndex(
                availablePermissions.length === 0
                    ? 0
                    : Math.min(safeActivePermissionIndex + 1, availablePermissions.length - 1),
            );
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setPermissionsOpen(true);
            setActivePermissionIndex(Math.max(safeActivePermissionIndex - 1, 0));
        }

        if (event.key === "ArrowLeft" && permissionSearch === "" && selectedPermissions.length > 0) {
            event.preventDefault();
            focusSelectedPermission(selectedPermissions.length - 1);
        }

        if (event.key === "Enter") {
            const permission = availablePermissions[safeActivePermissionIndex];

            if (permission) {
                event.preventDefault();
                selectPermission(permission.id);
            }
        }

        if (event.key === "Backspace" && permissionSearch === "" && selectedPermissionIds.length > 0) {
            event.preventDefault();
            setSelectedPermissionIds((current) => current.slice(0, -1));
        }

        if (event.key === "Escape") {
            setPermissionsOpen(false);
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const permissionIds = formData.getAll("permissionIds").map(String);

        setStatus(
            mode === "new"
                ? `Create UI is ready. ${permissionIds.length} permission${permissionIds.length === 1 ? "" : "s"} selected. Connect this form to your create endpoint.`
                : `Updated state previewed. ${permissionIds.length} permission${permissionIds.length === 1 ? "" : "s"} selected. Connect this form to your update endpoint.`,
        );
    }

    return (
        <form
              className="space-y-7"
              action={action ? formAction : undefined}
              onSubmit={action ? undefined : handleSubmit}
        >
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
                    {state.errors?.name?.[0] && (
                        <p className="mt-2 text-sm text-red-600">
                            {state.errors?.name[0]}
                        </p>
                    )}
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
                    {state.errors?.description?.[0] && (
                        <p className="mt-2 text-sm text-red-600">
                            {state.errors.description[0]}
                        </p>
                    )}
                </label>
            </div>

            <fieldset>
                <legend className="text-sm font-semibold text-[#23443c]">Permissions</legend>
                <p className="mt-1 text-xs leading-5 text-[#8a9993]">
                    Select one or more permissions this role should grant.
                </p>

                <div className="relative mt-4">
                    {selectedPermissionIds.map((permissionId) => (
                        <input
                            key={permissionId}
                            type="hidden"
                            name="permissionIds"
                            value={permissionId}
                        />
                    ))}

                    <div className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-[#d6ded9] bg-white px-3 py-2 text-base text-[#173b33] outline-none transition focus-within:border-[#ef6b54] focus-within:ring-4 focus-within:ring-[#ef6b54]/10">
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                            {selectedPermissions.map((permission, index) => (
                                <span
                                    key={permission.id}
                                    className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#edf3ef] px-2.5 py-1.5 font-mono text-xs text-[#23443c]"
                                >
                                    <span className="truncate">{permission.key}</span>
                                    <button
                                        type="button"
                                        aria-label={`Remove ${permission.key}`}
                                        ref={(element) => {
                                            selectedPermissionButtonRefs.current[index] = element;
                                        }}
                                        onClick={() => togglePermission(permission.id)}
                                        onKeyDown={(event) => {
                                            if (event.key === "ArrowLeft") {
                                                event.preventDefault();
                                                focusSelectedPermission(index - 1);
                                            }

                                            if (event.key === "ArrowRight") {
                                                event.preventDefault();
                                                focusSelectedPermission(
                                                    index < selectedPermissions.length - 1 ? index + 1 : -1,
                                                );
                                            }

                                            if (event.key === "Backspace" || event.key === "Delete") {
                                                event.preventDefault();
                                                const focusIndex = index > 0
                                                    ? index - 1
                                                    : selectedPermissions.length > 1
                                                        ? 0
                                                        : -1;

                                                togglePermission(permission.id);
                                                focusSelectedPermission(focusIndex);
                                            }
                                        }}
                                        className="shrink-0 rounded-md px-1 text-base leading-none text-[#71817b] transition hover:bg-white hover:text-[#d95642] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#ef6b54]"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            <input
                                id="permission-search"
                                ref={permissionSearchRef}
                                type="search"
                                value={permissionSearch}
                                onChange={(event) => {
                                    setPermissionSearch(event.target.value);
                                    setPermissionsOpen(true);
                                }}
                                onFocus={() => setPermissionsOpen(true)}
                                onKeyDown={handlePermissionSearchKeyDown}
                                role="combobox"
                                aria-autocomplete="list"
                                aria-expanded={permissionsOpen}
                                aria-controls="permission-options"
                                placeholder="Search permission keys"
                                className="min-w-44 flex-1 border-0 bg-transparent px-1 py-1 text-sm text-[#173b33] outline-none placeholder:text-[#aab5b0]"
                            />
                        </div>

                        <button
                            type="button"
                            aria-label={permissionsOpen ? "Close permissions" : "Open permissions"}
                            aria-expanded={permissionsOpen}
                            aria-controls="permission-options"
                            onClick={() => setPermissionsOpen((open) => !open)}
                            className={`shrink-0 px-1 text-[#71817b] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54] ${permissionsOpen ? "rotate-180" : ""}`}
                        >
                            ▾
                        </button>
                    </div>

                    {permissionsOpen && (
                        <div
                            id="permission-options"
                            role="listbox"
                            aria-label="Permission keys"
                            className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#d6ded9] bg-white p-2 shadow-[0_12px_30px_rgba(23,59,51,0.12)]"
                        >
                            {permissionSearch !== debouncedPermissionSearch ? (
                                <p className="px-3 py-3 text-sm text-[#71817b]">Searching…</p>
                            ) : availablePermissions.length > 0 ? (
                                availablePermissions.map((permission, index) => (
                                    <button
                                        type="button"
                                        key={permission.id}
                                        role="option"
                                        aria-selected={selectedPermissionIds.includes(permission.id)}
                                        onClick={() => selectPermission(permission.id)}
                                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition ${index === safeActivePermissionIndex ? "bg-[#f4f7f4]" : "hover:bg-[#f4f7f4]"}`}
                                    >
                                        <span className="truncate font-mono text-sm text-[#23443c]">{permission.key}</span>
                                        <span aria-hidden="true" className="shrink-0 text-sm font-semibold text-[#5686a6]">
                                            {selectedPermissionIds.includes(permission.id) ? "✓" : ""}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <p className="px-3 py-3 text-sm text-[#71817b]">
                                    {permissions.length > 0
                                        ? "No unselected permission keys found."
                                        : "No permissions available."}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </fieldset>

            {state.errors?.permissionIds?.[0] && (
                <p className="mt-2 text-sm text-red-600">
                    {state.errors.permissionIds[0]}
                </p>
            )}

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

            {(state.message || status) && (
                <p
                    role={state.message ? "alert" : "status"}
                    className="rounded-xl bg-[#edf7f0] px-4 py-3 text-sm leading-6 text-[#276943]"
                >
                    {state.message ?? status}
                </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-[#e5e9e5] pt-6 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => history.back()}
                    className="h-12 rounded-xl border border-[#d6ded9] bg-white px-5 text-sm font-semibold text-[#23443c] transition hover:border-[#a8b9b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={pending}
                    className="h-12 rounded-xl bg-[#ef6b54] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(239,107,84,0.18)] transition hover:bg-[#df5d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b33]"
                >
                    {pending
                        ? "Creating..."
                        : mode === "new"
                            ? "Create role"
                            : "Save changes"
                    }
                </button>
            </div>
        </form>
    );
}
