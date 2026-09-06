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
            <div className="mx-auto w-full max-w-2xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#60736b] transition hover:text-[#173b33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
                >
                    <span aria-hidden="true">←</span>
                    Back to dashboard
                </Link>

                <section className="mt-6 rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-[0_8px_25px_rgba(23,59,51,0.045)] sm:p-9">
                    <div className="border-b border-[#e2e8e4] pb-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d45f4c]">
                            Team access
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                            Invite a user
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#71817b] sm:text-base">
                            Send an invitation and assign the roles this person needs before they join your workspace.
                        </p>
                    </div>

                    <div className="pt-7">
                        <InviteUserForm roles={roles} />
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
