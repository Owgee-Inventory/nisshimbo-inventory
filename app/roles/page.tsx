import Link from "next/link";

import AppShell from "@/app/components/app-shell";
import DeleteButton from "@/app/components/delete-button";
import {
  getRolePermissions,
  permissionRecords,
  roleRecords,
} from "@/app/data/rbac";
import { listRoles } from "@/lib/role-actions";

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`accessStatus ${
        active ? "accessStatus--active" : "accessStatus--inactive"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default async function RolesPage() {
  const roles = await listRoles();

  const activeRoleCount = roles.filter((role) => role.active).length;

  return (
    <AppShell activeSection="roles">
      <div className="accessPage">
        <div className="accessPageHeader">
          <div>
            <p className="accessEyebrow">Access control</p>
            <h1 className="accessPageTitle">Roles</h1>
            <p className="accessPageDescription">
              Group permissions into reusable access profiles for your team.
            </p>
          </div>

          <Link href="/roles/new" className="accessPrimaryLink">
            New role
          </Link>
        </div>

        <div className="accessMetrics">
          <div className="accessMetric">
            <p className="accessMetricLabel">Total roles</p>
            <p className="accessMetricValue">{roles.length}</p>
          </div>
          <div className="accessMetric">
            <p className="accessMetricLabel">Active roles</p>
            <p className="accessMetricValue">{activeRoleCount}</p>
          </div>
        </div>

        <section className="accessListPanel">
          <div className="accessListHeader">
            <h2 className="accessSectionTitle">All roles</h2>
            <p className="accessSectionDescription">
              Review access profiles and their assigned permissions.
            </p>
          </div>

          <div className="accessTableScroll">
            <table className="accessTable">
              <thead className="accessTableHead">
                <tr>
                  <th className="accessTableHeading">Role</th>
                  <th className="accessTableHeading">Permissions</th>
                  <th className="accessTableHeading">Status</th>
                  <th className="accessTableHeading accessTableHeading--actions">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="accessTableBody">
                {roles.map((role) => (
                  <tr key={role.id} className="accessTableRow">
                    <td className="accessTableCell">
                      <Link
                        href={`/roles/${role.id}`}
                        className="accessRecordLink"
                      >
                        <span className="accessRecordName">{role.name}</span>
                        <span className="accessRecordDescription">
                          {role.description}
                        </span>
                      </Link>
                    </td>
                    <td className="accessTableCell accessTableCell--muted">
                      {role._count.rolePermissions} assigned
                    </td>
                    <td className="accessTableCell">
                      <StatusPill active={role.active} />
                    </td>
                    <td className="accessTableCell">
                      <div className="accessRowActions">
                        <Link
                          href={`/roles/${role.id}`}
                          className="accessViewLink"
                        >
                          View
                        </Link>
                        <Link
                          href={`/roles/${role.id}/edit`}
                          className="accessEditLink"
                        >
                          Edit
                        </Link>
                        <DeleteButton itemName={role.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
