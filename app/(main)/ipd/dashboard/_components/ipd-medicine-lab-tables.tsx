//app/(main)/ipd/dashboard/_components/ipd-medicine-lab-tables.tsx

"use client";
import { useState } from "react";
import { Download, FlaskConical, Minus, Pill, ScanLine, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IpdLabTestData, IpdMedicineSalesData, TrendDirection } from "@/types/ipd/ipd-analytics-types";
import { exportLabTestsToExcel, exportMedicineSalesToExcel } from "@/lib/ipd/ipd-excel-export";

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

export function IPDMedicineSalesTable({
  medicines, onViewAll,
}: { medicines: IpdMedicineSalesData[]; onViewAll: () => void }) {
  const [showCount, setShowCount] = useState<"top" | "bottom">("top");
  const topSellers = [...medicines].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 6);
  const bottomSellers = [...medicines].sort((a, b) => a.unitsSold - b.unitsSold).slice(0, 6);
  const displayed = showCount === "top" ? topSellers : bottomSellers;

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Pill className="h-5 w-5 text-violet-500" /> Pharmacy — IPD Medicine Sales
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setShowCount("top")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${showCount === "top" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}
              >
                Top Selling
              </button>
              <button
                type="button"
                onClick={() => setShowCount("bottom")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${showCount === "bottom" ? "bg-white text-red-700 shadow-sm" : "text-slate-500"}`}
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
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
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
                <span className="text-xs font-bold text-slate-400 w-5 shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{med.medicineName}</p>
                    <Badge variant="outline" className={`${trendBadgeClass(med.trend)} text-xs gap-1 shrink-0 ml-2`}>
                      <TrendIcon trend={med.trend} />{med.trendPercentage}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${showCount === "top" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-red-400 to-rose-400"}`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 shrink-0 w-28 text-right">{med.unitsSold} units · ₹{med.revenue.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{med.category}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          View all medicines →
        </button>
      </CardContent>
    </Card>
  );
}

export function IPDLabTestsTable({
  tests, onViewAll,
}: { tests: IpdLabTestData[]; onViewAll: () => void }) {
  const [filterType, setFilterType] = useState<"All" | "Pathology" | "Radiology">("All");
  const filtered = filterType === "All" ? tests : tests.filter((t) => t.labType === filterType);
  const displayed = [...filtered].sort((a, b) => b.totalOrdered - a.totalOrdered).slice(0, 7);

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-cyan-500" /> Lab — IPD Pathology &amp; Radiology
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {(["All", "Pathology", "Radiology"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    filterType === type ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"
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
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Test Name</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ordered</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Revenue</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Trend</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((test) => (
                <tr key={test.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="text-sm font-semibold text-slate-800">{test.testName}</p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant="outline" className={`text-xs ${test.labType === "Pathology" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                      {test.labType === "Pathology" ? <FlaskConical className="h-3 w-3 mr-1" /> : <ScanLine className="h-3 w-3 mr-1" />}
                      {test.labType}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-bold text-slate-700">{test.totalOrdered}</td>
                  <td className="py-3 px-3 text-right text-sm font-bold text-slate-800">₹{test.revenue.toLocaleString()}</td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant="outline" className={`${trendBadgeClass(test.trend)} text-xs gap-1`}>
                      <TrendIcon trend={test.trend} />{test.trendPercentage}%
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
          className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          View all lab tests →
        </button>
      </CardContent>
    </Card>
  );
}