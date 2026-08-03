"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./chart-card";
import type { MonthlySalesPoint } from "@/types/pharmacy/pharmacy-dashboard-types";

export function MonthlySalesTrendChart({
  data,
}: {
  data: MonthlySalesPoint[];
}) {
  return (
    <ChartCard
      title="Monthly Sales Trend"
      subtitle="Pharmacy sales revenue over the last 7 months"
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />
          <Tooltip
            formatter={(value) => {
              const sales =
                typeof value === "number" ? value : Number(value ?? 0);

              return [`₹${sales.toLocaleString()}`, "Sales"];
            }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#salesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
