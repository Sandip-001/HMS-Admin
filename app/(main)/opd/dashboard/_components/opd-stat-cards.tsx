// app/(main)/opd/dashboard/_components/opd-stat-cards.tsx
"use client";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GradientStatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle: string;
  changePercentage?: number;
  gradient: string;
}

export function GradientStatCard({ icon, label, value, subtitle, changePercentage, gradient }: GradientStatCardProps) {
  const isPositive = (changePercentage ?? 0) >= 0;

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`} />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">{label}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-2">{value}</p>
            <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shrink-0`}>
            {icon}
          </div>
        </div>
        {changePercentage !== undefined && (
          <div className="mt-3 flex items-center gap-1">
            <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(changePercentage)}%
            </span>
            <span className="text-xs text-slate-400">vs previous period</span>
          </div>
        )}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      </CardContent>
    </Card>
  );
}

interface MiniStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  changePercentage?: number;
  tone: "blue" | "emerald" | "amber" | "red" | "violet" | "cyan" | "rose" | "indigo";
}

const TONE_MAP: Record<MiniStatCardProps["tone"], { bg: string; text: string; iconBg: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", iconBg: "bg-gradient-to-br from-amber-500 to-orange-500" },
  red: { bg: "bg-red-50", text: "text-red-700", iconBg: "bg-gradient-to-br from-red-500 to-rose-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", iconBg: "bg-gradient-to-br from-violet-500 to-purple-500" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", iconBg: "bg-gradient-to-br from-cyan-500 to-sky-500" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", iconBg: "bg-gradient-to-br from-rose-500 to-pink-500" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", iconBg: "bg-gradient-to-br from-indigo-500 to-blue-500" },
};

export function MiniStatCard({ icon, label, value, changePercentage, tone }: MiniStatCardProps) {
  const t = TONE_MAP[tone];
  const isPositive = (changePercentage ?? 0) >= 0;

  return (
    <Card className="border-slate-200 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${t.iconBg} text-white shadow-md`}>
            {icon}
          </div>
          {changePercentage !== undefined && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
              isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(changePercentage)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}