"use client";

import "./dashboard.css";

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
    icon: "dashboardMetricIcon--blue",
    value: "dashboardMetricValue--blue",
  },
  amber: {
    icon: "dashboardMetricIcon--amber",
    value: "dashboardMetricValue--amber",
  },
  orange: {
    icon: "dashboardMetricIcon--orange",
    value: "dashboardMetricValue--orange",
  },
  green: {
    icon: "dashboardMetricIcon--green",
    value: "dashboardMetricValue--green",
  },
  red: {
    icon: "dashboardMetricIcon--red",
    value: "dashboardMetricValue--red",
  },
};

const statusDotClasses: Record<string, string> = {
  Fulfilled: "dashboardStatusDot--fulfilled",
  "Not yet fulfilled": "dashboardStatusDot--unfulfilled",
  "Partially fulfilled": "dashboardStatusDot--partial",
  "Pending audit": "dashboardStatusDot--audit",
  Returned: "dashboardStatusDot--returned",
};

const quickActions = [
  {
    label: "Create order",
    href: "/orders/new",
    icon: ShoppingCart,
    className: "dashboardAction--order",
    iconClassName: "dashboardActionIcon--order",
  },
  {
    label: "Add inventory item",
    href: "/inventory/new",
    icon: PackagePlus,
    className: "dashboardAction--inventory",
    iconClassName: "dashboardActionIcon--inventory",
  },
  {
    label: "View pending audits",
    href: "/audits?status=pending",
    icon: ClipboardCheck,
    className: "dashboardAction--audit",
    iconClassName: "dashboardActionIcon--audit",
  },
  {
    label: "Process returns",
    href: "/returns",
    icon: RotateCcw,
    className: "dashboardAction--returns",
    iconClassName: "dashboardActionIcon--returns",
  },
] as const;

function MetricIcon({
  icon,
}: {
  icon: ManagerDashboardData["metrics"][number]["icon"];
}) {
  const iconProps = { "aria-hidden": true, className: "dashboardIcon" };

  if (icon === "orders") return <ShoppingCart {...iconProps} />;
  if (icon === "fulfillment") return <Truck {...iconProps} />;
  if (icon === "stock") return <PackageSearch {...iconProps} />;
  if (icon === "audit") return <ClipboardCheck {...iconProps} />;
  if (icon === "value") return <CircleDollarSign {...iconProps} />;
  return <RotateCcw {...iconProps} />;
}

function MetricCard({
  metric,
}: {
  metric: ManagerDashboardData["metrics"][number];
}) {
  const tone = metricToneClasses[metric.tone];

  return (
    <article className="dashboardMetricCard">
      <div className="dashboardMetricHeader">
        <div className={`dashboardMetricIcon ${tone.icon}`}>
          <MetricIcon icon={metric.icon} />
        </div>
      </div>
      <p className="dashboardMetricLabel">{metric.label}</p>
      <p className={`dashboardMetricValue ${tone.value}`}>{metric.value}</p>
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
    <section className="dashboardChartCard">
      <h2 className="dashboardChartTitle">{title}</h2>
      <div className="dashboardChartCanvas">{children}</div>
    </section>
  );
}

function OrderStatusChart({
  data,
}: {
  data: ManagerDashboardData["orderStatus"];
}) {
  return (
    <div className="dashboardStatusChart">
      <div className="dashboardStatusPie">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="dashboardStatusLegend">
        {data.map((entry) => (
          <li key={entry.name} className="dashboardStatusLegendItem">
            <span
              className={`dashboardStatusDot ${statusDotClasses[entry.name]}`}
            />
            <span className="dashboardStatusName">{entry.name}</span>
            <span className="dashboardStatusCount">{entry.value}</span>
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
    <div className="dashboard">
      <section className="dashboardHeading">
        <div className="dashboardHeadingCopy">
          <h1 className="dashboardTitle">Dashboard</h1>
          <p className="dashboardDescription">
            Monitor orders, inventory, and tasks that need your attention.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="dashboardRefreshButton"
        >
          <RefreshCw
            aria-hidden="true"
            className={`dashboardRefreshIcon ${
              refreshing ? "dashboardRefreshIcon--spinning" : ""
            }`}
          />
          <span>{refreshing ? "Refreshing" : "Refresh"}</span>
        </button>
      </section>

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="dashboardVisuallyHidden">
          Dashboard overview
        </h2>
        <div className="dashboardMetrics">
          {data.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      <section aria-labelledby="charts-heading">
        <h2
          id="charts-heading"
          className="dashboardSectionTitle dashboardSectionTitle--charts"
        >
          Warehouse performance
        </h2>
        <div className="dashboardCharts">
          <ChartCard title="Order status distribution">
            <OrderStatusChart data={data.orderStatus} />
          </ChartCard>

          <ChartCard title="Fulfillment trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.fulfillmentTrend}
                margin={{ top: 8, right: 4, left: -22, bottom: 0 }}
              >
                <CartesianGrid stroke="#edf1ee" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#87968e", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#87968e", fontSize: 12 }}
                  width={36}
                />
                <Tooltip />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: 12,
                    color: "#71817b",
                    paddingTop: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="fulfilled"
                  name="Fulfilled"
                  stroke="#33885a"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#33885a", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  name="Pending"
                  stroke="#d6a72c"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#d6a72c", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top 5 items by quantity">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.topItems}
                layout="vertical"
                margin={{ top: 2, right: 8, left: 4, bottom: 0 }}
              >
                <CartesianGrid stroke="#edf1ee" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#87968e", fontSize: 12 }}
                />
                <YAxis
                  dataKey="item"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#60736b", fontSize: 11 }}
                  width={104}
                />
                <Tooltip />
                <Bar
                  dataKey="quantity"
                  name="Quantity"
                  fill="#4c87d9"
                  radius={[0, 6, 6, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Inventory by category">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.inventoryByCategory}
                margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
              >
                <CartesianGrid stroke="#edf1ee" vertical={false} />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#60736b", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#87968e", fontSize: 12 }}
                  width={38}
                />
                <Tooltip />
                <Bar
                  dataKey="quantity"
                  name="Quantity"
                  fill="#2e7b50"
                  radius={[6, 6, 0, 0]}
                  barSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      <section
        aria-labelledby="actions-heading"
        className="dashboardActionsPanel"
      >
        <h2 id="actions-heading" className="dashboardSectionTitle">
          Quick actions
        </h2>

        <div className="dashboardActionsGrid">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className={`dashboardAction ${action.className}`}
              >
                <span className={`dashboardActionIcon ${action.iconClassName}`}>
                  <Icon aria-hidden="true" className="dashboardIcon" />
                </span>
                <span className="dashboardActionLabel">{action.label}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="dashboardActionArrow"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
