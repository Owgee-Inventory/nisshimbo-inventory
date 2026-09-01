# Nisshimbo Inventory mockups

Static 2048 x 1365 page mockups based on `Inventory_Management_PRD_v2.0.docx`. The product shell follows the PRD's navy/cobalt visual direction, status-color system, Lucide-style icon language, Recharts-style analytics, and desktop-first 1024 x 768 minimum.

## Coverage

| Files | PRD coverage |
| --- | --- |
| `00-login.png`, `01-dashboard-manager.png`, `02-dashboard-finance.png`, `03-dashboard-warehouse.png`, `30-access-denied.png` | Authenticated entry, role-aware dashboards, insufficient-permissions state (FR-1, FR-10) |
| `04-orders-list.png`, `05-order-create.png`, `06-order-detail-delete.png` | Order list/search/filter, live inventory picker, reservations, export, delete guard (FR-2) |
| `07-fulfillment-online.png`, `08-fulfillment-offline.png`, `09-audit-queue.png` | Barcode/manual fulfillment, offline queue/conflicts, maker-checker approval (FR-3, FR-4) |
| `10-inventory-list.png`, `11-inventory-add.png`, `12-inventory-edit.png`, `13-categories.png` | Inventory CRUD, inactive items, read-only SKU/quantities, categories (FR-5) |
| `14-transfers-bin-moves.png`, `15-barcode-labels.png`, `16-cycle-count.png` | Warehouse transfers, inter-bin moves, Code 128 labels, cycle-count variance/freeze (FR-5) |
| `17-returns.png`, `18-customers.png`, `19-customer-profile.png` | Full/partial returns, customer profiles, custom pricing, credit-limit enforcement (FR-6, FR-7) |
| `20-ar-dashboard.png`, `21-invoices.png`, `22-invoice-payment.png` | AR aging, invoice generation guardrails, price snapshots, append-only payments (FR-8) |
| `23-analytics-operations.png`, `24-analytics-finance.png` | Operational and finance analytics (FR-9) |
| `25-roles-permissions.png`, `26-device-enrollment.png`, `27-audit-log.png` | Role-permission matrix, device enrollment/compliance, immutable audit trail (FR-10) |
| `28-data-export.png`, `29-bulk-import.png` | Role-scoped exports, CSV upload/mapping, partial validation errors (FR-12) |

`FR-11` is represented as UI states inside the fulfillment/import screens because the PRD defines it as a non-functional engineering requirement rather than a standalone user-facing page.
