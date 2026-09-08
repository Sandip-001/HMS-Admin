// app/(main)/revenue-leakage/dashboard/_components/leakage-discount-table.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, Download, Percent, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DiscountRecord, DiscountSourceType } from "@/types/revenue-leakage/revenue-leakage-types";
import { exportDiscountRecordsToExcel } from "@/lib/revenue-leakage/revenue-leakage-excel-export";

const SOURCE_STYLES: Record<DiscountSourceType, string> = {
  "Billing Department": "border-blue-200 bg-blue-50 text-blue-700",
  Pharmacy: "border-violet-200 bg-violet-50 text-violet-700",
  "Lab - Pathology": "border-cyan-200 bg-cyan-50 text-cyan-700",
  "Lab - Radiology": "border-sky-200 bg-sky-50 text-sky-700",
};

export function LeakageDiscountTable({
  records,
  onViewAll,
}: {
  records: DiscountRecord[];
  onViewAll: () => void;
}) {
  const [sourceFilter, setSourceFilter] = useState<"All" | DiscountSourceType>("All");

  const filtered = sourceFilter === "All" ? records : records.filter((r) => r.sourceType === sourceFilter);
  const displayed = [...filtered].sort((a, b) => b.discountAmount - a.discountAmount).slice(0, 7);
  const highRiskCount = records.filter((r) => r.discountPercentage >= 30).length;

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Tag className="h-5 w-5 text-amber-500" /> Discount Given — Billing, Pharmacy &amp; Lab
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {(["All", "Billing Department", "Pharmacy"] as const).map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setSourceFilter(source)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    sourceFilter === source ? "bg-white text-amber-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {source === "Billing Department" ? "Billing" : source}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => exportDiscountRecordsToExcel(records)}
              className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>

        {highRiskCount > 0 ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {highRiskCount} discount{highRiskCount !== 1 ? "s" : ""} of 30% or more flagged for review
          </div>
        ) : null}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Patient</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Source</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Bill / Discount</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">%</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Approved By</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">When</th>
              </tr>
            </thead>

            <tbody>
              {displayed.map((record) => (
                <tr key={record.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <p className="text-sm font-semibold text-slate-800">{record.patientName}</p>
                    <p className="text-xs text-slate-400">{record.uhid} · {record.department}</p>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant="outline" className={`${SOURCE_STYLES[record.sourceType]} text-xs`}>
                      {record.sourceType === "Billing Department" ? "Billing" : record.sourceType}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <p className="text-xs text-slate-400 line-through">₹{record.totalBillAmount.toLocaleString("en-IN")}</p>
                    <p className="text-sm font-bold text-red-600">-₹{record.discountAmount.toLocaleString("en-IN")}</p>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={`gap-1 text-xs ${record.discountPercentage >= 30 ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                    >
                      <Percent className="h-3 w-3" />
                      {record.discountPercentage}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-medium text-slate-700">{record.approvedBy}</p>
                    <p className="text-[10px] text-slate-400">{record.approverRole}</p>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500">{record.givenAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-700"
        >
          View all {records.length} discount records with full reasons →
        </button>
      </CardContent>
    </Card>
  );
}