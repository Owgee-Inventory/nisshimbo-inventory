import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/app/components/app-shell";
import DeleteButton from "@/app/components/delete-button";
import { getPermission, roleRecords } from "@/app/data/rbac";

export default async function PermissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const permission = getPermission(id);

  if (!permission) notFound();

  const assignedRoles = roleRecords.filter((role) =>
    role.permissionIds.includes(permission.id)
  );

  return (
    <AppShell activeSection="permissions">
      <div className="accessPage accessPage--detail">
        <Link href="/permissions" className="accessBackLink">
          ← Back to permissions
        </Link>
        <section className="accessDetailCard">
          <div className="accessDetailHeader">
            <div>
              <p className="accessEyebrow">Permission details</p>
              <h1 className="accessCardTitle">{permission.name}</h1>
              <p className="accessPermissionKey">{permission.key}</p>
            </div>
            <span
              className={`accessStatus accessStatus--detail ${
                permission.active
                  ? "accessStatus--active"
                  : "accessStatus--inactive"
              }`}
            >
              {permission.active ? "Active" : "Inactive"}
            </span>
          </div>

          <dl className="accessFacts">
            <div className="accessFact">
              <dt className="accessFactLabel">Resource</dt>
              <dd className="accessFactValue">{permission.resource}</dd>
            </div>
            <div className="accessFact">
              <dt className="accessFactLabel">Action</dt>
              <dd className="accessFactValue">{permission.action}</dd>
            </div>
          </dl>

          <div className="accessDetailSection">
            <h2 className="accessSectionTitle">Assigned to roles</h2>
            <p className="accessSectionDescription">
              {assignedRoles.length} role{assignedRoles.length === 1 ? "" : "s"}{" "}
              currently grant this permission.
            </p>
            <div className="accessAssignedRoles">
              {assignedRoles.map((role) => (
                <span key={role.id} className="accessRolePill">
                  {role.name}
                </span>
              ))}
            </div>
            <p className="accessUpdatedAt accessUpdatedAt--spaced">
              Last updated {permission.updatedAt}
            </p>
          </div>

          <div className="accessDetailActions">
            <Link
              href={`/permissions/${permission.id}/edit`}
              className="accessPrimaryLink accessPrimaryLink--compact"
            >
              Edit permission
            </Link>
            <DeleteButton itemName={permission.name} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
