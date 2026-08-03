// app/admin/pharmacy/dashboard/_components/stock-status-donut-chart.tsx
"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "./chart-card";
import type { StockStatusSlice } from "@/types/pharmacy/pharmacy-dashboard-types";

export function StockStatusDonutChart({ data }: { data: StockStatusSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ChartCard title="Stock Status" subtitle="Inventory availability overview">
      <div className="relative">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="48%" innerRadius={64} outerRadius={92} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-2xl font-bold text-slate-800">{total}</p>
          <p className="text-xs text-slate-400">Total SKUs</p>
        </div>
      </div>
    </ChartCard>
  );
}