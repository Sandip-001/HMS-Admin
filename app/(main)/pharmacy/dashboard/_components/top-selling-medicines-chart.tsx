// app/admin/pharmacy/dashboard/_components/top-selling-medicines-chart.tsx
"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "./chart-card";
import type { MedicineSalesItem } from "@/types/pharmacy/pharmacy-dashboard-types";

export function TopSellingMedicinesChart({ data }: { data: MedicineSalesItem[] }) {
  const sorted = [...data].sort((a, b) => a.unitsSold - b.unitsSold);

  return (
    <ChartCard title="Top 10 Selling Medicines" subtitle="Units sold this month">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="medicineName" width={140} tick={{ fontSize: 11, fill: "#334155" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
          <Bar dataKey="unitsSold" radius={[0, 6, 6, 0]} barSize={14}>
            {sorted.map((_, i) => (
              <Cell key={i} fill="#3b82f6" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}