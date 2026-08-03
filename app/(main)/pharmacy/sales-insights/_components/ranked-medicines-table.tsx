
"use client";

import type { RankedMedicineItem } from "@/types/pharmacy/medicine-sales-insights-types";

export function RankedMedicinesTable({
  title,
  items,
}: {
  title: string;
  items: RankedMedicineItem[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-400">Detailed list for the selected period</p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-3 py-3 font-medium">Medicine</th>
              <th className="px-3 py-3 font-medium">Generic</th>
              <th className="px-3 py-3 font-medium">Brand</th>
              <th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 font-medium text-right">Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-3 py-3 font-medium text-slate-800">{item.medicineName}</td>
                <td className="px-3 py-3 text-slate-600">{item.genericName}</td>
                <td className="px-3 py-3 text-slate-600">{item.brand}</td>
                <td className="px-3 py-3 text-slate-600">{item.category}</td>
                <td className="px-3 py-3 text-right font-semibold text-slate-800">{item.totalUnitsSold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.medicineName}</p>
                <p className="text-xs text-slate-400">{item.genericName}</p>
              </div>
              <p className="text-sm font-bold text-slate-800">{item.totalUnitsSold}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs text-slate-500">
              <div>Brand: {item.brand}</div>
              <div>Category: {item.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}