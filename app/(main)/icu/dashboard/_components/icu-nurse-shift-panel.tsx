// app/(main)/icu/dashboard/_components/icu-nurse-shift-panel.tsx
"use client";

import { useMemo, useState } from "react";
import { Download, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  NursePatientAssignment,
  NurseShift,
} from "@/types/icu/icu-analytics-types";
import { exportNurseAssignmentsToExcel } from "@/lib/icu/icu-excel-export";

const SHIFT_STYLES: Record<NurseShift, string> = {
  Morning: "bg-amber-50 text-amber-700 border-amber-200",
  Evening: "bg-orange-50 text-orange-700 border-orange-200",
  Night: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const STATUS_STYLES: Record<NursePatientAssignment["status"], string> = {
  "On Duty": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Handover Pending": "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-slate-50 text-slate-600 border-slate-200",
};

export function ICUNurseShiftPanel({
  assignments,
  onViewAll,
}: {
  assignments: NursePatientAssignment[];
  onViewAll: () => void;
}) {
  const [shiftFilter, setShiftFilter] = useState<"All" | NurseShift>("All");

  const filtered = useMemo(() => {
    if (shiftFilter === "All") return assignments;
    return assignments.filter((a) => a.shift === shiftFilter);
  }, [assignments, shiftFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, NursePatientAssignment[]>();
    filtered.forEach((a) => {
      const existing = map.get(a.nurseName) ?? [];
      map.set(a.nurseName, [...existing, a]);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <UserRound className="h-5 w-5 text-pink-500" /> Nurse-wise Patient Assignments
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {(["All", "Morning", "Evening", "Night"] as const).map((shift) => (
                <button
                  key={shift}
                  type="button"
                  onClick={() => setShiftFilter(shift)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    shiftFilter === shift ? "bg-white text-red-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => exportNurseAssignmentsToExcel(assignments)}
              className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
          {grouped.slice(0, 6).map(([nurseName, patients]) => (
            <div key={nurseName} className="rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-sm font-bold text-white shadow-md">
                  {patients[0].nurseInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{nurseName}</p>
                  <p className="text-xs text-slate-400">
                    {patients.length} patient{patients.length !== 1 ? "s" : ""} assigned
                  </p>
                </div>
              </div>

              <div className="space-y-2 pl-1">
                {patients.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Badge variant="outline" className={`${SHIFT_STYLES[p.shift]} shrink-0 text-[10px]`}>
                        {p.shift}
                      </Badge>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-700">{p.patientName}</p>
                        <p className="text-[10px] text-slate-400">
                          {p.bay} · {p.bed}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${STATUS_STYLES[p.status]} shrink-0 text-[10px]`}>
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 w-full rounded-lg py-2 text-center text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          View all nurse assignments →
        </button>
      </CardContent>
    </Card>
  );
}