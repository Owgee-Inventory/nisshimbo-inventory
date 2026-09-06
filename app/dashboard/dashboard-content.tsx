"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardCheck,
  CircleDollarSign,
  PackagePlus,
  PackageSearch,
  RefreshCw,
  RotateCcw,
  ShoppingCart,
  Truck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  managerDashboardDemoData,
  type ManagerDashboardData,
  type MetricTone,
} from "@/app/dashboard/dashboard-data";

const metricToneClasses: Record<MetricTone, { icon: string; value: string }> = {
  blue: {
    icon: "bg-[#eaf2ff] text-[#3e74bd]",
    value: "text-[#245da8]",
  },
  amber: {
    icon: "bg-[#fff5d9] text-[#a87300]",
    value: "text-[#9a6b00]",
  },
  orange: {
    icon: "bg-[#fff0e5] text-[#c2632a]",
    value: "text-[#b95821]",
  },
  green: {
    icon: "bg-[#e9f6ed] text-[#2e7b50]",
    value: "text-[#287047]",
  },
  red: {
    icon: "bg-[#ffeded] text-[#bd4d4d]",
    value: "text-[#b84444]",
  },
};

const statusDotClasses: Record<string, string> = {
  Fulfilled: "bg-[#33885a]",
  "Not yet fulfilled": "bg-[#4c87d9]",
  "Partially fulfilled": "bg-[#d6a72c]",
  "Pending audit": "bg-[#e27b38]",
  Returned: "bg-[#d95959]",
};

const quickActions = [
  {
    label: "Create order",
    href: "/orders/new",
    icon: ShoppingCart,
    className: "bg-[#173b33] text-white hover:bg-[#245247]",
    iconClassName: "bg-white/12 text-[#fffaf1]",
  },
  {
    label: "Add inventory item",
    href: "/inventory/new",
    icon: PackagePlus,
    className: "border border-[#dce6df] bg-white text-[#173b33] hover:border-[#b8cdbf] hover:bg-[#f8fbf8]",
    iconClassName: "bg-[#edf6ef] text-[#2d7950]",
  },
  {
    label: "View pending audits",
    href: "/audits?status=pending",
    icon: ClipboardCheck,
    className: "border border-[#f1d7bb] bg-[#fffaf4] text-[#173b33] hover:border-[#e8b77f] hover:bg-[#fff7eb]",
    iconClassName: "bg-[#fff0dc] text-[#bd6b2b]",
  },
  {
    label: "Process returns",
    href: "/returns",
    icon: RotateCcw,
    className: "border border-[#f0cccc] bg-[#fff8f8] text-[#173b33] hover:border-[#e5a4a4] hover:bg-[#fff2f2]",
    iconClassName: "bg-[#ffeded] text-[#bd4d4d]",
  },
] as const;

function MetricIcon({ icon }: { icon: ManagerDashboardData["metrics"][number]["icon"] }) {
  const iconProps = { "aria-hidden": true, className: "size-5" };

  if (icon === "orders") return <ShoppingCart {...iconProps} />;
  if (icon === "fulfillment") return <Truck {...iconProps} />;
  if (icon === "stock") return <PackageSearch {...iconProps} />;
  if (icon === "audit") return <ClipboardCheck {...iconProps} />;
  if (icon === "value") return <CircleDollarSign {...iconProps} />;
  return <RotateCcw {...iconProps} />;
}

function MetricCard({ metric }: { metric: ManagerDashboardData["metrics"][number] }) {
  const tone = metricToneClasses[metric.tone];

  return (
    <article className="min-w-0 rounded-2xl border border-[#e2e8e4] bg-white p-5 shadow-[0_8px_25px_rgba(23,59,51,0.045)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone.icon}`}>
          <MetricIcon icon={metric.icon} />
        </div>
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#87968e]">{metric.label}</p>
      <p className={`mt-2 text-[2rem] font-semibold tracking-[-0.06em] ${tone.value}`}>{metric.value}</p>
    </article>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-[#e2e8e4] bg-white p-5 shadow-[0_8px_25px_rgba(23,59,51,0.045)] sm:p-6">
      <h2 className="text-base font-semibold tracking-[-0.02em] text-[#173b33]">{title}</h2>
      <div className="mt-4 h-[230px] min-w-0 sm:h-[250px]">{children}</div>
    </section>
  );
}

function OrderStatusChart({ data }: { data: ManagerDashboardData["orderStatus"] }) {
  return (
    <div className="flex h-full min-w-0 flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
      <div className="h-[180px] w-full min-w-0 max-w-[220px] sm:h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3} stroke="none">
              {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#71817b] sm:block sm:w-auto sm:space-y-3">
        {data.map((entry) => (
          <li key={entry.name} className="flex min-w-0 items-center gap-2">
            <span className={`size-2 shrink-0 rounded-full ${statusDotClasses[entry.name]}`} />
            <span className="truncate">{entry.name}</span>
            <span className="ml-auto font-semibold text-[#173b33] sm:ml-2">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardContent() {
  const data = managerDashboardDemoData;
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 500);
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.06em] text-[#173b33] sm:text-5xl">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#71817b]">
            Monitor orders, inventory, and tasks that need your attention.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d5e1d8] bg-white px-4 text-sm font-semibold text-[#276943] shadow-sm transition hover:border-[#9fc0a8] hover:bg-[#f5fbf6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54] sm:w-auto"
        >
          <RefreshCw aria-hidden="true" className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Refreshing" : "Refresh"}</span>
        </button>
      </section>

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">Dashboard overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
        </div>
      </section>

      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="mb-4 text-xl font-semibold tracking-[-0.04em] text-[#173b33]">Warehouse performance</h2>
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          <ChartCard title="Order status distribution">
            <OrderStatusChart data={data.orderStatus} />
          </ChartCard>

          <ChartCard title="Fulfillment trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.fulfillmentTrend} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="#edf1ee" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#87968e", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#87968e", fontSize: 12 }} width={36} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#71817b", paddingTop: 8 }} />
                <Line type="monotone" dataKey="fulfilled" name="Fulfilled" stroke="#33885a" strokeWidth={3} dot={{ r: 3, fill: "#33885a", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="pending" name="Pending" stroke="#d6a72c" strokeWidth={2.5} dot={{ r: 3, fill: "#d6a72c", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top 5 items by quantity">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topItems} layout="vertical" margin={{ top: 2, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="#edf1ee" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#87968e", fontSize: 12 }} />
                <YAxis dataKey="item" type="category" axisLine={false} tickLine={false} tick={{ fill: "#60736b", fontSize: 11 }} width={104} />
                <Tooltip />
                <Bar dataKey="quantity" name="Quantity" fill="#4c87d9" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Inventory by category">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.inventoryByCategory} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#edf1ee" vertical={false} />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: "#60736b", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#87968e", fontSize: 12 }} width={38} />
                <Tooltip />
                <Bar dataKey="quantity" name="Quantity" fill="#2e7b50" radius={[6, 6, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="actions-heading" className="rounded-3xl border border-[#dce7df] bg-[#edf6ef] p-5 sm:p-7">
        <h2 id="actions-heading" className="text-xl font-semibold tracking-[-0.04em] text-[#173b33]">Quick actions</h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.label} href={action.href} className={`group flex min-h-16 items-center gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(23,59,51,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b54] ${action.className}`}>
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${action.iconClassName}`}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold">{action.label}</span>
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 opacity-60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
