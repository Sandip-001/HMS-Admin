// app/admin/pharmacy/sales-insights/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Boxes, TrendingDown, TrendingUp } from "lucide-react";
import { SalesStatCard } from "./_components/sales-stat-card";
import { SalesPeriodFilter } from "./_components/sales-period-filter";
import { RankingListCard } from "./_components/ranking-list-card";
import { RankingBarChart } from "./_components/ranking-bar-chart";
import { RankedMedicinesTable } from "./_components/ranked-medicines-table";
import {
  LAST_6_MONTH_OPTIONS,
  MEDICINE_SALES_RECORDS,
} from "@/lib/pharmacy/medicine-sales-insights-data";
import {
  getSelectedMonths,
  rankMedicinesBySelectedMonths,
} from "@/lib/pharmacy/medicine-sales-insights-helpers";

export default function MedicineSalesInsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6");

  const selectedMonths = useMemo(
    () => getSelectedMonths(LAST_6_MONTH_OPTIONS, selectedPeriod),
    [selectedPeriod]
  );

  const rankedMedicines = useMemo(
    () => rankMedicinesBySelectedMonths(MEDICINE_SALES_RECORDS, selectedMonths),
    [selectedMonths]
  );

  const top10Medicines = useMemo(
    () => [...rankedMedicines].sort((a, b) => b.totalUnitsSold - a.totalUnitsSold).slice(0, 10),
    [rankedMedicines]
  );

  const least10Medicines = useMemo(
    () => [...rankedMedicines].sort((a, b) => a.totalUnitsSold - b.totalUnitsSold).slice(0, 10),
    [rankedMedicines]
  );

  const totalUnits = rankedMedicines.reduce((sum, item) => sum + item.totalUnitsSold, 0);
  const bestSeller = top10Medicines[0]?.medicineName ?? "-";
  const slowMover = least10Medicines[0]?.medicineName ?? "-";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Medicine Sales Rankings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track highest and least selling medicines with rolling period filtering.
            </p>
          </div>

          <SalesPeriodFilter value={selectedPeriod} onChange={setSelectedPeriod} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SalesStatCard icon={Boxes} label="Total Units Sold" value={totalUnits.toLocaleString()} tint="blue" />
          <SalesStatCard icon={TrendingUp} label="Top Seller" value={bestSeller} tint="emerald" />
          <SalesStatCard icon={TrendingDown} label="Least Seller" value={slowMover} tint="rose" />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <RankingListCard title="Top 10 Highest Selling Medicines" items={top10Medicines} type="top" />
          <RankingListCard title="Least Selling Medicines" items={least10Medicines} type="least" />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <RankingBarChart data={top10Medicines} color="#10b981" />
          <RankingBarChart data={least10Medicines} color="#f43f5e" />
        </div>

        {/*<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <RankedMedicinesTable title="Top 10 Highest Selling Medicines" items={top10Medicines} />
          <RankedMedicinesTable title="Least Selling Medicines" items={least10Medicines} />
        </div> */}
      </div>
    </div>
  );
}