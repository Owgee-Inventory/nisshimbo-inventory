import AppShell from "@/app/components/app-shell";
import DashboardContent from "@/app/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <AppShell activeSection="dashboard">
      <DashboardContent />
    </AppShell>
  );
}
