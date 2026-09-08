// app/(main)/emergency/dashboard/_components/emergency-patient-flow-stats.tsx
"use client";

import {
  Activity, HeartPulse, Scissors, Skull, UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClickableMiniStatCard } from "./emergency-stat-cards";
import type { EmergencyDashboardData, EmergencyDrawerContentType } from "@/types/emergency/emergency-analytics-types";

interface EmergencyPatientFlowStatsProps {
  patientFlow: EmergencyDashboardData["patientFlow"];
  onOpenDrawer: (type: EmergencyDrawerContentType) => void;
}

export function EmergencyPatientFlowStats({ patientFlow, onOpenDrawer }: EmergencyPatientFlowStatsProps) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
          <Activity className="h-5 w-5 text-rose-500" /> Patient Flow &amp; Critical Events
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <ClickableMiniStatCard
            icon={<UserPlus className="h-4 w-4" />}
            label="New Arrivals Today"
            value={patientFlow.newArrivalsToday}
            changePercentage={patientFlow.changeVsPrevious.newArrivals}
            tone="violet"
            onClick={() => onOpenDrawer("newArrivals")}
          />
          <ClickableMiniStatCard
            icon={<Activity className="h-4 w-4" />}
            label="Discharged Today"
            value={patientFlow.dischargedToday}
            changePercentage={patientFlow.changeVsPrevious.discharged}
            tone="emerald"
            onClick={() => onOpenDrawer("dischargedPatients")}
          />
          <ClickableMiniStatCard
            icon={<Activity className="h-4 w-4" />}
            label="Shifted to IPD"
            value={patientFlow.shiftedToIPD}
            changePercentage={patientFlow.changeVsPrevious.shiftedToIPD}
            tone="cyan"
            onClick={() => onOpenDrawer("shiftedToIpd")}
          />
          <ClickableMiniStatCard
            icon={<HeartPulse className="h-4 w-4" />}
            label="Shifted to ICU"
            value={patientFlow.shiftedToICU}
            changePercentage={patientFlow.changeVsPrevious.shiftedToICU}
            tone="red"
            onClick={() => onOpenDrawer("shiftedToIcu")}
          />
          <ClickableMiniStatCard
            icon={<Scissors className="h-4 w-4" />}
            label="Shifted to OT"
            value={patientFlow.shiftedToOT}
            changePercentage={patientFlow.changeVsPrevious.shiftedToOT}
            tone="amber"
            onClick={() => onOpenDrawer("shiftedToOt")}
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