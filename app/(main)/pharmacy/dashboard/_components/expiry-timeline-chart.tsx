// app/admin/pharmacy/dashboard/_components/expiry-timeline-chart.tsx
"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "./chart-card";
import type { ExpiryTimelinePoint } from "@/types/pharmacy/pharmacy-dashboard-types";

const COLORS = ["#ef4444", "#f59e0b", "#facc15"];

export function ExpiryTimelineChart({ data }: { data: ExpiryTimelinePoint[] }) {
  return (
    <ChartCard title="Expiry Timeline" subtitle="Medicines expiring soon, grouped by risk window">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip formatter={(v: number) => [`${v} items`, "Expiring"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}