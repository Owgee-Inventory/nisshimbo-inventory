import AppShell from "@/app/components/app-shell";
import { requirePermission } from "@/lib/auth/authorization";
import InventoryContent from "./InventoryPage";
import "./inventory.css";

export default async function InventoryPage() {
  const demoMode =
    process.env.NODE_ENV === "development" &&
    process.env.INVENTORY_DEMO_MODE === "true";

  if (demoMode) {
    return (
      <main className="nisshimbo-inventory">
        <p>Development demo — sample inventory</p>
        <InventoryContent />
      </main>
    );
  }

  const { requirePermission } = await import("@/lib/auth/authorization");

  await requirePermission("inventory:view");

  return (
    <AppShell>
      <div className="nisshimbo-inventory">
        <InventoryContent />
      </div>
    </AppShell>
  );
}
