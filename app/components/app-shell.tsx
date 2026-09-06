"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import SignOutButton from "@/app/dashboard/sign-out-button";

type ActiveSection = "dashboard" | "users" | "roles" | "permissions" | "invite";

type Props = {
    children: ReactNode;
    activeSection?: ActiveSection;
};

const primaryNavigation = [
    { label: "Dashboard", href: "/dashboard", key: "dashboard" as const },
    { label: "Invite user", href: "/users/invite", key: "invite" as const },
];

const accessNavigation = [
    { label: "Users", href: "#", key: "users" as const, disabled: true },
    { label: "Roles", href: "/roles", key: "roles" as const, disabled: false },
    { label: "Permissions", href: "/permissions", key: "permissions" as const, disabled: false },
];

const navigation = [...primaryNavigation, ...accessNavigation];
type NavigationItem = (typeof navigation)[number];

function BrandMark() {
    return (
        <Image
            src="/nisshimbo-logo.png"
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className="size-10 shrink-0 object-contain"
        />
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

    if (item === "invite") {
        return <path d="M12.5 14.5c2.2 0 4 1.2 4 2.5M9 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM14.5 5v4M12.5 7h4" />;
    }

    if (item === "users") {
        return <path d="M8.5 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 16.5c.4-2 2.1-3.2 5-3.2s4.6 1.2 5 3.2M14 6.3a2.2 2.2 0 0 1 0 4.2M15.2 13.5c1.2.3 1.9 1.2 2.2 2.5" />;
    }

    if (item === "roles") {
        return <path d="M10 3.5 16 6v4.5c0 3.5-2.3 5.8-6 7-3.7-1.2-6-3.5-6-7V6l6-2.5ZM7.5 9.5h5M7.5 12h5" />;
    }

    return <path d="M4 5.5h12M4 10h12M4 14.5h8M6 5.5v9" />;
}

function NavigationIconWrap({ item }: { item: NavigationItem }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="size-[1.125rem] shrink-0">
            <NavigationIcon item={item.key} />
        </svg>
    );
}

function NavigationLink({ item, mobile, activeSection }: { item: NavigationItem; mobile: boolean; activeSection?: ActiveSection }) {
    const active = item.key === activeSection;
    const className = mobile
        ? `flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-[#173b33] text-[#fffaf1] shadow-sm" : "text-[#60736b] hover:bg-[#eef1ec] hover:text-[#173b33]"}`
        : `flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${active ? "bg-[#173b33] text-[#fffaf1] shadow-[0_8px_20px_rgba(23,59,51,0.14)]" : "text-[#4f655d] hover:bg-[#eef1ec] hover:text-[#173b33]"}`;

    return (
        <Link href={item.href} aria-current={active ? "page" : undefined} className={className}>
            <NavigationIconWrap item={item} />
            <span>{item.label}</span>
        </Link>
    );
}

function PlaceholderNavigationItem({ mobile }: { mobile: boolean }) {
    return (
        <span
            aria-disabled="true"
            title="User management is not available yet"
            className={mobile
                ? "flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#a1aea8]"
                : "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-[#9aa9a3]"}
        >
            <NavigationIconWrap item={accessNavigation[0]} />
            <span>Users</span>
        </span>
    );
}

function Navigation({ mobile = false, activeSection }: { mobile?: boolean; activeSection?: ActiveSection }) {
    const summaryClass = mobile
        ? "flex w-full cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#91a0ad] transition hover:bg-[#eef1ec] hover:text-[#173b33] [&::-webkit-details-marker]:hidden"
        : "flex w-full cursor-pointer list-none items-center justify-between rounded-xl px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#71817b] transition hover:bg-[#eef1ec] hover:text-[#173b33] [&::-webkit-details-marker]:hidden";

    return (
        <nav className="space-y-2" aria-label="Main navigation">
            <div className="space-y-1">
                {primaryNavigation.map((item) => (
                    <NavigationLink key={item.href} item={item} mobile={mobile} activeSection={activeSection} />
                ))}
            </div>

            <details open className="group pt-4">
                <summary className={summaryClass}>
                    <span>Access control</span>
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" className="size-4 transition-transform group-open:rotate-180">
                        <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
                    </svg>
                </summary>
                <div className="mt-2 space-y-1 border-l border-current/20 pl-2">
                    {accessNavigation.map((item) => item.disabled
                        ? <PlaceholderNavigationItem key={item.key} mobile={mobile} />
                        : <NavigationLink key={item.href} item={item} mobile={mobile} activeSection={activeSection} />)}
                </div>
            </details>
        </nav>
    );
}

export default function AppShell({ children, activeSection }: Props) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const activeLabel = navigation.find((item) => item.key === activeSection)?.label ?? "Workspace";
    const sidebarClassName = sidebarVisible
        ? "hidden w-[17rem] shrink-0 flex-col border-r border-[#dfe5ec] bg-white px-4 py-6 text-[#173b33] transition-[width,opacity,padding] duration-200 motion-reduce:transition-none lg:flex"
        : "hidden w-0 shrink-0 flex-col overflow-hidden border-r-0 bg-white px-0 py-6 text-[#173b33] opacity-0 transition-[width,opacity,padding] duration-200 pointer-events-none motion-reduce:transition-none lg:flex";

    return (
        <div className="min-h-dvh bg-[#f4f6fa] text-[#173b33] lg:flex">
            <aside id="app-sidebar" aria-hidden={!sidebarVisible} inert={!sidebarVisible || undefined} className={sidebarClassName}>
                <div className="px-2">
                    <BrandLockup />
                </div>

                <div className="mt-12 flex-1">
                    <p className="mb-4 px-3.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#91b1a4]">Workspace</p>
                    <Navigation activeSection={activeSection} />
                </div>

                <div className="mt-10 border-t border-[#e2e7ed] pt-5">
                    <div className="mb-4 rounded-2xl border border-[#e2e7ed] bg-[#f4f7fb] p-3.5">
                        <div className="flex items-center gap-3">
                            <span className="grid size-9 place-items-center rounded-full bg-[#173b33] text-xs font-bold text-white">BA</span>
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
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-controls="app-sidebar"
                            aria-expanded={sidebarVisible}
                            aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
                            onClick={() => setSidebarVisible((visible) => !visible)}
                            className="grid size-10 place-items-center rounded-xl border border-[#dfe5ec] bg-white text-[#71817b] transition hover:border-[#b8c5d0] hover:bg-[#f8fafc] hover:text-[#173b33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]"
                        >
                            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" className="size-[1.125rem]">
                                {sidebarVisible ? <path d="M3.5 5h13M3.5 10h8M3.5 15h13M14 8l2 2-2 2" /> : <path d="M3.5 5h13M3.5 10h13M3.5 15h13M6 8l-2 2 2 2" />}
                            </svg>
                        </button>
                        <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-[#91a0ad]">Inventory app</span>
                        <span className="text-[#c4cdd5]">/</span>
                        <span className="font-semibold text-[#23443c]">{activeLabel}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="mr-2 hidden text-sm text-[#71817b] xl:inline">Your workspace at a glance</span>
                        <button type="button" aria-label="Notifications" className="grid size-10 place-items-center rounded-xl border border-[#dfe5ec] bg-white text-[#71817b] transition hover:border-[#b8c5d0] hover:bg-[#f8fafc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54]">
                            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" className="size-[1.125rem]">
                                <path d="M5.5 8.7a4.5 4.5 0 0 1 9 0c0 4 1.5 4.3 1.5 5.3h-12c0-1 1.5-1.3 1.5-5.3ZM8.3 16h3.4" />
                            </svg>
                        </button>
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
