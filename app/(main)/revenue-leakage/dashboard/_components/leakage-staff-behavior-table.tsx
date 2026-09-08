// app/(main)/revenue-leakage/dashboard/_components/leakage-staff-behavior-table.tsx
"use client";

import { AlertTriangle, Download, ShieldAlert, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StaffDiscountBehavior } from "@/types/revenue-leakage/revenue-leakage-types";
import { exportStaffBehaviorToExcel } from "@/lib/revenue-leakage/revenue-leakage-excel-export";

export function LeakageStaffBehaviorTable({
  records,
  onViewAll,
}: {
  records: StaffDiscountBehavior[];
  onViewAll: () => void;
}) {
  const displayed = records.slice(0, 6);
  const flaggedCount = records.filter((r) => r.flagged).length;

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <ShieldAlert className="h-5 w-5 text-indigo-500" /> Staff Discount Behavior Monitor
          </CardTitle>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportStaffBehaviorToExcel(records)}
            className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        </div>

        {flaggedCount > 0 ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {flaggedCount} staff member{flaggedCount !== 1 ? "s" : ""} flagged for unusually high discount frequency
          </div>
        ) : null}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Staff</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Discounts</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Total Amount</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Avg %</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Flag</th>
              </tr>
            </thead>

            <tbody>
              {displayed.map((record) => (
                <tr key={record.staffName} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-bold text-white">
                        {record.staffName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{record.staffName}</p>
                        <p className="truncate text-xs text-slate-400">{record.role} · {record.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-bold text-slate-700">{record.totalDiscountsGiven}</td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-slate-800">₹{record.totalDiscountAmount.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${record.avgDiscountPercentage >= 25 ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                    >
                      {record.avgDiscountPercentage}%
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {record.flagged ? (
                      <Badge variant="outline" className="gap-1 border-red-200 bg-red-50 text-xs text-red-700">
                        <AlertTriangle className="h-3 w-3" /> Review
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-xs text-emerald-700">
                        <UserCheck className="h-3 w-3" /> Normal
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
        >
          View all staff members →
        </button>
      </CardContent>
    </Card>
  );
}