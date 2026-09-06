import { prisma } from "@/lib/prisma";
import InviteUserForm from "@/app/users/invite/invite-user-form";
import AppShell from "@/app/components/app-shell";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/authorization";

export default async function InviteUserPage() {
    await requirePermission("users:invite");

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
        <AppShell>
            <div className="mx-auto w-full max-w-2xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#71817b] transition hover:text-[#d95642] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
                >
                    <span aria-hidden="true">←</span>
                    Back to dashboard
                </Link>

                <section className="mt-6 rounded-2xl bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(23,59,51,0.07)] sm:p-9">
                    <div className="border-b border-[#e5e9e5] pb-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">
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
