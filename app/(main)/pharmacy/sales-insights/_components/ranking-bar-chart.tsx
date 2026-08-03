"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RankedMedicineItem } from "@/types/pharmacy/medicine-sales-insights-types";

export function RankingBarChart({
  data,
  color,
}: {
  data: RankedMedicineItem[];
  color: string;
}) {
  const chartData = [...data].reverse().map((item) => ({
    name: item.medicineName,
    units: item.totalUnitsSold,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-800">
          Sales Visualization
        </p>
        <p className="text-xs text-slate-400">
          Horizontal bars work well for long medicine names
        </p>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 30, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 11, fill: "#334155" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => {
              if (typeof value !== "number") {
                return [String(value), "Sold"];
              }

              return [`${value} units`, "Sold"];
            }}
          />
          <Bar dataKey="units" radius={[0, 8, 8, 0]} barSize={16}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
