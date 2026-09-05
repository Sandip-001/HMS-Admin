// app/(main)/opd/dashboard/_components/opd-charts.tsx
"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type LegendProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  DailyTrendPoint,
  DepartmentWiseRevenue,
  HourlyTrend,
  PaymentModeBreakdown,
} from "@/types/opd/opd-analytics-types";

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

interface PaymentLegendEntry {
  payload?: PaymentModeBreakdown;
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

function PaymentLegendFormatter(
  value: string,
  entry: PaymentLegendEntry,
): string {
  const percentage = entry.payload?.percentage;

  return percentage !== undefined ? `${value} (${percentage}%)` : value;
}

export function RevenueTrendChart({ data }: { data: DailyTrendPoint[] }) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800">
          Revenue &amp; Consultation Trend
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

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

            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ConsultationTrendChart({ data }: { data: DailyTrendPoint[] }) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800">
          New vs Follow-Up Consultations
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

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
            />

            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            <Bar
              dataKey="newPatients"
              name="New"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="followUps"
              name="Follow-Up"
              fill="#06b6d4"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function HourlyFootfallChart({ data }: { data: HourlyTrend[] }) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800">
          Today&apos;s Hourly Footfall
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<ChartTooltip />} />

            <Line
              type="monotone"
              dataKey="consultations"
              name="Consultations"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f59e0b" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DepartmentRevenueChart({
  data,
}: {
  data: DepartmentWiseRevenue[];
}) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800">
          Department-wise Revenue
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              horizontal={false}
            />

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
              tick={{ fontSize: 11, fill: "#334155" }}
              axisLine={false}
              tickLine={false}
              width={110}
            />

            <Tooltip content={<ChartTooltip />} />

            <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]}>
              {data.map((entry: DepartmentWiseRevenue) => (
                <Cell key={entry.department} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PaymentModeChart({ data }: { data: PaymentModeBreakdown[] }) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800">
          Payment Mode Breakdown
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="method"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              cornerRadius={6}
            >
              {data.map((entry: PaymentModeBreakdown) => (
                <Cell key={entry.method} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip content={<ChartTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={PaymentLegendFormatter as LegendProps["formatter"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
