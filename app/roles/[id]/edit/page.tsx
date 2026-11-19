import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/app/components/app-shell";
import { getRole, permissionRecords } from "@/app/data/rbac";
import RoleForm from "@/app/roles/role-form";

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = getRole(id);

  if (!role) notFound();

  return (
    <AppShell activeSection="roles">
      <div className="accessPage accessPage--form">
        <Link href={`/roles/${role.id}`} className="accessBackLink">
          ← Back to role
        </Link>
        <div className="accessDetailCard">
          <p className="accessEyebrow">Roles / Edit</p>
          <h1 className="accessCardTitle">Edit {role.name}</h1>
          <p className="accessCardDescription">
            Update the role details and permission assignments.
          </p>
          <div className="accessFormRegion">
            <RoleForm
              mode="edit"
              permissions={permissionRecords}
              initialRole={role}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
