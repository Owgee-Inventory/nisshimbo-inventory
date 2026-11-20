import type { ReactNode } from "react";
import "@/app/components/access-management.css";

export default function PermissionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
