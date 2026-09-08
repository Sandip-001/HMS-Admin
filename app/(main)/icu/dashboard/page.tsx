// app/(main)/icu/dashboard/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  BedDouble,
  FlaskConical,
  IndianRupee,
  Pill,
  Sparkles,
  Stethoscope,
  UserCog,
  Wallet,
  WalletCards,
  Wind,
} from "lucide-react";
import { ClickableStatCard } from "./_components/icu-stat-cards";
import { ICUFilterBar } from "./_components/icu-filter-bar";
import { ICUPatientFlowStats } from "./_components/icu-patient-flow-stats";
import { ICUDoctorWorkloadTable } from "./_components/icu-doctor-workload-table";
import { ICUNurseShiftPanel } from "./_components/icu-nurse-shift-panel";
import { ICUMedicineSalesTable, ICULabTestsTable } from "./_components/icu-medicine-lab-tables";
import { ICUBedOccupancyGrid } from "./_components/icu-bed-occupancy-grid";
import {
  RevenueCollectionChart,
  AdmissionDischargeChart,
  HourlyMovementChart,
  BayOccupancyChart,
  PaymentSourceChart,
} from "./_components/icu-charts";
import { ICUDetailDrawer } from "./_components/icu-detail-drawer";
import { DATE_RANGE_OPTIONS, getICUDashboardData } from "@/lib/icu/icu-analytics-data";
import { exportFullSummaryToExcel } from "@/lib/icu/icu-excel-export";
import type {
  DateRangeKey,
  ICUDashboardFilters,
  ICUDrawerContentType,
} from "@/types/icu/icu-analytics-types";

const initialFilters: ICUDashboardFilters = {
  range: "today",
  department: "All Departments",
  bay: "All Bays",
};

export default function ICUAdminAnalyticsPage() {
  const [filters, setFilters] = useState<ICUDashboardFilters>(initialFilters);
  const [activeDrawer, setActiveDrawer] = useState<ICUDrawerContentType>(null);

  const dashboardData = useMemo(() => getICUDashboardData(filters.range), [filters.range]);

  const filteredDoctors = useMemo(() => {
    if (filters.department === "All Departments") return dashboardData.doctorWorkload;
    return dashboardData.doctorWorkload.filter((d) => d.department === filters.department);
  }, [dashboardData.doctorWorkload, filters.department]);

  const filteredNurses = useMemo(() => {
    if (filters.bay === "All Bays") return dashboardData.nurseAssignments;
    return dashboardData.nurseAssignments.filter((n) => n.bay === filters.bay);
  }, [dashboardData.nurseAssignments, filters.bay]);

  const rangeLabel = DATE_RANGE_OPTIONS.find((r) => r.key === filters.range)?.label ?? "Today";

  function handleRangeChange(range: DateRangeKey) {
    setFilters((prev) => ({ ...prev, range }));
  }

  function handleDepartmentChange(department: string) {
    setFilters((prev) => ({ ...prev, department }));
  }

  function handleBayChange(bay: string) {
    setFilters((prev) => ({ ...prev, bay }));
  }

  function handleReset() {
    setFilters(initialFilters);
  }

  function handleExportSummary() {
    exportFullSummaryToExcel(dashboardData.revenue, rangeLabel);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30">
      <div className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-red-700 to-orange-700 bg-clip-text text-transparent sm:text-3xl">
                ICU Analytics Dashboard
              </h1>
              <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                <Sparkles className="h-3 w-3" /> Admin
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Complete revenue, occupancy, critical care and staff performance overview — {rangeLabel}
            </p>
          </div>
        </div>

        <ICUFilterBar
          filters={filters}
          onRangeChange={handleRangeChange}
          onDepartmentChange={handleDepartmentChange}
          onBayChange={handleBayChange}
          onCustomFromChange={(v) => setFilters((prev) => ({ ...prev, customFrom: v }))}
          onCustomToChange={(v) => setFilters((prev) => ({ ...prev, customTo: v }))}
          onReset={handleReset}
          onExportSummary={handleExportSummary}
        />

        {/* Revenue Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ClickableStatCard
            icon={<IndianRupee className="h-5 w-5" />}
            label="Total ICU Revenue"
            value={`₹${dashboardData.revenue.total.toLocaleString("en-IN")}`}
            subtitle="All sources combined"
            changePercentage={dashboardData.revenue.changeVsPrevious}
            gradient="from-red-600 to-rose-600"
            onClick={() => setActiveDrawer("revenue")}
          />
          <ClickableStatCard
            icon={<Wallet className="h-5 w-5" />}
            label="Total Collected"
            value={`₹${dashboardData.revenue.totalCollected.toLocaleString("en-IN")}`}
            subtitle={`${Math.round((dashboardData.revenue.totalCollected / dashboardData.revenue.total) * 100)}% of total revenue`}
            gradient="from-emerald-500 to-teal-500"
            onClick={() => setActiveDrawer("collected")}
          />
          <ClickableStatCard
            icon={<WalletCards className="h-5 w-5" />}
            label="Total Pending"
            value={`₹${dashboardData.revenue.totalPending.toLocaleString("en-IN")}`}
            subtitle="Outstanding from patients"
            gradient="from-amber-500 to-orange-500"
            onClick={() => setActiveDrawer("pending")}
          />
          <ClickableStatCard
            icon={<Wind className="h-5 w-5" />}
            label="Oxygen &amp; Ventilation"
            value={`₹${(dashboardData.revenue.oxygenFees + dashboardData.revenue.ventilationFees).toLocaleString("en-IN")}`}
            subtitle={`O₂ ₹${dashboardData.revenue.oxygenFees.toLocaleString("en-IN")} · Vent ₹${dashboardData.revenue.ventilationFees.toLocaleString("en-IN")}`}
            gradient="from-cyan-500 to-blue-500"
            onClick={() => setActiveDrawer("oxygenVentilation")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ClickableStatCard
            icon={<BedDouble className="h-5 w-5" />}
            label="Bed Fees"
            value={`₹${dashboardData.revenue.bedFees.toLocaleString("en-IN")}`}
            subtitle="Critical care bed charges"
            gradient="from-violet-600 to-purple-600"
          />
          <ClickableStatCard
            icon={<Stethoscope className="h-5 w-5" />}
            label="Doctor Fees Revenue"
            value={`₹${dashboardData.revenue.doctorFees.toLocaleString("en-IN")}`}
            subtitle="Across all critical care doctors"
            gradient="from-blue-500 to-indigo-500"
          />
          <ClickableStatCard
            icon={<Pill className="h-5 w-5" />}
            label="Pharmacy Income"
            value={`₹${dashboardData.revenue.pharmacy.toLocaleString("en-IN")}`}
            subtitle="ICU medicine sales"
            gradient="from-pink-500 to-rose-500"
            onClick={() => setActiveDrawer("pharmacyIncome")}
          />
          <ClickableStatCard
            icon={<FlaskConical className="h-5 w-5" />}
            label="Lab Income (Path + Radio)"
            value={`₹${(dashboardData.revenue.labPathology + dashboardData.revenue.labRadiology).toLocaleString("en-IN")}`}
            subtitle={`Path ₹${dashboardData.revenue.labPathology.toLocaleString("en-IN")} · Radio ₹${dashboardData.revenue.labRadiology.toLocaleString("en-IN")}`}
            gradient="from-indigo-500 to-blue-600"
            onClick={() => setActiveDrawer("labIncome")}
          />
        </div>

        {/* Patient Flow */}
        <ICUPatientFlowStats patientFlow={dashboardData.patientFlow} onOpenDrawer={setActiveDrawer} />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RevenueCollectionChart data={dashboardData.dailyTrends} />
          <AdmissionDischargeChart data={dashboardData.dailyTrends} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <HourlyMovementChart data={dashboardData.hourlyTrends} />
          </div>
          <div className="lg:col-span-1">
            <BayOccupancyChart data={dashboardData.bayOccupancy} />
          </div>
          <div className="lg:col-span-1">
            <button type="button" onClick={() => setActiveDrawer("paymentSources")} className="w-full text-left">
              <PaymentSourceChart data={dashboardData.paymentSources} />
            </button>
          </div>
        </div>

        {/* Live Bed Occupancy Map */}
        <ICUBedOccupancyGrid beds={dashboardData.bedDetails} onOpenDrawer={() => setActiveDrawer("bedOccupancy")} />

        {/* Doctor Workload */}
        <ICUDoctorWorkloadTable doctors={filteredDoctors} onViewAll={() => setActiveDrawer("doctorWorkload")} />

        {/* Nurse Assignments */}
        <ICUNurseShiftPanel assignments={filteredNurses} onViewAll={() => setActiveDrawer("nurseAssignments")} />

        {/* Medicine & Lab Tables */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ICUMedicineSalesTable medicines={dashboardData.medicineSales} onViewAll={() => setActiveDrawer("medicineSales")} />
          <ICULabTestsTable tests={dashboardData.labTests} onViewAll={() => setActiveDrawer("labTests")} />
        </div>

        <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
          <UserCog className="h-3.5 w-3.5" />
          Data refreshed live from ICU, Pharmacy, and Lab modules · Admin access only
        </div>
      </div>

      <ICUDetailDrawer type={activeDrawer} onClose={() => setActiveDrawer(null)} data={dashboardData} />
    </div>
  );
}