// app/(main)/emergency/dashboard/_components/emergency-medicine-lab-tables.tsx
"use client";

import { useState } from "react";
import { Download, FlaskConical, Minus, Pill, ScanLine, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  EmergencyLabTestData,
  EmergencyMedicineSalesData,
  TrendDirection,
} from "@/types/emergency/emergency-analytics-types";
import { exportLabTestsToExcel, exportMedicineSalesToExcel } from "@/lib/emergency/emergency-excel-export";

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-600" />;
  return <Minus className="h-3.5 w-3.5 text-slate-400" />;
}

function trendBadgeClass(trend: TrendDirection) {
  if (trend === "up") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (trend === "down") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

export function EmergencyMedicineSalesTable({
  medicines,
  onViewAll,
}: {
  medicines: EmergencyMedicineSalesData[];
  onViewAll: () => void;
}) {
  const [showCount, setShowCount] = useState<"top" | "bottom">("top");
  const topSellers = [...medicines].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 6);
  const bottomSellers = [...medicines].sort((a, b) => a.unitsSold - b.unitsSold).slice(0, 6);
  const displayed = showCount === "top" ? topSellers : bottomSellers;

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Pill className="h-5 w-5 text-violet-500" /> Pharmacy — Emergency Medicine Sales
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setShowCount("top")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  showCount === "top" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
                }`}
              >
                Top Selling
              </button>
              <button
                type="button"
                onClick={() => setShowCount("bottom")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  showCount === "bottom" ? "bg-white text-red-700 shadow-sm" : "text-slate-500"
                }`}
              >
                Least Selling
              </button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => exportMedicineSalesToExcel(medicines)}
              className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2.5">
          {displayed.map((med, idx) => {
            const maxUnits = topSellers[0]?.unitsSold ?? 1;
            const widthPct = Math.max(8, (med.unitsSold / maxUnits) * 100);

            return (
              <div key={med.id} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-xs font-bold text-slate-400">{idx + 1}</span>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="truncate text-sm font-semibold text-slate-800">{med.medicineName}</p>
                    <Badge variant="outline" className={`${trendBadgeClass(med.trend)} ml-2 shrink-0 gap-1 text-xs`}>
                      <TrendIcon trend={med.trend} />
                      {med.trendPercentage}%
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          showCount === "top"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : "bg-gradient-to-r from-red-400 to-rose-400"
                        }`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <span className="w-28 shrink-0 text-right text-xs text-slate-500">
                      {med.unitsSold} units · ₹{med.revenue.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-slate-400">{med.category}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          View all medicines →
        </button>
      </CardContent>
    </Card>
  );
}

export function EmergencyLabTestsTable({
  tests,
  onViewAll,
}: {
  tests: EmergencyLabTestData[];
  onViewAll: () => void;
}) {
  const [filterType, setFilterType] = useState<"All" | "Pathology" | "Radiology">("All");
  const filtered = filterType === "All" ? tests : tests.filter((t) => t.labType === filterType);
  const displayed = [...filtered].sort((a, b) => b.totalOrdered - a.totalOrdered).slice(0, 7);

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <FlaskConical className="h-5 w-5 text-cyan-500" /> Lab — Emergency Pathology &amp; Radiology
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {(["All", "Pathology", "Radiology"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    filterType === type ? "bg-white text-rose-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => exportLabTestsToExcel(tests)}
              className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Test Name</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Ordered</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Trend</th>
              </tr>
            </thead>

            <tbody>
              {displayed.map((test) => (
                <tr key={test.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <p className="text-sm font-semibold text-slate-800">{test.testName}</p>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        test.labType === "Pathology"
                          ? "border-violet-200 bg-violet-50 text-violet-700"
                          : "border-sky-200 bg-sky-50 text-sky-700"
                      }`}
                    >
                      {test.labType === "Pathology" ? (
                        <FlaskConical className="mr-1 h-3 w-3" />
                      ) : (
                        <ScanLine className="mr-1 h-3 w-3" />
                      )}
                      {test.labType}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-bold text-slate-700">{test.totalOrdered}</td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-slate-800">
                    ₹{test.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant="outline" className={`${trendBadgeClass(test.trend)} gap-1 text-xs`}>
                      <TrendIcon trend={test.trend} />
                      {test.trendPercentage}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          View all lab tests →
        </button>
      </CardContent>
    </Card>
  );
}