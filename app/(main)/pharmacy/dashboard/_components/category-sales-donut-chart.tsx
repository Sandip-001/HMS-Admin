// app/admin/pharmacy/dashboard/_components/category-sales-donut-chart.tsx
"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "./chart-card";
import type { CategorySalesSlice } from "@/types/pharmacy/pharmacy-dashboard-types";

export function CategorySalesDonutChart({ data }: { data: CategorySalesSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartCard title="Sales by Medicine Category" subtitle="Revenue contribution by category">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="category" cx="50%" cy="48%" innerRadius={62} outerRadius={92} paddingAngle={2}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()} (${((v / total) * 100).toFixed(1)}%)`, ""]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}