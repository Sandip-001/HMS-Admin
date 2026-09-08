// app/(main)/icu/dashboard/_components/icu-stat-cards.tsx
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

export function ClickableStatCard({
  icon,
  label,
  value,
  subtitle,
  changePercentage,
  gradient,
  onClick,
}: ClickableStatCardProps) {
  const isPositive = (changePercentage ?? 0) >= 0;

  return (
    <Card
      onClick={onClick}
      className={`group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.07] transition-opacity group-hover:opacity-[0.14]`}
      />

      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="mt-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold text-transparent">
              {value}
            </p>
            <p className="mt-1 truncate text-xs text-slate-400">{subtitle}</p>
          </div>

          <div
            className={`shrink-0 rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}
          >
            {icon}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {changePercentage !== undefined ? (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(changePercentage)}%
            </span>
          ) : (
            <span />
          )}

          {onClick ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
              <MousePointerClick className="h-3 w-3" /> View details
            </span>
          ) : null}
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${gradient}`}
        />
      </CardContent>
    </Card>
  );
}

interface ClickableMiniStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  changePercentage?: number;
  tone: "blue" | "emerald" | "amber" | "red" | "violet" | "cyan" | "rose" | "indigo" | "slate";
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
  slate: { iconBg: "bg-gradient-to-br from-slate-500 to-slate-600" },
};

export function ClickableMiniStatCard({
  icon,
  label,
  value,
  changePercentage,
  tone,
  onClick,
}: ClickableMiniStatCardProps) {
  const t = TONE_MAP[tone];
  const isPositive = (changePercentage ?? 0) >= 0;

  return (
    <Card
      onClick={onClick}
      className={`border-slate-200 shadow-md transition-all duration-300 hover:shadow-lg ${
        onClick ? "cursor-pointer hover:-translate-y-0.5" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className={`rounded-lg ${t.iconBg} p-2 text-white shadow-md`}>
            {icon}
          </div>

          {changePercentage !== undefined ? (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(changePercentage)}%
            </span>
          ) : null}
        </div>

        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{label}</p>
      </CardContent>
    </Card>
  );
}