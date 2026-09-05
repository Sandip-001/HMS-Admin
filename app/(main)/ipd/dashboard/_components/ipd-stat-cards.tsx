//app/(main)/ipd/dashboard/_components/ipd-stat-cards.tsx

"use client";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, MousePointerClick } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ClickableStatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle: string;
  changePercentage?: number;
  gradient: string;
  onClick?: () => void;
}

export function ClickableStatCard({ icon, label, value, subtitle, changePercentage, gradient, onClick }: ClickableStatCardProps) {
  const isPositive = (changePercentage ?? 0) >= 0;

  return (
    <Card
      onClick={onClick}
      className={`relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.07] group-hover:opacity-[0.14] transition-opacity`} />
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
        <div className="mt-3 flex items-center justify-between">
          {changePercentage !== undefined ? (
            <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(changePercentage)}%
            </span>
          ) : <span />}
          {onClick && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <MousePointerClick className="h-3 w-3" /> View details
            </span>
          )}
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      </CardContent>
    </Card>
  );
}

interface ClickableMiniStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  changePercentage?: number;
  tone: "blue" | "emerald" | "amber" | "red" | "violet" | "cyan" | "rose" | "indigo";
  onClick?: () => void;
}

const TONE_MAP: Record<ClickableMiniStatCardProps["tone"], { iconBg: string }> = {
  blue: { iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  emerald: { iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  amber: { iconBg: "bg-gradient-to-br from-amber-500 to-orange-500" },
  red: { iconBg: "bg-gradient-to-br from-red-500 to-rose-500" },
  violet: { iconBg: "bg-gradient-to-br from-violet-500 to-purple-500" },
  cyan: { iconBg: "bg-gradient-to-br from-cyan-500 to-sky-500" },
  rose: { iconBg: "bg-gradient-to-br from-rose-500 to-pink-500" },
  indigo: { iconBg: "bg-gradient-to-br from-indigo-500 to-blue-500" },
};

export function ClickableMiniStatCard({ icon, label, value, changePercentage, tone, onClick }: ClickableMiniStatCardProps) {
  const t = TONE_MAP[tone];
  const isPositive = (changePercentage ?? 0) >= 0;

  return (
    <Card
      onClick={onClick}
      className={`border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 ${onClick ? "cursor-pointer hover:-translate-y-0.5" : ""}`}
    >
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