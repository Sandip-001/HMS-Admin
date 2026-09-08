// app/(main)/revenue-leakage/dashboard/_components/leakage-charts.tsx
"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  DailyLeakageTrendPoint,
  DepartmentLeakageSummary,
} from "@/types/revenue-leakage/revenue-leakage-types";

type ChartValue = number | string;

interface ChartTooltipEntry {
  name?: string;
  value?: ChartValue;
  color?: string;
  dataKey?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: ChartValue;
}

function formatChartValue(value: ChartValue | undefined): string {
  if (value === undefined || value === null) {
    return "-";
  }

  if (typeof value === "number") {
    return value > 999
      ? `₹${value.toLocaleString("en-IN")}`
      : value.toLocaleString("en-IN");
  }

  return value;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-xl backdrop-blur">
      {label !== undefined && label !== null ? (
        <p className="mb-1 text-xs font-semibold text-slate-600">
          {String(label)}
        </p>
      ) : null}

      {payload.map((entry: ChartTooltipEntry, index: number) => (
        <p
          key={`${entry.dataKey ?? entry.name ?? "value"}-${index}`}
          className="text-xs font-medium"
          style={{ color: entry.color ?? "#475569" }}
        >
          {entry.name ?? "Value"}: {formatChartValue(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function LeakageTrendChart({
  data,
}: {
  data: DailyLeakageTrendPoint[];
}) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800">
          Revenue Leakage Trend (Stacked)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="discountLeakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="pendingLeakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="expiredLeakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="otherLeakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => `₹${value / 1000}k`}
            />

            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            <Area
              type="monotone"
              dataKey="pendingLeakage"
              name="Pending Amount"
              stackId="1"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#pendingLeakGradient)"
            />
            <Area
              type="monotone"
              dataKey="discountLeakage"
              name="Discounts"
              stackId="1"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#discountLeakGradient)"
            />
            <Area
              type="monotone"
              dataKey="expiredMedicineLeakage"
              name="Expired Medicines"
              stackId="1"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#expiredLeakGradient)"
            />
            <Area
              type="monotone"
              dataKey="otherLeakage"
              name="Other Issues"
              stackId="1"
              stroke="#64748b"
              strokeWidth={2}
              fill="url(#otherLeakGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DepartmentLeakageChart({
  data,
}: {
  data: DepartmentLeakageSummary[];
}) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800">
          Department-wise Leakage Breakdown
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />

            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => `₹${value / 1000}k`}
            />

            <YAxis
              type="category"
              dataKey="department"
              tick={{ fontSize: 10, fill: "#334155" }}
              axisLine={false}
              tickLine={false}
              width={110}
            />

            <Tooltip content={<ChartTooltip />} />

            <Bar dataKey="totalLeakage" name="Total Leakage" radius={[0, 6, 6, 0]}>
              {data.map((entry: DepartmentLeakageSummary) => (
                <Cell key={entry.department} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LeakageCategoryPieChart({
  discountTotal,
  expiredTotal,
  pendingTotal,
  otherTotal,
}: {
  discountTotal: number;
  expiredTotal: number;
  pendingTotal: number;
  otherTotal: number;
}) {
  const data = [
    { name: "Discounts", value: discountTotal, color: "#f59e0b" },
    { name: "Expired Medicines", value: expiredTotal, color: "#8b5cf6" },
    { name: "Pending Bills", value: pendingTotal, color: "#ef4444" },
    { name: "Other Issues", value: otherTotal, color: "#64748b" },
  ].filter((d) => d.value > 0);

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800">
          Leakage Category Distribution
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              cornerRadius={6}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}