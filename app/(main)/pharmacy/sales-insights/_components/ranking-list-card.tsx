
"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { RankedMedicineItem } from "@/types/pharmacy/medicine-sales-insights-types";

export function RankingListCard({
  title,
  items,
  type,
}: {
  title: string;
  items: RankedMedicineItem[];
  type: "top" | "least";
}) {
  const Icon = type === "top" ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          type === "top" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-400">Based on selected rolling month range</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                type === "top" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}>
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.medicineName}</p>
                <p className="text-xs text-slate-400">
                  {item.genericName} · {item.brand} · {item.category}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{item.totalUnitsSold}</p>
              <p className="text-xs text-slate-400">units sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}