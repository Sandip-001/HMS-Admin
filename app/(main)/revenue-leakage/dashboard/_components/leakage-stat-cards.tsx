// app/(main)/revenue-leakage/dashboard/_components/leakage-stat-cards.tsx
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
  invertTrendColor?: boolean;
}

export function ClickableStatCard({
  icon,
  label,
  value,
  subtitle,
  changePercentage,
  gradient,
  onClick,
  invertTrendColor = true,
}: ClickableStatCardProps) {
  const isPositive = (changePercentage ?? 0) >= 0;
  // For leakage metrics, a POSITIVE change (more leakage) is BAD, so colors invert by default.
  const isGood = invertTrendColor ? !isPositive : isPositive;

  return (
    <Card
      onClick={onClick}
      className={`group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.08] transition-opacity group-hover:opacity-[0.16]`}
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
                isGood
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