// app/(main)/icu/dashboard/_components/icu-doctor-workload-table.tsx
"use client";

import { useState } from "react";
import { AlertCircle, Download, Skull, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DoctorICUStatus, DoctorICUWorkload } from "@/types/icu/icu-analytics-types";
import { exportDoctorWorkloadToExcel } from "@/lib/icu/icu-excel-export";

const STATUS_STYLES: Record<DoctorICUStatus, string> = {
  "High Load": "bg-red-100 text-red-700 border-red-200",
  Balanced: "bg-blue-100 text-blue-700 border-blue-200",
  "Low Load": "bg-slate-100 text-slate-600 border-slate-200",
};

const AVATAR_GRADIENTS = [
  "from-red-500 to-rose-600",
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-cyan-500 to-sky-600",
];

export function ICUDoctorWorkloadTable({
  doctors,
  onViewAll,
}: {
  doctors: DoctorICUWorkload[];
  onViewAll: () => void;
}) {
  const [sortBy, setSortBy] = useState<"patients" | "revenue" | "critical">("patients");

  const sorted = [...doctors].sort((a, b) => {
    if (sortBy === "patients") return b.totalPatients - a.totalPatients;
    if (sortBy === "revenue") return b.revenueGenerated - a.revenueGenerated;
    return b.criticalPatients - a.criticalPatients;
  });

  const mostPatients = sorted[0];
  const leastPatients = [...doctors].sort((a, b) => a.totalPatients - b.totalPatients)[0];

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Trophy className="h-5 w-5 text-amber-500" /> Doctor-wise ICU Patient Load
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {(["patients", "revenue", "critical"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortBy(key)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                    sortBy === key ? "bg-white text-red-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => exportDoctorWorkloadToExcel(doctors)}
              className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-rose-50 p-3">
            <div className="rounded-lg bg-gradient-to-br from-red-500 to-rose-500 p-2 text-white shadow-md">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-red-700">Most Patients (High Load)</p>
              <p className="text-sm font-bold text-slate-800">{mostPatients?.name}</p>
              <p className="text-xs text-slate-500">
                {mostPatients?.totalPatients} patients · {mostPatients?.criticalPatients} critical
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-3">
            <div className="rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 p-2 text-white shadow-md">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600">Fewest Patients (Low Load)</p>
              <p className="text-sm font-bold text-slate-800">{leastPatients?.name}</p>
              <p className="text-xs text-slate-500">Only {leastPatients?.totalPatients} patients assigned</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Doctor</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Total</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Critical</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Stable</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Discharged</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Deceased</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>

            <tbody>
              {sorted.slice(0, 6).map((doc, idx) => (
                <tr key={doc.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-xs font-bold text-white shadow-md`}
                      >
                        {doc.avatarInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{doc.name}</p>
                        <p className="truncate text-xs text-slate-400">{doc.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-bold text-slate-700">{doc.totalPatients}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-bold ${doc.criticalPatients > 2 ? "text-red-600" : "text-slate-500"}`}>
                      {doc.criticalPatients > 0 ? <AlertCircle className="mr-1 inline h-3 w-3" /> : null}
                      {doc.criticalPatients}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-semibold text-emerald-600">{doc.stablePatients}</td>
                  <td className="px-3 py-3 text-center text-sm text-slate-600">{doc.dischargedToday}</td>
                  <td className="px-3 py-3 text-center">
                    {doc.deceasedCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                        <Skull className="h-3.5 w-3.5" /> {doc.deceasedCount}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">0</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-slate-800">
                    ₹{doc.revenueGenerated.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant="outline" className={`${STATUS_STYLES[doc.status]} text-xs font-medium`}>
                      {doc.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {doctors.length > 6 ? (
          <button
            type="button"
            onClick={onViewAll}
            className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            View all {doctors.length} doctors →
          </button>
        ) : null}
      </CardContent>
    </Card>
  );
}