// app/admin/pharmacy/dashboard/_components/revenue-profit-chart.tsx
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./chart-card";
import type { RevenueProfitPoint } from "@/types/pharmacy/pharmacy-dashboard-types";

export function RevenueProfitChart({ data }: { data: RevenueProfitPoint[] }) {
  return (
    <ChartCard
      title="Revenue vs Profit"
      subtitle="Monthly comparison of revenue and net profit"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
        >
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

              return `₹${sales.toLocaleString()}`;
            }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#6366f1"
            radius={[6, 6, 0, 0]}
            barSize={18}
          />
          <Bar
            dataKey="profit"
            name="Profit"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
