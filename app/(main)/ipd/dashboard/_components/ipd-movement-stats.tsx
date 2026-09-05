//app/(main)/ipd/dashboard/_components/ipd-movement-stats.tsx
"use client";
import {
  ArrowRightLeft, Ban, ClipboardList, HeartPulse, LogIn, LogOut, Syringe, UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClickableMiniStatCard } from "./ipd-stat-cards";
import { Download } from "lucide-react";
import type { CancelledAdmission, DrawerContentType, IpdPatientMovementStats } from "@/types/ipd/ipd-analytics-types";
import { exportCancelledAdmissionsToExcel } from "@/lib/ipd/ipd-excel-export";

interface IPDMovementStatsProps {
  stats: IpdPatientMovementStats;
  onOpenDrawer: (type: DrawerContentType) => void;
}

export function IPDMovementStats({ stats, onOpenDrawer }: IPDMovementStatsProps) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-500" /> Patient Movement &amp; Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <ClickableMiniStatCard
            icon={<ClipboardList className="h-4 w-4" />}
            label="Active Admissions"
            value={stats.totalActiveAdmissions}
            tone="blue"
          />
          <ClickableMiniStatCard
            icon={<UserPlus className="h-4 w-4" />}
            label="New Registrations Today"
            value={stats.newRegistrationsToday}
            changePercentage={stats.changeVsPrevious.newRegistrations}
            tone="violet"
            onClick={() => onOpenDrawer("newRegistrations")}
          />
          <ClickableMiniStatCard
            icon={<LogOut className="h-4 w-4" />}
            label="Discharged Today"
            value={stats.dischargedToday}
            changePercentage={stats.changeVsPrevious.discharged}
            tone="emerald"
            onClick={() => onOpenDrawer("discharged")}
          />
          <ClickableMiniStatCard
            icon={<Syringe className="h-4 w-4" />}
            label="Shifted to OT"
            value={stats.shiftedToOT}
            changePercentage={stats.changeVsPrevious.shiftedToOT}
            tone="amber"
            onClick={() => onOpenDrawer("shiftedToOT")}
          />
          <ClickableMiniStatCard
            icon={<HeartPulse className="h-4 w-4" />}
            label="Shifted to ICU"
            value={stats.shiftedToICU}
            changePercentage={stats.changeVsPrevious.shiftedToICU}
            tone="red"
            onClick={() => onOpenDrawer("shiftedToICU")}
          />
          <ClickableMiniStatCard
            icon={<ArrowRightLeft className="h-4 w-4" />}
            label="Shifted from ICU"
            value={stats.shiftedFromICU}
            tone="cyan"
          />
          <ClickableMiniStatCard
            icon={<LogIn className="h-4 w-4" />}
            label="Transferred from OPD"
            value={stats.transferredFromOPD}
            tone="indigo"
          />
          <ClickableMiniStatCard
            icon={<Ban className="h-4 w-4" />}
            label="Cancelled Admissions"
            value={stats.cancelledAdmissions}
            changePercentage={stats.changeVsPrevious.cancelled}
            tone="rose"
            onClick={() => onOpenDrawer("cancelledAdmissions")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function CancelledAdmissionsCard({
  cancellations, onViewAll,
}: { cancellations: CancelledAdmission[]; onViewAll: () => void }) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Ban className="h-5 w-5 text-rose-500" /> Cancelled Admissions
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportCancelledAdmissionsToExcel(cancellations)}
            className="h-8 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cancellations.slice(0, 4).map((c) => (
            <div key={c.id} className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{c.patientName}</p>
                  <p className="text-xs text-slate-400">{c.uhid} · {c.department}</p>
                </div>
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-xs shrink-0">
                  Cancelled
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">{c.reason}</p>
              <p className="text-xs text-slate-400 mt-1">{c.cancelledAt} · by {c.cancelledBy}</p>
            </div>
          ))}
        </div>

        {cancellations.length > 4 && (
          <button
            type="button"
            onClick={onViewAll}
            className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View all {cancellations.length} cancellations →
          </button>
        )}
      </CardContent>
    </Card>
  );
}