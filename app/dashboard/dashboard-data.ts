export type MetricTone = "blue" | "amber" | "orange" | "green" | "red";

export type ManagerDashboardData = {
  metrics: Array<{
    label: string;
    value: string;
    tone: MetricTone;
    icon: "orders" | "fulfillment" | "stock" | "audit" | "value" | "returns";
  }>;
  orderStatus: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  fulfillmentTrend: Array<{
    day: string;
    fulfilled: number;
    pending: number;
  }>;
  topItems: Array<{
    item: string;
    quantity: number;
  }>;
  inventoryByCategory: Array<{
    category: string;
    quantity: number;
  }>;
};

// Demo-only values until the operational inventory models and dashboard API exist.
export const managerDashboardDemoData: ManagerDashboardData = {
  metrics: [
    {
      label: "Total orders",
      value: "248",
      tone: "blue",
      icon: "orders",
    },
    {
      label: "Pending fulfillment",
      value: "32",
      tone: "amber",
      icon: "fulfillment",
    },
    {
      label: "Low stock alerts",
      value: "9",
      tone: "orange",
      icon: "stock",
    },
    {
      label: "Pending audits",
      value: "14",
      tone: "orange",
      icon: "audit",
    },
    {
      label: "Total inventory value",
      value: "$184.6k",
      tone: "green",
      icon: "value",
    },
    {
      label: "Returns in progress",
      value: "7",
      tone: "red",
      icon: "returns",
    },
  ],
  orderStatus: [
    { name: "Fulfilled", value: 126, color: "#33885a" },
    { name: "Not yet fulfilled", value: 61, color: "#4c87d9" },
    { name: "Partially fulfilled", value: 32, color: "#d6a72c" },
    { name: "Pending audit", value: 21, color: "#e27b38" },
    { name: "Returned", value: 8, color: "#d95959" },
  ],
  fulfillmentTrend: [
    { day: "Mon", fulfilled: 18, pending: 7 },
    { day: "Tue", fulfilled: 24, pending: 9 },
    { day: "Wed", fulfilled: 21, pending: 6 },
    { day: "Thu", fulfilled: 28, pending: 11 },
    { day: "Fri", fulfilled: 31, pending: 8 },
    { day: "Sat", fulfilled: 16, pending: 5 },
    { day: "Sun", fulfilled: 22, pending: 7 },
  ],
  topItems: [
    { item: "A4 Copy Paper", quantity: 486 },
    { item: "Black Ballpoint Pen", quantity: 392 },
    { item: "Shipping Box - M", quantity: 318 },
    { item: "Thermal Label Roll", quantity: 264 },
    { item: "Packing Tape", quantity: 219 },
  ],
  inventoryByCategory: [
    { category: "Office", quantity: 812 },
    { category: "Packaging", quantity: 624 },
    { category: "Cleaning", quantity: 406 },
    { category: "Safety", quantity: 288 },
    { category: "Hardware", quantity: 194 },
  ],
};
