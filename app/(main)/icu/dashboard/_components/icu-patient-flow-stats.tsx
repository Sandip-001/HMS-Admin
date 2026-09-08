// app/(main)/icu/dashboard/_components/icu-patient-flow-stats.tsx
"use client";

import {
  ArrowRightLeft, HeartPulse, Skull, UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClickableMiniStatCard } from "./icu-stat-cards";
import type { ICUDashboardData, ICUDrawerContentType } from "@/types/icu/icu-analytics-types";

interface ICUPatientFlowStatsProps {
  patientFlow: ICUDashboardData["patientFlow"];
  onOpenDrawer: (type: ICUDrawerContentType) => void;
}

export function ICUPatientFlowStats({ patientFlow, onOpenDrawer }: ICUPatientFlowStatsProps) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
          <HeartPulse className="h-5 w-5 text-red-500" /> Patient Flow &amp; Critical Events
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ClickableMiniStatCard
            icon={<UserPlus className="h-4 w-4" />}
            label="New Admissions Today"
            value={patientFlow.newAdmissionsToday}
            changePercentage={patientFlow.changeVsPrevious.newAdmissions}
            tone="violet"
            onClick={() => onOpenDrawer("newAdmissions")}
          />
          <ClickableMiniStatCard
            icon={<ArrowRightLeft className="h-4 w-4" />}
            label="Discharged Today"
            value={patientFlow.dischargedToday}
            changePercentage={patientFlow.changeVsPrevious.discharged}
            tone="emerald"
            onClick={() => onOpenDrawer("dischargedPatients")}
          />
          <ClickableMiniStatCard
            icon={<ArrowRightLeft className="h-4 w-4" />}
            label="Shifted to IPD"
            value={patientFlow.shiftedToIPD}
            changePercentage={patientFlow.changeVsPrevious.shiftedToIPD}
            tone="cyan"
            onClick={() => onOpenDrawer("shiftedToIpd")}
          />
          <ClickableMiniStatCard
            icon={<Skull className="h-4 w-4" />}
            label="Deceased Today"
            value={patientFlow.deceasedToday}
            changePercentage={patientFlow.changeVsPrevious.deceased}
            tone="slate"
            onClick={() => onOpenDrawer("mortalityRecords")}
          />
        </div>
      </CardContent>
    </Card>
  );
}