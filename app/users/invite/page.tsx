import "./invite.css";
import { prisma } from "@/lib/prisma";
import InviteUserForm from "@/app/users/invite/invite-user-form";
import AppShell from "@/app/components/app-shell";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/authorization";

export default async function InviteUserPage() {
  // await requirePermission("users:invite");

  const roles = await prisma.role.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AppShell activeSection="invite">
      <div className="invitePage">
        <Link href="/dashboard" className="invitePageBackLink">
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>

        <section className="invitePageCard">
          <div className="invitePageHeader">
            <p className="invitePageEyebrow">Team access</p>
            <h1 className="invitePageTitle">Invite a user</h1>
            <p className="invitePageDescription">
              Send an invitation and assign the roles this person needs before
              they join your workspace.
            </p>
          </div>

          <div className="invitePageFormContainer">
            <InviteUserForm roles={roles} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
