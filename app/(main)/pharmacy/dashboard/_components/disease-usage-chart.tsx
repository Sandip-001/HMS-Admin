// app/admin/pharmacy/dashboard/_components/disease-usage-chart.tsx
"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "./chart-card";
import type { DiseaseUsageSlice } from "@/types/pharmacy/pharmacy-dashboard-types";

export function DiseaseUsageChart({ data }: { data: DiseaseUsageSlice[] }) {
  return (
    <ChartCard title="Disease-wise Medicine Usage" subtitle="Share of medicines dispensed by condition treated">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="disease" cx="50%" cy="48%" outerRadius={95} label={({ value }) => `${value}%`}>
            {data.map((entry) => (
              <Cell key={entry.disease} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}