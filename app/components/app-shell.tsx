"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import SignOutButton from "@/app/dashboard/sign-out-button";
import "./app-shell.css";

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
  {
    label: "Permissions",
    href: "/permissions",
    key: "permissions" as const,
    disabled: false,
  },
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
      className="appShellBrandMark"
    />
  );
}

function BrandLockup({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`appShellBrand ${dark ? "appShellBrand--dark" : ""}`}>
      <BrandMark />
      <div>
        <p className="appShellBrandName">Nisshimbo</p>
        <p className="appShellBrandSubtitle">Inventory</p>
      </div>
    </div>
  );
}

function NavigationIcon({ item }: { item: ActiveSection }) {
  if (item === "dashboard") {
    return <path d="M4 13.5 10 8l6 5.5M5.5 12.5V17h3v-3h3v3h3v-4.5" />;
  }

  if (item === "invite") {
    return (
      <path d="M12.5 14.5c2.2 0 4 1.2 4 2.5M9 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM14.5 5v4M12.5 7h4" />
    );
  }

  if (item === "users") {
    return (
      <path d="M8.5 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 16.5c.4-2 2.1-3.2 5-3.2s4.6 1.2 5 3.2M14 6.3a2.2 2.2 0 0 1 0 4.2M15.2 13.5c1.2.3 1.9 1.2 2.2 2.5" />
    );
  }

  if (item === "roles") {
    return (
      <path d="M10 3.5 16 6v4.5c0 3.5-2.3 5.8-6 7-3.7-1.2-6-3.5-6-7V6l6-2.5ZM7.5 9.5h5M7.5 12h5" />
    );
  }

  return <path d="M4 5.5h12M4 10h12M4 14.5h8M6 5.5v9" />;
}

function NavigationIconWrap({ item }: { item: NavigationItem }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      className="appShellNavIcon"
    >
      <NavigationIcon item={item.key} />
    </svg>
  );
}

function NavigationLink({
  item,
  mobile,
  activeSection,
}: {
  item: NavigationItem;
  mobile: boolean;
  activeSection?: ActiveSection;
}) {
  const active = item.key === activeSection;
  const className = mobile
    ? `appShellNavLink appShellNavLink--mobile ${active ? "is-active" : ""}`
    : `appShellNavLink ${active ? "is-active" : ""}`;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={className}
    >
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
      className={
        mobile
          ? "appShellNavPlaceholder appShellNavPlaceholder--mobile"
          : "appShellNavPlaceholder"
      }
    >
      <NavigationIconWrap item={accessNavigation[0]} />
      <span>Users</span>
    </span>
  );
}

function Navigation({
  mobile = false,
  activeSection,
}: {
  mobile?: boolean;
  activeSection?: ActiveSection;
}) {
  const summaryClass = mobile
    ? "appShellNavSummary appShellNavSummary--mobile"
    : "appShellNavSummary";

  return (
    <nav className="appShellNavigation" aria-label="Main navigation">
      <div className="appShellNavGroup">
        {primaryNavigation.map((item) => (
          <NavigationLink
            key={item.href}
            item={item}
            mobile={mobile}
            activeSection={activeSection}
          />
        ))}
      </div>

      <details open className="appShellAccessMenu">
        <summary className={summaryClass}>
          <span>Access control</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            className="appShellAccessChevron"
          >
            <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
          </svg>
        </summary>
        <div className="appShellAccessLinks">
          {accessNavigation.map((item) =>
            item.disabled ? (
              <PlaceholderNavigationItem key={item.key} mobile={mobile} />
            ) : (
              <NavigationLink
                key={item.href}
                item={item}
                mobile={mobile}
                activeSection={activeSection}
              />
            )
          )}
        </div>
      </details>
    </nav>
  );
}

export default function AppShell({ children, activeSection }: Props) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const activeLabel =
    navigation.find((item) => item.key === activeSection)?.label ?? "Workspace";
  const sidebarClassName = sidebarVisible
    ? "appShellSidebar"
    : "appShellSidebar appShellSidebar--collapsed";

  return (
    <div className="appShell">
      <aside
        id="app-sidebar"
        aria-hidden={!sidebarVisible}
        inert={!sidebarVisible || undefined}
        className={sidebarClassName}
      >
        <div className="appShellSidebarBrand">
          <BrandLockup />
        </div>

        <div className="appShellSidebarNavigation">
          <p className="appShellWorkspaceLabel">Workspace</p>
          <Navigation activeSection={activeSection} />
        </div>

        <div className="appShellSidebarAccount">
          <div className="appShellUserCard">
            <div className="appShellUserIdentity">
              <span className="appShellAvatar appShellAvatar--bold">BA</span>
              <div className="appShellUserDetails">
                <p className="appShellUserName">Bryan Arboleda</p>
                <p className="appShellUserStatus">Manager · Online</p>
              </div>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div className="appShellWorkspace">
        <header className="appShellMobileHeader">
          <BrandLockup />
          <div className="appShellMobileNavigation">
            <Navigation mobile activeSection={activeSection} />
          </div>
        </header>

        <header className="appShellDesktopHeader">
          <div className="appShellHeaderGroup">
            <button
              type="button"
              aria-controls="app-sidebar"
              aria-expanded={sidebarVisible}
              aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
              onClick={() => setSidebarVisible((visible) => !visible)}
              className="appShellHeaderButton appShellHeaderButton--sidebar"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                className="appShellHeaderIcon"
              >
                {sidebarVisible ? (
                  <path d="M3.5 5h13M3.5 10h8M3.5 15h13M14 8l2 2-2 2" />
                ) : (
                  <path d="M3.5 5h13M3.5 10h13M3.5 15h13M6 8l-2 2 2 2" />
                )}
              </svg>
            </button>
            <div className="appShellBreadcrumb">
              <span className="appShellBreadcrumbRoot">Inventory app</span>
              <span className="appShellBreadcrumbSeparator">/</span>
              <span className="appShellBreadcrumbCurrent">{activeLabel}</span>
            </div>
          </div>
          <div className="appShellHeaderGroup">
            <span className="appShellHeaderHint">
              Your workspace at a glance
            </span>
            <button
              type="button"
              aria-label="Notifications"
              className="appShellHeaderButton"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                className="appShellHeaderIcon"
              >
                <path d="M5.5 8.7a4.5 4.5 0 0 1 9 0c0 4 1.5 4.3 1.5 5.3h-12c0-1 1.5-1.3 1.5-5.3ZM8.3 16h3.4" />
              </svg>
            </button>
            <span className="appShellAvatar">BA</span>
          </div>
        </header>

        <main className="appShellMain">{children}</main>

        <footer className="appShellMobileFooter">
          <SignOutButton />
        </footer>
      </div>
    </div>
  );
}
