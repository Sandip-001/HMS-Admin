// app/admin/pharmacy/dashboard/_components/supplier-purchase-chart.tsx
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./chart-card";
import type { SupplierPurchasePoint } from "@/types/pharmacy/pharmacy-dashboard-types";

export function SupplierPurchaseChart({
  data,
}: {
  data: SupplierPurchasePoint[];
}) {
  return (
    <ChartCard
      title="Supplier Purchase Distribution"
      subtitle="Total purchase value by supplier this quarter"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="supplier"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            angle={-25}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />
          <Tooltip
            formatter={(value) => {
              const amount =
                typeof value === "number" ? value : Number(value ?? 0);

              return `₹${amount.toLocaleString()}`;
            }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}
          />
          <Bar
            dataKey="amount"
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
