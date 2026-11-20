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
        : [...current, roleId]
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
      setError(
        "Unable to send invitation. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedRoles = roles.filter((role) =>
    selectedRoleIds.includes(role.id)
  );
  const roleSummary = selectedRoles.length
    ? selectedRoles.map((role) => role.name).join(", ")
    : "Select one or more roles";

  return (
    <form className="inviteForm" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="inviteFormLabel">
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="person@company.com"
          required
          className="inviteFormInput"
        />
      </div>

      <fieldset>
        <legend className="inviteFormLabel">Roles</legend>

        <div ref={roleMenuRef} className="inviteFormRolePicker">
          <button
            type="button"
            aria-expanded={roleMenuOpen}
            aria-haspopup="listbox"
            disabled={roles.length === 0}
            onClick={() => setRoleMenuOpen((open) => !open)}
            className="inviteFormRoleTrigger"
          >
            <span
              className={
                selectedRoles.length
                  ? "inviteFormRoleSummary"
                  : "inviteFormRolePlaceholder"
              }
            >
              {roleSummary}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className={`inviteFormRoleChevron ${
                roleMenuOpen ? "is-open" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 7.5 5 5 5-5"
              />
            </svg>
          </button>

          {roleMenuOpen && (
            <div
              role="listbox"
              aria-label="Available roles"
              aria-multiselectable="true"
              className="inviteFormRoleMenu"
            >
              {roles.map((role) => {
                const selected = selectedRoleIds.includes(role.id);

                return (
                  <label key={role.id} className="inviteFormRoleOption">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRole(role.id)}
                      className="inviteFormRoleCheckbox"
                    />
                    <span className="inviteFormRoleDetails">
                      <span className="inviteFormRoleName">{role.name}</span>
                      <span className="inviteFormRoleDescription">
                        {role.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <p className="inviteFormHelp">
          Choose one or more roles. You can change access later.
        </p>
      </fieldset>

      {roles.length === 0 && (
        <p className="inviteFormMessage inviteFormMessage--error">
          No active roles are available. Create an active role before sending an
          invitation.
        </p>
      )}

      {error && (
        <p role="alert" className="inviteFormMessage inviteFormMessage--error">
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="inviteFormMessage inviteFormMessage--success"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || selectedRoleIds.length === 0}
        className="inviteFormSubmit"
      >
        {submitting ? "Sending..." : "Send invitation"}
      </button>
    </form>
  );
}
