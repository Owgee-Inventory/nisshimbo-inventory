import Link from "next/link";

import AppShell from "@/app/components/app-shell";
import RoleForm from "@/app/roles/role-form";
import { createRole } from "@/lib/role-actions";
import { getAllPermissionRecords } from "@/lib/permission-actions";

export default async function NewRolePage() {
  const permissions = await getAllPermissionRecords();

  return (
    <AppShell activeSection="roles">
      <div className="accessPage accessPage--form">
        <Link href="/roles" className="accessBackLink">
          ← Back to roles
        </Link>
        <div className="accessDetailCard">
          <p className="accessEyebrow">Roles</p>
          <h1 className="accessCardTitle">Create a role</h1>
          <p className="accessCardDescription">
            Define a reusable access profile and choose the permissions it
            grants.
          </p>
          <div className="accessFormRegion">
            <RoleForm
              mode="new"
              permissions={permissions}
              action={createRole}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
