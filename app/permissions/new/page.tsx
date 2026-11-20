import Link from "next/link";

import AppShell from "@/app/components/app-shell";
import PermissionForm from "@/app/permissions/permission-form";

export default function NewPermissionPage() {
  return (
    <AppShell activeSection="permissions">
      <div className="accessPage accessPage--form">
        <Link href="/permissions" className="accessBackLink">
          ← Back to permissions
        </Link>
        <div className="accessDetailCard">
          <p className="accessEyebrow">Permissions</p>
          <h1 className="accessCardTitle">Create a permission</h1>
          <p className="accessCardDescription">
            Create one explicit action that can later be assigned to roles.
          </p>
          <div className="accessFormRegion">
            <PermissionForm mode="new" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
