"use client";
import {
  CalendarClock, CheckCircle2, ClipboardList, Hourglass, RefreshCcw,
  UserPlus, Users, XCircle, ArrowRightLeft, UserX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniStatCard } from "./opd-stat-cards";
import type { ConsultationStats } from "@/types/opd/opd-analytics-types";

export function OPDConsultationFlow({ stats }: { stats: ConsultationStats }) {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-500" /> Consultation Flow &amp; Queue Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MiniStatCard
            icon={<Users className="h-4 w-4" />}
            label="Total Consultations"
            value={stats.totalToday}
            changePercentage={stats.changeVsPrevious.total}
            tone="blue"
          />
          <MiniStatCard
            icon={<UserPlus className="h-4 w-4" />}
            label="New Consultations"
            value={stats.newConsultations}
            changePercentage={stats.changeVsPrevious.newConsultations}
            tone="violet"
          />
          <MiniStatCard
            icon={<RefreshCcw className="h-4 w-4" />}
            label="Follow-Ups"
            value={stats.followUpConsultations}
            changePercentage={stats.changeVsPrevious.followUp}
            tone="cyan"
          />
          <MiniStatCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Completed"
            value={stats.completed}
            changePercentage={stats.changeVsPrevious.completed}
            tone="emerald"
          />
          <MiniStatCard
            icon={<Hourglass className="h-4 w-4" />}
            label="Waiting Now"
            value={stats.waiting}
            tone="amber"
          />
          <MiniStatCard
            icon={<CalendarClock className="h-4 w-4" />}
            label="Rescheduled"
            value={stats.rescheduled}
            changePercentage={stats.changeVsPrevious.rescheduled}
            tone="amber"
          />
          <MiniStatCard
            icon={<XCircle className="h-4 w-4" />}
            label="Cancelled"
            value={stats.cancelled}
            changePercentage={stats.changeVsPrevious.cancelled}
            tone="red"
          />
          <MiniStatCard
            icon={<UserX className="h-4 w-4" />}
            label="No Show"
            value={stats.noShow}
            tone="rose"
          />
          <MiniStatCard
            icon={<Users className="h-4 w-4" />}
            label="Checked In"
            value={stats.checkedIn}
            tone="indigo"
          />
          <MiniStatCard
            icon={<ArrowRightLeft className="h-4 w-4" />}
            label="OPD → IPD Transfers"
            value={stats.opdToIpdTransfers}
            changePercentage={stats.changeVsPrevious.transfers}
            tone="violet"
          />
        </div>
      </CardContent>
    </Card>
  );
}