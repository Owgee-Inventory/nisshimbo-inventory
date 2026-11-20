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
        : "Updated state previewed. Connect this form to your update endpoint."
    );
  }

  return (
    <form className="accessForm" onSubmit={handleSubmit}>
      <div className="accessFormGrid">
        <label className="accessField accessField--full">
          <span className="accessFieldLabel">Permission name</span>
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Invite users"
            required
            className="accessInput"
          />
        </label>

        <label className="accessField accessField--full">
          <span className="accessFieldLabel">Permission key</span>
          <input
            name="key"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="e.g. users:invite"
            pattern="[a-z0-9_-]+:[a-z0-9_-]+"
            required
            className="accessInput accessInput--key"
          />
          <span className="accessFieldHint">
            Use the resource:action format.
          </span>
        </label>

        <label className="accessField">
          <span className="accessFieldLabel">Resource</span>
          <input
            name="resource"
            value={resource}
            onChange={(event) => setResource(event.target.value)}
            placeholder="users"
            required
            className="accessInput"
          />
        </label>

        <label className="accessField">
          <span className="accessFieldLabel">Action</span>
          <input
            name="action"
            value={action}
            onChange={(event) => setAction(event.target.value)}
            placeholder="invite"
            required
            className="accessInput"
          />
        </label>
      </div>

      <label className="accessCheckboxLabel">
        <input
          type="checkbox"
          name="active"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
          className="accessCheckbox"
        />
        Active permission
      </label>

      {status && (
        <p role="status" className="accessFormStatus">
          {status}
        </p>
      )}

      <div className="accessFormActions">
        <button
          type="button"
          onClick={() => history.back()}
          className="accessCancelButton"
        >
          Cancel
        </button>
        <button type="submit" className="accessSubmitButton">
          {mode === "new" ? "Create permission" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
