import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/app/components/app-shell";
import DeleteButton from "@/app/components/delete-button";
import { getRole } from "@/lib/role-actions";
import { isValidUuid } from "@/lib/validate-uuid";

export default async function RoleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const validUuid = await isValidUuid(id);

  if (!validUuid) {
    throw new Error("Invalid Uuid");
  }

  const role = await getRole(id);

  if (!role) notFound();

  // const permissions = getRolePermissions(role);
  const permissions = role.rolePermissions;

  return (
    <AppShell activeSection="roles">
      <div className="accessPage accessPage--detail">
        <Link href="/roles" className="accessBackLink">
          ← Back to roles
        </Link>
        <section className="accessDetailCard">
          <div className="accessDetailHeader">
            <div>
              <p className="accessEyebrow">Role details</p>
              <h1 className="accessCardTitle">{role.name}</h1>
              <p className="accessDetailDescription">{role.description}</p>
            </div>
            <span
              className={`accessStatus accessStatus--detail ${
                role.active ? "accessStatus--active" : "accessStatus--inactive"
              }`}
            >
              {role.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="accessDetailSection">
            <div className="accessSectionHeader">
              <div>
                <h2 className="accessSectionTitle">Assigned permissions</h2>
                <p className="accessSectionDescription">
                  {permissions.length} permission
                  {permissions.length === 1 ? "" : "s"} currently assigned.
                </p>
              </div>
              {/*<p className="accessUpdatedAt">Last updated {Date(role.updatedAt)}</p>*/}
              <p className="accessUpdatedAt">
                Last updated{" "}
                {new Date(role.updatedAt).toLocaleString("en-PH", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: "Asia/Manila",
                })}
              </p>
            </div>

            <div className="accessAssignedPermissions">
              {permissions.map(({ permission }) => (
                <div key={permission.id} className="accessPermissionCard">
                  <p className="accessPermissionName">{permission.name}</p>
                  <p className="accessPermissionCardKey">{permission.key}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="accessDetailActions">
            <Link
              href={`/roles/${role.id}/edit`}
              className="accessPrimaryLink accessPrimaryLink--compact"
            >
              Edit role
            </Link>
            <DeleteButton itemName={role.name} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
