// app/(main)/revenue-leakage/dashboard/_components/leakage-expired-medicine-table.tsx
"use client";

import { Download, PackageX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExpiredMedicineRecord } from "@/types/revenue-leakage/revenue-leakage-types";
import { exportExpiredMedicinesToExcel } from "@/lib/revenue-leakage/revenue-leakage-excel-export";

const STATUS_STYLES: Record<ExpiredMedicineRecord["status"], string> = {
  "Pending Write-off": "border-red-200 bg-red-50 text-red-700",
  "Written Off": "border-slate-200 bg-slate-100 text-slate-600",
  "Returned to Vendor": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function LeakageExpiredMedicineTable({
  records,
  onViewAll,
}: {
  records: ExpiredMedicineRecord[];
  onViewAll: () => void;
}) {
  const displayed = records.slice(0, 6);
  const totalLoss = records.reduce((sum, r) => sum + r.totalLossAmount, 0);
  const pendingWriteOff = records.filter((r) => r.status === "Pending Write-off").length;

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <PackageX className="h-5 w-5 text-violet-500" /> Expired Medicine Stock Loss
          </CardTitle>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportExpiredMedicinesToExcel(records)}
            className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-violet-100 bg-violet-50 p-3 text-center">
            <p className="text-xl font-bold text-violet-700">₹{totalLoss.toLocaleString("en-IN")}</p>
            <p className="text-xs text-violet-600">Total Stock Loss</p>
          </div>
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center">
            <p className="text-xl font-bold text-red-700">{pendingWriteOff}</p>
            <p className="text-xs text-red-600">Pending Write-off</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Medicine</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Batch</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Qty</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Loss (₹)</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>

            <tbody>
              {displayed.map((record) => (
                <tr key={record.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <p className="text-sm font-semibold text-slate-800">{record.medicineName}</p>
                    <p className="text-xs text-slate-400">{record.category} · Exp: {record.expiryDate}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-mono text-slate-600">{record.batchNumber}</p>
                    <p className="text-[10px] text-slate-400">Rack: {record.rackNumber}</p>
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-bold text-slate-700">{record.expiredQuantity}</td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-red-600">₹{record.totalLossAmount.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant="outline" className={`${STATUS_STYLES[record.status]} text-xs`}>
                      {record.status}
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
          className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-violet-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
        >
          View all {records.length} expired batches →
        </button>
      </CardContent>
    </Card>
  );
}