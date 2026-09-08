// app/(main)/revenue-leakage/dashboard/_components/leakage-pending-bills-table.tsx
"use client";

import { useState } from "react";
import { BellRing, CheckCircle2, Download, Phone, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PendingBillRecord } from "@/types/revenue-leakage/revenue-leakage-types";
import { exportPendingBillsToExcel, notifyBillingDepartment } from "@/lib/revenue-leakage/revenue-leakage-excel-export";

const STATUS_STYLES: Record<PendingBillRecord["status"], string> = {
  "Not Contacted": "border-slate-200 bg-slate-50 text-slate-600",
  "Follow-up Sent": "border-blue-200 bg-blue-50 text-blue-700",
  "Promised to Pay": "border-amber-200 bg-amber-50 text-amber-700",
  Escalated: "border-red-200 bg-red-50 text-red-700",
};

export function LeakagePendingBillsTable({
  records,
  onViewAll,
}: {
  records: PendingBillRecord[];
  onViewAll: () => void;
}) {
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  const displayed = [...records].sort((a, b) => b.amountPending - a.amountPending).slice(0, 6);
  const totalPending = records.reduce((sum, r) => sum + r.amountPending, 0);
  const escalatedCount = records.filter((r) => r.status === "Escalated").length;

  function handleNotify(record: PendingBillRecord) {
    notifyBillingDepartment(record.patientName, record.uhid, record.amountPending);
    setNotifiedIds((prev) => new Set(prev).add(record.id));
  }

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Wallet className="h-5 w-5 text-red-500" /> Pending Bill Amounts — Patient Party
          </CardTitle>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportPendingBillsToExcel(records)}
            className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center">
            <p className="text-xl font-bold text-red-700">₹{totalPending.toLocaleString("en-IN")}</p>
            <p className="text-xs text-red-600">Total Amount Pending</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
            <p className="text-xl font-bold text-amber-700">{escalatedCount}</p>
            <p className="text-xs text-amber-600">Escalated Cases</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {displayed.map((record) => {
            const isNotified = notifiedIds.has(record.id);
            const collectedPct = Math.round((record.amountCollected / record.totalBillAmount) * 100);

            return (
              <div key={record.id} className="rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-md">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{record.patientName}</p>
                    <p className="text-xs text-slate-400">
                      {record.uhid} · {record.department} · Dr. {record.doctor.replace("Dr. ", "")}
                    </p>
                  </div>
                  <Badge variant="outline" className={`${STATUS_STYLES[record.status]} text-xs shrink-0`}>
                    {record.status}
                  </Badge>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${collectedPct}%` }} />
                  </div>
                  <span className="shrink-0 text-xs font-medium text-slate-500">{collectedPct}% paid</span>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="flex gap-4 text-xs">
                    <div>
                      <p className="text-slate-400">Total Bill</p>
                      <p className="font-semibold text-slate-700">₹{record.totalBillAmount.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Collected</p>
                      <p className="font-semibold text-emerald-600">₹{record.amountCollected.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Pending</p>
                      <p className="font-bold text-red-600">₹{record.amountPending.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Days</p>
                      <p className="font-semibold text-slate-700">{record.daysPending}</p>
                    </div>
                  </div>

                  {record.contactNumber !== "N/A" ? (
                    <Button
                      size="sm"
                      variant={isNotified ? "outline" : "default"}
                      onClick={() => handleNotify(record)}
                      disabled={isNotified}
                      className={
                        isNotified
                          ? "h-8 border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "h-8 bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700"
                      }
                    >
                      {isNotified ? (
                        <>
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Notified
                        </>
                      ) : (
                        <>
                          <BellRing className="mr-1.5 h-3.5 w-3.5" /> Notify Billing Dept.
                        </>
                      )}
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Phone className="h-3 w-3" /> No contact available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          View all {records.length} pending bills →
        </button>
      </CardContent>
    </Card>
  );
}