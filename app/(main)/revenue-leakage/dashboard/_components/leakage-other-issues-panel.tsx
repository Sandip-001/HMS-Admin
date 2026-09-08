// app/(main)/revenue-leakage/dashboard/_components/leakage-other-issues-panel.tsx
"use client";

import { AlertOctagon, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OtherLeakageRecord } from "@/types/revenue-leakage/revenue-leakage-types";
import { exportOtherLeakageToExcel } from "@/lib/revenue-leakage/revenue-leakage-excel-export";

const STATUS_STYLES: Record<OtherLeakageRecord["status"], string> = {
  Open: "border-red-200 bg-red-50 text-red-700",
  "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
  Resolved: "border-blue-200 bg-blue-50 text-blue-700",
  Recovered: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function LeakageOtherIssuesPanel({
  records,
  onViewAll,
}: {
  records: OtherLeakageRecord[];
  onViewAll: () => void;
}) {
  const displayed = records.slice(0, 5);
  const openCount = records.filter((r) => r.status === "Open").length;

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <AlertOctagon className="h-5 w-5 text-slate-500" /> Other Revenue Leakage Issues
          </CardTitle>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportOtherLeakageToExcel(records)}
            className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        </div>

        {openCount > 0 ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            <AlertOctagon className="h-3.5 w-3.5 shrink-0" />
            {openCount} issue{openCount !== 1 ? "s" : ""} still open and unresolved
          </div>
        ) : null}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {displayed.map((record) => (
            <div key={record.id} className="rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Badge variant="outline" className="mb-1.5 border-slate-300 bg-slate-100 text-xs text-slate-700">
                    {record.category}
                  </Badge>
                  <p className="text-sm font-semibold text-slate-800">
                    {record.department} · {record.patientName}
                  </p>
                  <p className="text-xs text-slate-400">{record.uhid}</p>
                </div>
                <Badge variant="outline" className={`${STATUS_STYLES[record.status]} shrink-0 text-xs`}>
                  {record.status}
                </Badge>
              </div>

              <p className="mb-2 text-xs text-slate-600">{record.description}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Identified by {record.identifiedBy} · {record.identifiedOn}
                </span>
                <span className="font-bold text-red-600">₹{record.estimatedLossAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          View all {records.length} leakage issues →
        </button>
      </CardContent>
    </Card>
  );
}