import type { ReactNode } from "react";
import Link from "next/link";

import SignOutButton from "@/app/dashboard/sign-out-button";

type ActiveSection = "dashboard" | "roles" | "permissions";

type Props = {
    children: ReactNode;
    activeSection?: ActiveSection;
};

const navigation = [
    { label: "Dashboard", href: "/dashboard", key: "dashboard" as const },
    { label: "Roles", href: "/roles", key: "roles" as const },
    { label: "Permissions", href: "/permissions", key: "permissions" as const },
];

function BrandMark() {
    return (
        <span
            aria-hidden="true"
            className="grid size-10 shrink-0 grid-cols-2 gap-1 rounded-xl bg-[#ef6b54] p-2 shadow-[0_8px_20px_rgba(239,107,84,0.22)]"
        >
            <span className="rounded-[3px] bg-[#fffaf1]" />
            <span className="rounded-[3px] bg-[#fffaf1]/65" />
            <span className="rounded-[3px] bg-[#fffaf1]/65" />
            <span className="rounded-[3px] bg-[#fffaf1]" />
        </span>
    );
}

function BrandLockup({ dark = false }: { dark?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <BrandMark />
            <div>
                <p className={`text-[1.05rem] font-semibold tracking-[-0.02em] ${dark ? "text-[#fffaf1]" : "text-[#173b33]"}`}>
                    Nisshimbo
                </p>
                <p className={`text-[0.7rem] uppercase tracking-[0.22em] ${dark ? "text-[#b8cec3]" : "text-[#71817b]"}`}>
                    Inventory
                </p>
            </div>
        </div>
    );
}

function NavigationIcon({ item }: { item: ActiveSection }) {
    if (item === "dashboard") {
        return <path d="M4 13.5 10 8l6 5.5M5.5 12.5V17h3v-3h3v3h3v-4.5" />;
    }

    if (item === "roles") {
        return <path d="M10 3.5 16 6v4.5c0 3.5-2.3 5.8-6 7-3.7-1.2-6-3.5-6-7V6l6-2.5ZM7.5 9.5h5M7.5 12h5" />;
    }

    return <path d="M4 5.5h12M4 10h12M4 14.5h8M6 5.5v9" />;
}

function Navigation({ mobile = false, activeSection }: { mobile?: boolean; activeSection?: ActiveSection }) {
    return (
        <nav className={mobile ? "flex gap-2 overflow-x-auto pb-1" : "space-y-2"} aria-label="Main navigation">
            {navigation.map((item) => {
                const active = item.key === activeSection;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={mobile
                            ? `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${active ? "bg-[#173b33] text-[#fffaf1]" : "text-[#71817b] hover:bg-[#eef1ec] hover:text-[#23443c]"}`
                            : `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-[#fffaf1] text-[#173b33] shadow-sm" : "text-[#c6d8d0] hover:bg-[#285247] hover:text-[#fffaf1]"}`}
                    >
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0">
                            <NavigationIcon item={item.key} />
                        </svg>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default function AppShell({ children, activeSection }: Props) {
    const activeLabel = navigation.find((item) => item.key === activeSection)?.label ?? "Workspace";

    return (
        <div className="min-h-dvh bg-[#f4f6fa] text-[#173b33] lg:flex">
            <aside className="hidden w-64 shrink-0 flex-col border-r border-[#dfe5ec] bg-white px-5 py-7 lg:flex">
                <BrandLockup />

                <div className="mt-12">
                    <p className="mb-4 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#91a0ad]">
                        Workspace
                    </p>
                    <Navigation activeSection={activeSection} />
                </div>

                <div className="mt-8">
                    <p className="mb-4 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#91a0ad]">
                        Administration
                    </p>
                    <p className="px-4 text-xs leading-5 text-[#91a0ad]">
                        Roles and permissions shape what each person can see and do.
                    </p>
                </div>

                <div className="mt-auto border-t border-[#e2e7ed] pt-5">
                    <div className="mb-4 rounded-xl bg-[#f4f7fb] p-3">
                        <div className="flex items-center gap-3">
                            <span className="grid size-9 place-items-center rounded-full bg-[#173b33] text-xs font-semibold text-white">BA</span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#23443c]">Bryan Arboleda</p>
                                <p className="mt-0.5 text-xs text-[#71817b]">Manager · Online</p>
                            </div>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
                <header className="border-b border-[#dfe5ec] bg-white px-5 py-4 lg:hidden">
                    <BrandLockup />
                    <div className="mt-4">
                        <Navigation mobile activeSection={activeSection} />
                    </div>
                </header>

                <header className="hidden h-[72px] items-center justify-between border-b border-[#dfe5ec] bg-white px-8 lg:flex">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-[#91a0ad]">Inventory app</span>
                        <span className="text-[#c4cdd5]">/</span>
                        <span className="font-semibold text-[#23443c]">{activeLabel}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" className="inline-flex h-10 w-56 items-center justify-between rounded-lg border border-[#dfe5ec] bg-[#f8fafc] px-3 text-sm text-[#91a0ad] transition hover:border-[#b8c5d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]">
                            <span className="flex items-center gap-2"><span aria-hidden="true">⌕</span> Search anything</span>
                            <span className="text-xs text-[#aab6c0]">⌘ K</span>
                        </button>
                        <button type="button" aria-label="Notifications" className="grid size-10 place-items-center rounded-lg border border-[#dfe5ec] bg-white text-[#71817b] transition hover:border-[#b8c5d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]">♧</button>
                        <span className="grid size-9 place-items-center rounded-full bg-[#173b33] text-xs font-semibold text-white">BA</span>
                    </div>
                </header>

                <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">{children}</main>

                <footer className="border-t border-[#dfe5ec] bg-white px-5 py-4 lg:hidden">
                    <SignOutButton />
                </footer>
            </div>
        </div>
    );
}
