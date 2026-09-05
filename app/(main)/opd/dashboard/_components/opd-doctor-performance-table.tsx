"use client";
import { useState } from "react";
import { Download, Star, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DoctorPerformance, DoctorPerformanceStatus } from "@/types/opd/opd-analytics-types";
import { exportDoctorPerformanceToExcel } from "@/lib/opd/opd-excel-export";

const STATUS_STYLES: Record<DoctorPerformanceStatus, string> = {
  "Top Performer": "bg-emerald-100 text-emerald-700 border-emerald-200",
  Average: "bg-amber-100 text-amber-700 border-amber-200",
  "Needs Attention": "bg-red-100 text-red-700 border-red-200",
};

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
];

export function OPDDoctorPerformanceTable({ doctors }: { doctors: DoctorPerformance[] }) {
  const [sortBy, setSortBy] = useState<"revenue" | "consultations" | "satisfaction">("revenue");

  const sorted = [...doctors].sort((a, b) => {
    if (sortBy === "revenue") return b.revenueGenerated - a.revenueGenerated;
    if (sortBy === "consultations") return b.completedConsultations - a.completedConsultations;
    return b.patientSatisfactionPct - a.patientSatisfactionPct;
  });

  const topPerformer = sorted[0];
  const needsAttention = [...doctors].sort((a, b) => a.completedConsultations - b.completedConsultations)[0];

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> Doctor Performance &amp; Revenue
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {(["revenue", "consultations", "satisfaction"] as const).map((key) => (
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
              onClick={() => exportDoctorPerformanceToExcel(doctors)}
              className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-emerald-700 font-semibold">Top Performer</p>
              <p className="text-sm font-bold text-slate-800">{topPerformer?.name}</p>
              <p className="text-xs text-slate-500">₹{topPerformer?.revenueGenerated.toLocaleString()} revenue · {topPerformer?.completedConsultations} consultations</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-md">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-red-700 font-semibold">Needs Attention</p>
              <p className="text-sm font-bold text-slate-800">{needsAttention?.name}</p>
              <p className="text-xs text-slate-500">Only {needsAttention?.completedConsultations} consultations completed</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Completed</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">New / F-Up</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cancelled</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Revenue</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Satisfaction</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((doc, idx) => (
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
                  <td className="py-3 px-3 text-center text-sm font-semibold text-slate-700">{doc.totalConsultations}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-sm font-bold text-emerald-600">{doc.completedConsultations}</span>
                  </td>
                  <td className="py-3 px-3 text-center text-xs text-slate-600">{doc.newConsultations} / {doc.followUpConsultations}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-sm font-semibold ${doc.cancelledConsultations > 2 ? "text-red-600" : "text-slate-500"}`}>{doc.cancelledConsultations}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-bold text-slate-800">₹{doc.revenueGenerated.toLocaleString()}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className={`h-3.5 w-3.5 ${doc.patientSatisfactionPct >= 90 ? "text-amber-500 fill-amber-500" : "text-slate-300 fill-slate-300"}`} />
                      <span className="text-sm font-medium text-slate-700">{doc.patientSatisfactionPct}%</span>
                    </div>
                  </td>
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
      </CardContent>
    </Card>
  );
}