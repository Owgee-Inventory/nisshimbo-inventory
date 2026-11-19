"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import type { RoleState } from "@/lib/role-actions";
import type { PermissionRecord, RoleRecord } from "@/app/data/rbac";

type RoleAction = (
  previousState: RoleState,
  formDate: FormData
) => Promise<RoleState>;

type PermissionOption = {
  id: string;
  name: string;
  key: string;
};

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
    {}
  );
  const [name, setName] = useState(initialRole?.name ?? "");
  const [description, setDescription] = useState(
    initialRole?.description ?? ""
  );
  const [active, setActive] = useState(initialRole?.active ?? true);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    initialRole?.permissionIds ?? []
  );
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState("");
  const [debouncedPermissionSearch, setDebouncedPermissionSearch] =
    useState("");
  const [activePermissionIndex, setActivePermissionIndex] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const permissionSearchRef = useRef<HTMLInputElement>(null);
  const selectedPermissionButtonRefs = useRef<Array<HTMLButtonElement | null>>(
    []
  );

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
      permission.key.toLowerCase().includes(searchTerm)
  );
  const selectedPermissions = selectedPermissionIds
    .map((permissionId) =>
      permissions.find((permission) => permission.id === permissionId)
    )
    .filter((permission): permission is PermissionRecord =>
      Boolean(permission)
    );
  const safeActivePermissionIndex =
    availablePermissions.length === 0
      ? 0
      : Math.min(activePermissionIndex, availablePermissions.length - 1);

  function togglePermission(permissionId: string) {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId]
    );
  }

  function selectPermission(permissionId: string) {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId) ? current : [...current, permissionId]
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

  function handlePermissionSearchKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setPermissionsOpen(true);
      setActivePermissionIndex(
        availablePermissions.length === 0
          ? 0
          : Math.min(
              safeActivePermissionIndex + 1,
              availablePermissions.length - 1
            )
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setPermissionsOpen(true);
      setActivePermissionIndex(Math.max(safeActivePermissionIndex - 1, 0));
    }

    if (
      event.key === "ArrowLeft" &&
      permissionSearch === "" &&
      selectedPermissions.length > 0
    ) {
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

    if (
      event.key === "Backspace" &&
      permissionSearch === "" &&
      selectedPermissionIds.length > 0
    ) {
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
        ? `Create UI is ready. ${permissionIds.length} permission${
            permissionIds.length === 1 ? "" : "s"
          } selected. Connect this form to your create endpoint.`
        : `Updated state previewed. ${permissionIds.length} permission${
            permissionIds.length === 1 ? "" : "s"
          } selected. Connect this form to your update endpoint.`
    );
  }

  return (
    <form
      className="accessForm"
      action={action ? formAction : undefined}
      onSubmit={action ? undefined : handleSubmit}
    >
      <div className="accessFormGrid">
        <label className="accessField accessField--full">
          <span className="accessFieldLabel">Role name</span>
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Warehouse manager"
            required
            className="accessInput"
          />
          {state.errors?.name?.[0] && (
            <p className="accessFieldError">{state.errors?.name[0]}</p>
          )}
        </label>

        <label className="accessField accessField--full">
          <span className="accessFieldLabel">Description</span>
          <textarea
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Explain what people with this role can access."
            rows={4}
            required
            className="accessTextarea"
          />
          {state.errors?.description?.[0] && (
            <p className="accessFieldError">{state.errors.description[0]}</p>
          )}
        </label>
      </div>

      <fieldset>
        <legend className="accessLegend">Permissions</legend>
        <p className="accessPermissionHint">
          Select one or more permissions this role should grant.
        </p>

        <div className="accessPermissionPicker">
          {selectedPermissionIds.map((permissionId) => (
            <input
              key={permissionId}
              type="hidden"
              name="permissionIds"
              value={permissionId}
            />
          ))}

          <div className="accessPermissionControl">
            <div className="accessPermissionSelection">
              {selectedPermissions.map((permission, index) => (
                <span key={permission.id} className="accessPermissionTag">
                  <span className="accessPermissionTagKey">
                    {permission.key}
                  </span>
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
                          index < selectedPermissions.length - 1
                            ? index + 1
                            : -1
                        );
                      }

                      if (event.key === "Backspace" || event.key === "Delete") {
                        event.preventDefault();
                        const focusIndex =
                          index > 0
                            ? index - 1
                            : selectedPermissions.length > 1
                            ? 0
                            : -1;

                        togglePermission(permission.id);
                        focusSelectedPermission(focusIndex);
                      }
                    }}
                    className="accessPermissionRemove"
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
                className="accessPermissionSearch"
              />
            </div>

            <button
              type="button"
              aria-label={
                permissionsOpen ? "Close permissions" : "Open permissions"
              }
              aria-expanded={permissionsOpen}
              aria-controls="permission-options"
              onClick={() => setPermissionsOpen((open) => !open)}
              className={`accessPermissionToggle ${
                permissionsOpen ? "accessPermissionToggle--open" : ""
              }`}
            >
              ▾
            </button>
          </div>

          {permissionsOpen && (
            <div
              id="permission-options"
              role="listbox"
              aria-label="Permission keys"
              className="accessPermissionOptions"
            >
              {permissionSearch !== debouncedPermissionSearch ? (
                <p className="accessPermissionMessage">Searching…</p>
              ) : availablePermissions.length > 0 ? (
                availablePermissions.map((permission, index) => (
                  <button
                    type="button"
                    key={permission.id}
                    role="option"
                    aria-selected={selectedPermissionIds.includes(
                      permission.id
                    )}
                    onClick={() => selectPermission(permission.id)}
                    className={`accessPermissionOption ${
                      index === safeActivePermissionIndex
                        ? "accessPermissionOption--selected"
                        : ""
                    }`}
                  >
                    <span className="accessPermissionOptionKey">
                      {permission.key}
                    </span>
                    <span aria-hidden="true" className="accessPermissionCheck">
                      {selectedPermissionIds.includes(permission.id) ? "✓" : ""}
                    </span>
                  </button>
                ))
              ) : (
                <p className="accessPermissionMessage">
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
        <p className="accessFieldError">{state.errors.permissionIds[0]}</p>
      )}

      <label className="accessCheckboxLabel">
        <input
          type="checkbox"
          name="active"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
          className="accessCheckbox"
        />
        Active role
      </label>

      {(state.message || status) && (
        <p
          role={state.message ? "alert" : "status"}
          className="accessFormStatus"
        >
          {state.message ?? status}
        </p>
      )}

      <div className="accessFormActions">
        <button
          type="button"
          disabled={pending}
          onClick={() => history.back()}
          className="accessCancelButton"
        >
          Cancel
        </button>
        <button type="submit" disabled={pending} className="accessSubmitButton">
          {pending
            ? "Creating..."
            : mode === "new"
            ? "Create role"
            : "Save changes"}
        </button>
      </div>
    </form>
  );
}
