"use client";
import { useMemo, useState } from "react";
import {
  Activity, FlaskConical, IndianRupee, Pill, Sparkles, Stethoscope, UserCog,
} from "lucide-react";
import { GradientStatCard } from "./_components/opd-stat-cards";
import { OPDFilterBar } from "./_components/opd-filter-bar";
import { OPDConsultationFlow } from "./_components/opd-consultation-flow";
import { OPDDoctorPerformanceTable } from "./_components/opd-doctor-performance-table";
import { OPDMedicineSalesTable, OPDLabTestsTable } from "./_components/opd-medicine-lab-tables";
import {
  RevenueTrendChart, ConsultationTrendChart, HourlyFootfallChart,
  DepartmentRevenueChart, PaymentModeChart,
} from "./_components/opd-charts";
import { DATE_RANGE_OPTIONS, getOPDDashboardData } from "@/lib/opd/opd-analytics-data";
import { exportFullSummaryToExcel } from "@/lib/opd/opd-excel-export";
import type { DateRangeKey, OPDDashboardFilters } from "@/types/opd/opd-analytics-types";

const initialFilters: OPDDashboardFilters = {
  range: "today",
  department: "All Departments",
};

export default function OPDSuperAdminAnalyticsPage() {
  const [filters, setFilters] = useState<OPDDashboardFilters>(initialFilters);

  const dashboardData = useMemo(() => getOPDDashboardData(filters.range), [filters.range]);

  const filteredDoctors = useMemo(() => {
    if (filters.department === "All Departments") return dashboardData.doctorPerformance;
    return dashboardData.doctorPerformance.filter((d) => d.department === filters.department);
  }, [dashboardData.doctorPerformance, filters.department]);

  const rangeLabel = DATE_RANGE_OPTIONS.find((r) => r.key === filters.range)?.label ?? "Today";

  function handleRangeChange(range: DateRangeKey) {
    setFilters((prev) => ({ ...prev, range }));
  }

  function handleDepartmentChange(department: string) {
    setFilters((prev) => ({ ...prev, department }));
  }

  function handleReset() {
    setFilters(initialFilters);
  }

  function handleExportSummary() {
    exportFullSummaryToExcel(dashboardData.revenue, dashboardData.consultationStats, rangeLabel);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30">
      <div className="mx-auto max-w-[1800px] space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-violet-700 bg-clip-text text-transparent">
                OPD Analytics Dashboard
              </h1>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Super Admin
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Complete revenue, consultation, doctor, pharmacy and lab performance overview — {rangeLabel}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <OPDFilterBar
          filters={filters}
          onRangeChange={handleRangeChange}
          onDepartmentChange={handleDepartmentChange}
          onCustomFromChange={(v) => setFilters((prev) => ({ ...prev, customFrom: v }))}
          onCustomToChange={(v) => setFilters((prev) => ({ ...prev, customTo: v }))}
          onReset={handleReset}
          onExportSummary={handleExportSummary}
        />

        {/* Revenue Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <GradientStatCard
            icon={<IndianRupee className="h-5 w-5" />}
            label="Total OPD Revenue"
            value={`₹${dashboardData.revenue.total.toLocaleString()}`}
            subtitle="All sources combined"
            changePercentage={dashboardData.revenue.changeVsPrevious}
            gradient="from-blue-600 to-indigo-600"
          />
          <GradientStatCard
            icon={<Activity className="h-5 w-5" />}
            label="OPD Consultation Fees"
            value={`₹${dashboardData.revenue.opdConsultation.toLocaleString()}`}
            subtitle="Registration + consultation"
            gradient="from-cyan-500 to-blue-500"
          />
          <GradientStatCard
            icon={<Stethoscope className="h-5 w-5" />}
            label="Doctor Fees Revenue"
            value={`₹${dashboardData.revenue.doctorFees.toLocaleString()}`}
            subtitle="Across all departments"
            gradient="from-violet-600 to-purple-600"
          />
          <GradientStatCard
            icon={<Pill className="h-5 w-5" />}
            label="Pharmacy Revenue"
            value={`₹${dashboardData.revenue.pharmacy.toLocaleString()}`}
            subtitle="OPD medicine sales"
            gradient="from-emerald-500 to-teal-500"
          />
          <GradientStatCard
            icon={<FlaskConical className="h-5 w-5" />}
            label="Lab Revenue (Path + Radio)"
            value={`₹${(dashboardData.revenue.labPathology + dashboardData.revenue.labRadiology).toLocaleString()}`}
            subtitle={`Path ₹${dashboardData.revenue.labPathology.toLocaleString()} · Radio ₹${dashboardData.revenue.labRadiology.toLocaleString()}`}
            gradient="from-amber-500 to-orange-500"
          />
        </div>

        {/* Consultation Flow */}
        <OPDConsultationFlow stats={dashboardData.consultationStats} />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RevenueTrendChart data={dashboardData.dailyTrends} />
          <ConsultationTrendChart data={dashboardData.dailyTrends} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <HourlyFootfallChart data={dashboardData.hourlyTrends} />
          </div>
          <div className="lg:col-span-1">
            <DepartmentRevenueChart data={dashboardData.departmentRevenue} />
          </div>
          <div className="lg:col-span-1">
            <PaymentModeChart data={dashboardData.paymentBreakdown} />
          </div>
        </div>

        {/* Doctor Performance Table */}
        <OPDDoctorPerformanceTable doctors={filteredDoctors} />

        {/* Medicine & Lab Tables */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <OPDMedicineSalesTable medicines={dashboardData.medicineSales} />
          <OPDLabTestsTable tests={dashboardData.labTests} />
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
          <UserCog className="h-3.5 w-3.5" />
          Data refreshed live from OPD, Pharmacy, and Lab modules · Super Admin access only
        </div>
      </div>
    </div>
  );
}
