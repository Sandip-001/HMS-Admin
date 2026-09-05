//app/(main)/ipd/dashboard/_components/ipd-doctor-workload-table.tsx
"use client";
import { useState } from "react";
import { AlertCircle, Download, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DoctorIpdStatus, DoctorIpdWorkload } from "@/types/ipd/ipd-analytics-types";
import { exportDoctorWorkloadToExcel } from "@/lib/ipd/ipd-excel-export";

const STATUS_STYLES: Record<DoctorIpdStatus, string> = {
  "High Load": "bg-red-100 text-red-700 border-red-200",
  Balanced: "bg-blue-100 text-blue-700 border-blue-200",
  "Low Load": "bg-slate-100 text-slate-600 border-slate-200",
};

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
  "from-red-500 to-rose-600",
];

export function IPDDoctorWorkloadTable({
  doctors, onViewAll,
}: { doctors: DoctorIpdWorkload[]; onViewAll: () => void }) {
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> Doctor-wise Patient Workload
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {(["patients", "revenue", "critical"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortBy(key)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    sortBy === key ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"
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
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-md">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-red-700 font-semibold">Most Patients (High Load)</p>
              <p className="text-sm font-bold text-slate-800">{mostPatients?.name}</p>
              <p className="text-xs text-slate-500">{mostPatients?.totalPatients} patients · {mostPatients?.criticalPatients} critical</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-md">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold">Fewest Patients (Low Load)</p>
              <p className="text-sm font-bold text-slate-800">{leastPatients?.name}</p>
              <p className="text-xs text-slate-500">Only {leastPatients?.totalPatients} patients assigned</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Critical</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stable</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Discharged</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Revenue</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 6).map((doc, idx) => (
                <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0`}>
                        {doc.avatarInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-slate-400 truncate">{doc.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-bold text-slate-700">{doc.totalPatients}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-sm font-bold ${doc.criticalPatients > 2 ? "text-red-600" : "text-slate-500"}`}>
                      {doc.criticalPatients > 0 && <AlertCircle className="h-3 w-3 inline mr-1" />}
                      {doc.criticalPatients}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-semibold text-emerald-600">{doc.stablePatients}</td>
                  <td className="py-3 px-3 text-center text-sm text-slate-600">{doc.dischargedToday}</td>
                  <td className="py-3 px-3 text-right text-sm font-bold text-slate-800">₹{doc.revenueGenerated.toLocaleString()}</td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant="outline" className={`${STATUS_STYLES[doc.status]} text-xs font-medium`}>
                      {doc.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {doctors.length > 6 && (
          <button
            type="button"
            onClick={onViewAll}
            className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View all {doctors.length} doctors →
          </button>
        )}
      </CardContent>
    </Card>
  );
}