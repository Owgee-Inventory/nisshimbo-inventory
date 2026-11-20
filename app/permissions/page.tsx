import Link from "next/link";

import AppShell from "@/app/components/app-shell";
import DeleteButton from "@/app/components/delete-button";
import { permissionRecords, roleRecords } from "@/app/data/rbac";

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

function roleCount(permissionId: string) {
  return roleRecords.filter((role) => role.permissionIds.includes(permissionId))
    .length;
}

export default function PermissionsPage() {
  return (
    <AppShell activeSection="permissions">
      <div className="accessPage">
        <div className="accessPageHeader">
          <div>
            <p className="accessEyebrow">Access control</p>
            <h1 className="accessPageTitle">Permissions</h1>
            <p className="accessPageDescription">
              Define the small, explicit actions that roles can grant to users.
            </p>
          </div>

          <Link href="/permissions/new" className="accessPrimaryLink">
            New permission
          </Link>
        </div>

        <div className="accessMetrics">
          <div className="accessMetric">
            <p className="accessMetricLabel">Total permissions</p>
            <p className="accessMetricValue">{permissionRecords.length}</p>
          </div>
          <div className="accessMetric">
            <p className="accessMetricLabel">Active permissions</p>
            <p className="accessMetricValue">
              {
                permissionRecords.filter((permission) => permission.active)
                  .length
              }
            </p>
          </div>
          <div className="accessMetric">
            <p className="accessMetricLabel">Roles using them</p>
            <p className="accessMetricValue">{roleRecords.length}</p>
          </div>
        </div>

        <section className="accessListPanel">
          <div className="accessListHeader">
            <h2 className="accessSectionTitle">All permissions</h2>
            <p className="accessSectionDescription">
              Keep permission keys stable because application checks depend on
              them.
            </p>
          </div>

          <div className="accessTableScroll">
            <table className="accessTable accessTable--permissions">
              <thead className="accessTableHead">
                <tr>
                  <th className="accessTableHeading">Permission</th>
                  <th className="accessTableHeading">Resource / action</th>
                  <th className="accessTableHeading">Used by</th>
                  <th className="accessTableHeading">Status</th>
                  <th className="accessTableHeading accessTableHeading--actions">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="accessTableBody">
                {permissionRecords.map((permission) => (
                  <tr key={permission.id} className="accessTableRow">
                    <td className="accessTableCell">
                      <Link
                        href={`/permissions/${permission.id}`}
                        className="accessRecordLink"
                      >
                        <span className="accessRecordName">
                          {permission.name}
                        </span>
                        <span className="accessRecordKey">
                          {permission.key}
                        </span>
                      </Link>
                    </td>
                    <td className="accessTableCell accessTableCell--muted">
                      {permission.resource} / {permission.action}
                    </td>
                    <td className="accessTableCell accessTableCell--muted">
                      {roleCount(permission.id)} role
                      {roleCount(permission.id) === 1 ? "" : "s"}
                    </td>
                    <td className="accessTableCell">
                      <StatusPill active={permission.active} />
                    </td>
                    <td className="accessTableCell">
                      <div className="accessRowActions">
                        <Link
                          href={`/permissions/${permission.id}`}
                          className="accessViewLink"
                        >
                          View
                        </Link>
                        <Link
                          href={`/permissions/${permission.id}/edit`}
                          className="accessEditLink"
                        >
                          Edit
                        </Link>
                        <DeleteButton itemName={permission.name} />
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
