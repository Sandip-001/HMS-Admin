// app/(main)/icu/dashboard/_components/icu-bed-occupancy-grid.tsx
"use client";

import { useState } from "react";
import { BedDouble, User, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BedDetail } from "@/types/icu/icu-analytics-types";

const STATUS_STYLES: Record<BedDetail["status"], string> = {
  Occupied: "border-red-300 bg-red-50 text-red-700",
  Available: "border-emerald-300 bg-emerald-50 text-emerald-700",
  Maintenance: "border-amber-300 bg-amber-50 text-amber-700",
};

export function ICUBedOccupancyGrid({
  beds,
  onOpenDrawer,
}: {
  beds: BedDetail[];
  onOpenDrawer: () => void;
}) {
  const [filter, setFilter] = useState<"All" | BedDetail["status"]>("All");

  const filtered = filter === "All" ? beds : beds.filter((b) => b.status === filter);
  const bayGroups = Array.from(new Set(filtered.map((b) => b.bay)));

  const totalOccupied = beds.filter((b) => b.status === "Occupied").length;
  const totalAvailable = beds.filter((b) => b.status === "Available").length;
  const totalMaintenance = beds.filter((b) => b.status === "Maintenance").length;

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <BedDouble className="h-5 w-5 text-red-500" /> Live Bed Occupancy Map
          </CardTitle>

          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {(["All", "Occupied", "Available", "Maintenance"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  filter === status ? "bg-white text-red-700 shadow-sm" : "text-slate-500"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center">
            <p className="text-2xl font-bold text-red-700">{totalOccupied}</p>
            <p className="text-xs text-red-600">Occupied</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-700">{totalAvailable}</p>
            <p className="text-xs text-emerald-600">Available</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
            <p className="text-2xl font-bold text-amber-700">{totalMaintenance}</p>
            <p className="text-xs text-amber-600">Maintenance</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="max-h-[420px] space-y-5 overflow-y-auto pr-1">
          {bayGroups.map((bay) => (
            <div key={bay}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                {bay}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {filtered
                  .filter((bed) => bed.bay === bay)
                  .map((bed) => (
                    <button
                      key={bed.bedId}
                      type="button"
                      onClick={onOpenDrawer}
                      className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${STATUS_STYLES[bed.status]}`}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-bold">{bed.bedId}</span>
                        {bed.status === "Occupied" ? (
                          <User className="h-3.5 w-3.5" />
                        ) : bed.status === "Maintenance" ? (
                          <Wrench className="h-3.5 w-3.5" />
                        ) : (
                          <BedDouble className="h-3.5 w-3.5" />
                        )}
                      </div>

                      {bed.status === "Occupied" ? (
                        <div>
                          <p className="truncate text-xs font-semibold">{bed.patientName}</p>
                          <p className="truncate text-[10px] opacity-70">{bed.uhid}</p>
                        </div>
                      ) : bed.status === "Maintenance" ? (
                        <p className="truncate text-[10px] opacity-80">{bed.maintenanceReason}</p>
                      ) : (
                        <Badge variant="outline" className="border-emerald-300 bg-white text-[10px] text-emerald-700">
                          Ready for admission
                        </Badge>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}