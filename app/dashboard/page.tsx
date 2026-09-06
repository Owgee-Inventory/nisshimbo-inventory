import Link from "next/link";

import AppShell from "@/app/components/app-shell";

export default function DashboardPage() {
  return (
    <AppShell activeSection="dashboard">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef6b54]">Nisshimbo Inventory</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">Dashboard</h1>
          <p className="mt-3 max-w-xl text-[#71817b]">
            Keep your inventory workspace organized and control access from one place.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/roles" className="group rounded-2xl bg-[#fffdf8] p-6 shadow-[0_10px_30px_rgba(23,59,51,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(23,59,51,0.09)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ef6b54]">Access profiles</p>
            <h2 className="mt-4 text-xl font-semibold group-hover:text-[#d95642]">Manage roles</h2>
            <p className="mt-2 text-sm leading-6 text-[#71817b]">Organize permissions into reusable roles for your team.</p>
            <span className="mt-6 block text-sm font-semibold text-[#23443c]">View roles →</span>
          </Link>

          <Link href="/permissions" className="group rounded-2xl bg-[#fffdf8] p-6 shadow-[0_10px_30px_rgba(23,59,51,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(23,59,51,0.09)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ef6b54]">Fine-grained access</p>
            <h2 className="mt-4 text-xl font-semibold group-hover:text-[#d95642]">Manage permissions</h2>
            <p className="mt-2 text-sm leading-6 text-[#71817b]">Define the exact actions that roles can grant.</p>
            <span className="mt-6 block text-sm font-semibold text-[#23443c]">View permissions →</span>
          </Link>

          <Link href="/users/invite" className="group rounded-2xl bg-[#173b33] p-6 text-[#fffaf1] shadow-[0_10px_30px_rgba(23,59,51,0.12)] transition hover:-translate-y-0.5 hover:bg-[#234b40]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ef9a85]">Team access</p>
            <h2 className="mt-4 text-xl font-semibold">Invite a user</h2>
            <p className="mt-2 text-sm leading-6 text-[#c6d8d0]">Invite teammates and assign one or more roles.</p>
            <span className="mt-6 block text-sm font-semibold text-[#fffaf1]">Open invitations →</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
