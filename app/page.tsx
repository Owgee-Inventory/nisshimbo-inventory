'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'Manager' | 'Warehouse' | 'Finance' | 'IT Admin';
type Area = 'Foundations' | 'Operations' | 'Inventory' | 'Finance' | 'Administration';

type Mockup = {
  id: string;
  title: string;
  file: string;
  area: Area;
  roles: Role[];
  fr: string;
  description: string;
};

const allRoles: Role[] = ['Manager', 'Warehouse', 'Finance', 'IT Admin'];
const roleOptions = ['All roles', ...allRoles] as const;
const areaOptions = ['All areas', 'Foundations', 'Operations', 'Inventory', 'Finance', 'Administration'] as const;

const mockups: Mockup[] = [
  { id: '00', title: 'Sign in', file: '00-login.png', area: 'Foundations', roles: allRoles, fr: 'FR-10', description: 'Role-aware entry point with trusted-device and session cues.' },
  { id: '01', title: 'Manager dashboard', file: '01-dashboard-manager.png', area: 'Operations', roles: ['Manager'], fr: 'FR-1', description: 'Full operational overview with KPIs, charts, alerts, and quick actions.' },
  { id: '02', title: 'Finance dashboard', file: '02-dashboard-finance.png', area: 'Finance', roles: ['Finance'], fr: 'FR-1 / FR-8', description: 'Accounts receivable, aging buckets, and invoice health.' },
  { id: '03', title: 'Warehouse dashboard', file: '03-dashboard-warehouse.png', area: 'Operations', roles: ['Warehouse'], fr: 'FR-1 / FR-3', description: 'Fulfillment queue, audit tasks, and scan-first workflow.' },
  { id: '04', title: 'Orders list', file: '04-orders-list.png', area: 'Operations', roles: ['Manager', 'Warehouse'], fr: 'FR-2', description: 'Searchable order table with status filters, export, and clear ownership.' },
  { id: '05', title: 'Create order', file: '05-order-create.png', area: 'Operations', roles: ['Manager', 'Warehouse'], fr: 'FR-2', description: 'Customer lookup, live inventory picker, line items, and totals.' },
  { id: '06', title: 'Order detail + delete', file: '06-order-detail-delete.png', area: 'Operations', roles: ['Manager'], fr: 'FR-2', description: 'Order detail with immutable history and destructive-action confirmation.' },
  { id: '07', title: 'Online fulfillment', file: '07-fulfillment-online.png', area: 'Operations', roles: ['Warehouse'], fr: 'FR-3', description: 'Barcode or manual fulfillment with partial quantities and audit handoff.' },
  { id: '08', title: 'Offline fulfillment', file: '08-fulfillment-offline.png', area: 'Operations', roles: ['Warehouse'], fr: 'FR-3 / FR-11', description: 'Offline queue, sync state, and conflict resolution before submission.' },
  { id: '09', title: 'Audit queue', file: '09-audit-queue.png', area: 'Operations', roles: ['Manager', 'Warehouse'], fr: 'FR-4', description: 'Two-panel audit review with per-line decisions and bulk approval.' },
  { id: '10', title: 'Inventory list', file: '10-inventory-list.png', area: 'Inventory', roles: ['Manager', 'Warehouse'], fr: 'FR-5', description: 'Virtualized inventory table with stock, bins, status, and filters.' },
  { id: '11', title: 'Add inventory item', file: '11-inventory-add.png', area: 'Inventory', roles: ['Manager', 'Warehouse'], fr: 'FR-5', description: 'Inventory creation with SKU, warehouse, bin, reorder, and barcode data.' },
  { id: '12', title: 'Edit inventory item', file: '12-inventory-edit.png', area: 'Inventory', roles: ['Manager', 'Warehouse'], fr: 'FR-5', description: 'Immutable SKU and read-only quantity treatment for safe edits.' },
  { id: '13', title: 'Categories', file: '13-categories.png', area: 'Inventory', roles: ['Manager', 'Warehouse'], fr: 'FR-5', description: 'Category maintenance with counts, hierarchy cues, and actions.' },
  { id: '14', title: 'Transfers + bin moves', file: '14-transfers-bin-moves.png', area: 'Inventory', roles: ['Manager', 'Warehouse'], fr: 'FR-5', description: 'Warehouse transfer and bin-move workspace with traceable movement history.' },
  { id: '15', title: 'Barcode labels', file: '15-barcode-labels.png', area: 'Inventory', roles: ['Manager', 'Warehouse'], fr: 'FR-5', description: 'Code 128 label preview, selection, and print-ready output.' },
  { id: '16', title: 'Cycle count', file: '16-cycle-count.png', area: 'Inventory', roles: ['Manager', 'Warehouse'], fr: 'FR-5 / FR-11', description: 'Count session with freeze state, variance review, and finalization.' },
  { id: '17', title: 'Returns', file: '17-returns.png', area: 'Operations', roles: ['Manager', 'Warehouse'], fr: 'FR-6', description: 'Full or partial returns with reason capture and append-only history.' },
  { id: '18', title: 'Customers', file: '18-customers.png', area: 'Operations', roles: ['Manager', 'Finance'], fr: 'FR-7', description: 'Customer directory with pricing tier, credit, and account status.' },
  { id: '19', title: 'Customer profile', file: '19-customer-profile.png', area: 'Operations', roles: ['Manager', 'Finance'], fr: 'FR-7', description: 'Customer pricing precedence, credit limits, and order history.' },
  { id: '20', title: 'AR dashboard', file: '20-ar-dashboard.png', area: 'Finance', roles: ['Manager', 'Finance'], fr: 'FR-8', description: 'Aging summary and collection focus for approved invoice balances.' },
  { id: '21', title: 'Invoices', file: '21-invoices.png', area: 'Finance', roles: ['Manager', 'Finance'], fr: 'FR-8', description: 'Invoice table sourced from audit-approved fulfillment records.' },
  { id: '22', title: 'Invoice payment', file: '22-invoice-payment.png', area: 'Finance', roles: ['Finance'], fr: 'FR-8', description: 'Append-only payment capture with remaining balance visibility.' },
  { id: '23', title: 'Operations analytics', file: '23-analytics-operations.png', area: 'Operations', roles: ['Manager'], fr: 'FR-9', description: 'Manager analytics for orders, fulfillment, returns, and inventory.' },
  { id: '24', title: 'Finance analytics', file: '24-analytics-finance.png', area: 'Finance', roles: ['Manager', 'Finance'], fr: 'FR-9', description: 'Finance analytics for revenue, collections, aging, and payment trends.' },
  { id: '25', title: 'Roles + permissions', file: '25-roles-permissions.png', area: 'Administration', roles: ['IT Admin'], fr: 'FR-10', description: 'Four-role permissions matrix covering page and action access.' },
  { id: '26', title: 'Device enrollment', file: '26-device-enrollment.png', area: 'Administration', roles: ['IT Admin'], fr: 'FR-10', description: 'Trusted-device enrollment and revocation for warehouse stations.' },
  { id: '27', title: 'Audit log', file: '27-audit-log.png', area: 'Administration', roles: ['IT Admin', 'Manager'], fr: 'FR-10', description: 'Immutable event trail with actor, action, entity, and timestamp.' },
  { id: '28', title: 'Data export', file: '28-data-export.png', area: 'Administration', roles: ['Manager', 'IT Admin'], fr: 'FR-12', description: 'Export scopes, filters, format choices, and background job status.' },
  { id: '29', title: 'Bulk import', file: '29-bulk-import.png', area: 'Administration', roles: ['Manager', 'IT Admin'], fr: 'FR-12', description: 'CSV import flow with validation preview and row-level errors.' },
  { id: '30', title: 'Access denied', file: '30-access-denied.png', area: 'Foundations', roles: allRoles, fr: 'FR-10', description: 'Safe fallback state when a role lacks the requested permission.' },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    layers: <><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4" /><path d="m4 17 8 4 8-4" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    filter: <><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></>,
    external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    sparkle: <><path d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3Z" /><path d="m19 16 .5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5L19 16Z" /></>,
  };
  return <svg aria-hidden="true" {...common}>{paths[name] ?? paths.grid}</svg>;
}

function Brand() {
  return <div className="brand"><Image src="/mockups/nisshimbo-mark.png" alt="" width={34} height={34} priority /><span>Nisshimbo <b>Inventory</b></span></div>;
}

function Sidebar({ onFilter }: { onFilter: (area?: Area) => void }) {
  const items = [
    { label: 'Overview', icon: 'grid', area: undefined },
    { label: 'Operations', icon: 'layers', area: 'Operations' as Area },
    { label: 'Inventory', icon: 'layers', area: 'Inventory' as Area },
    { label: 'Finance', icon: 'layers', area: 'Finance' as Area },
    { label: 'Administration', icon: 'layers', area: 'Administration' as Area },
  ];
  return <aside className="sidebar"><Brand /><div className="side-label">Workspace</div><nav>{items.map((item, index) => <button className={`nav-item ${index === 0 ? 'active' : ''}`} key={item.label} onClick={() => onFilter(item.area)}><Icon name={item.icon} size={17} /><span>{item.label}</span>{index === 0 && <span className="nav-dot" />}</button>)}</nav><div className="sidebar-foot"><div className="mini-avatar">NB</div><div><strong>Design review</strong><span>PRD v2.0 coverage</span></div><Icon name="external" size={15} /></div></aside>;
}

function SelectBox({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="select-box"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><span className="select-chevron">⌄</span></label>;
}

function MockupCard({ mockup, onOpen }: { mockup: Mockup; onOpen: () => void }) {
  return <article className="mockup-card"><button className="image-button" onClick={onOpen} aria-label={`Open ${mockup.title}`}><Image src={`/mockups/${mockup.file}`} alt={mockup.title} width={2048} height={1365} sizes="(max-width: 900px) 100vw, 42vw" /></button><div className="card-body"><div className="card-topline"><span className="screen-id">SCREEN {mockup.id}</span><span className="fr-chip">{mockup.fr}</span></div><h3>{mockup.title}</h3><p>{mockup.description}</p><div className="card-bottom"><div className="role-pills">{mockup.roles.slice(0, 3).map((role) => <span key={role}>{role === 'IT Admin' ? 'IT' : role[0]}</span>)}{mockup.roles.length > 3 && <span>+{mockup.roles.length - 3}</span>}</div><button className="open-link" onClick={onOpen}>Inspect <Icon name="arrow" size={14} /></button></div></div></article>;
}

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<(typeof roleOptions)[number]>('All roles');
  const [selectedArea, setSelectedArea] = useState<(typeof areaOptions)[number]>('All areas');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Mockup | null>(null);

  const filtered = useMemo(() => mockups.filter((mockup) => {
    const roleMatch = selectedRole === 'All roles' || mockup.roles.includes(selectedRole);
    const areaMatch = selectedArea === 'All areas' || mockup.area === selectedArea;
    const queryMatch = !query.trim() || `${mockup.title} ${mockup.description} ${mockup.fr}`.toLowerCase().includes(query.trim().toLowerCase());
    return roleMatch && areaMatch && queryMatch;
  }), [query, selectedArea, selectedRole]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const jumpToArea = (area?: Area) => {
    setSelectedArea(area ?? 'All areas');
    document.getElementById('screens')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div className="app-shell"><Sidebar onFilter={jumpToArea} /><main className="main"><header className="topbar"><div className="crumbs"><span>Product design</span><b>/</b><strong>Inventory app</strong></div><div className="top-actions"><span className="version-dot" /> <span>PRD v2.0</span><button className="icon-btn" aria-label="Search"><Icon name="search" size={17} /></button><div className="top-avatar">BA</div></div></header><section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> HIGH-FIDELITY MOCKUPS</div><h1>A clear view of<br /><em>every workflow.</em></h1><p>Thirty-one carefully mapped screens for Nisshimbo Inventory — designed around the PRD, role permissions, and the moments that matter on the warehouse floor.</p><div className="hero-stats"><div><strong>31</strong><span>screens covered</span></div><div><strong>12</strong><span>PRD feature groups</span></div><div><strong>4</strong><span>role experiences</span></div></div></div><div className="hero-preview"><Image src="/mockups/contact-sheet.png" alt="Nisshimbo Inventory mockup contact sheet" width={1250} height={1954} priority /><div className="preview-tag"><span className="preview-pulse" /> Reviewed asset set <Icon name="arrow" size={14} /></div></div></section><section className="toolbar" id="screens"><div><p className="section-kicker">SCREEN LIBRARY</p><h2>Explore the system</h2></div><div className="filters"><label className="search-box"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search screens" /></label><SelectBox label="Role" value={selectedRole} options={roleOptions} onChange={(value) => setSelectedRole(value as (typeof roleOptions)[number])} /><SelectBox label="Area" value={selectedArea} options={areaOptions} onChange={(value) => setSelectedArea(value as (typeof areaOptions)[number])} /></div></section><div className="result-row"><span>{filtered.length} of {mockups.length} screens</span><span className="result-rule" /><button className="filter-reset" onClick={() => { setSelectedRole('All roles'); setSelectedArea('All areas'); setQuery(''); }}><Icon name="filter" size={14} /> Reset filters</button></div><section className="card-grid">{filtered.map((mockup) => <MockupCard key={mockup.id} mockup={mockup} onOpen={() => setOpen(mockup)} />)}</section><section className="coverage-note"><div className="note-icon"><Icon name="sparkle" size={19} /></div><div><p className="section-kicker">DESIGN NOTE</p><h2>Built to stay useful in the real world.</h2><p>Every screen keeps the operational path short: role-aware navigation, scan-friendly controls, explicit status colors, and safe states for offline work, approvals, imports, and permissions.</p></div><div className="coverage-list"><span><i>01</i> Lightweight UI</span><span><i>02</i> Responsive from 1024px</span><span><i>03</i> Print-ready labels</span></div></section><footer><Brand /><span>Prepared for Nisshimbo Inventory · September 2026</span><a href="#screens">Back to library <Icon name="arrow" size={14} /></a></footer></main>{open && <div className="lightbox" role="dialog" aria-modal="true" aria-label={open.title} onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(null); }}><div className="lightbox-panel"><div className="lightbox-head"><div><span className="screen-id">SCREEN {open.id} · {open.fr}</span><h2>{open.title}</h2></div><button className="close-btn" onClick={() => setOpen(null)} aria-label="Close"><Icon name="close" size={19} /></button></div><div className="lightbox-image"><Image src={`/mockups/${open.file}`} alt={open.title} width={2048} height={1365} sizes="90vw" /></div><p>{open.description}</p></div></div>}</div>;
}
