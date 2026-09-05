"use client";
import { useMemo, useState } from "react";
import {
  BedDouble, FlaskConical, IndianRupee, Pill, Sparkles, Stethoscope,
  UserCog, Wallet, WalletCards,
} from "lucide-react";
import { ClickableStatCard } from "./_components/ipd-stat-cards";
import { IPDFilterBar } from "./_components/ipd-filter-bar";
import { IPDMovementStats, CancelledAdmissionsCard } from "./_components/ipd-movement-stats";
import { IPDDoctorWorkloadTable } from "./_components/ipd-doctor-workload-table";
import { IPDNurseShiftPanel } from "./_components/ipd-nurse-shift-panel";
import { IPDMedicineSalesTable, IPDLabTestsTable } from "./_components/ipd-medicine-lab-tables";
import {
  RevenueCollectionChart, AdmissionDischargeChart, HourlyMovementChart,
  WardOccupancyChart, PaymentSourceChart,
} from "./_components/ipd-charts";
import { IPDDetailDrawer } from "./_components/ipd-detail-drawer";
import { DATE_RANGE_OPTIONS, getIPDDashboardData } from "@/lib/ipd/ipd-analytics-data";
import { exportFullSummaryToExcel } from "@/lib/ipd/ipd-excel-export";
import type { DateRangeKey, DrawerContentType, IPDDashboardFilters } from "@/types/ipd/ipd-analytics-types";

const initialFilters: IPDDashboardFilters = {
  range: "today",
  department: "All Departments",
  ward: "All Wards",
};

export default function IPDSuperAdminAnalyticsPage() {
  const [filters, setFilters] = useState<IPDDashboardFilters>(initialFilters);
  const [activeDrawer, setActiveDrawer] = useState<DrawerContentType>(null);

  const dashboardData = useMemo(() => getIPDDashboardData(filters.range), [filters.range]);

  const filteredDoctors = useMemo(() => {
    if (filters.department === "All Departments") return dashboardData.doctorWorkload;
    return dashboardData.doctorWorkload.filter((d) => d.department === filters.department);
  }, [dashboardData.doctorWorkload, filters.department]);

  const filteredNurses = useMemo(() => {
    if (filters.ward === "All Wards") return dashboardData.nurseAssignments;
    return dashboardData.nurseAssignments.filter((n) => n.ward === filters.ward);
  }, [dashboardData.nurseAssignments, filters.ward]);

  const rangeLabel = DATE_RANGE_OPTIONS.find((r) => r.key === filters.range)?.label ?? "Today";

  function handleRangeChange(range: DateRangeKey) {
    setFilters((prev) => ({ ...prev, range }));
  }

  function handleDepartmentChange(department: string) {
    setFilters((prev) => ({ ...prev, department }));
  }

  function handleWardChange(ward: string) {
    setFilters((prev) => ({ ...prev, ward }));
  }

  function handleReset() {
    setFilters(initialFilters);
  }

  function handleExportSummary() {
    exportFullSummaryToExcel(dashboardData.revenue, dashboardData.movementStats, rangeLabel);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30">
      <div className="mx-auto max-w-[1800px] space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-violet-700 bg-clip-text text-transparent">
                IPD Analytics Dashboard
              </h1>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Super Admin
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Complete revenue, occupancy, doctor, nurse, pharmacy and lab performance overview — {rangeLabel}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <IPDFilterBar
          filters={filters}
          onRangeChange={handleRangeChange}
          onDepartmentChange={handleDepartmentChange}
          onWardChange={handleWardChange}
          onCustomFromChange={(v) => setFilters((prev) => ({ ...prev, customFrom: v }))}
          onCustomToChange={(v) => setFilters((prev) => ({ ...prev, customTo: v }))}
          onReset={handleReset}
          onExportSummary={handleExportSummary}
        />

        {/* Revenue Stat Cards - Clickable */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ClickableStatCard
            icon={<IndianRupee className="h-5 w-5" />}
            label="Total IPD Revenue"
            value={`₹${dashboardData.revenue.total.toLocaleString()}`}
            subtitle="All sources combined"
            changePercentage={dashboardData.revenue.changeVsPrevious}
            gradient="from-blue-600 to-indigo-600"
            onClick={() => setActiveDrawer("revenue")}
          />
          <ClickableStatCard
            icon={<Wallet className="h-5 w-5" />}
            label="Total Collected"
            value={`₹${dashboardData.revenue.totalCollected.toLocaleString()}`}
            subtitle={`${Math.round((dashboardData.revenue.totalCollected / dashboardData.revenue.total) * 100)}% of total revenue`}
            gradient="from-emerald-500 to-teal-500"
            onClick={() => setActiveDrawer("collected")}
          />
          <ClickableStatCard
            icon={<WalletCards className="h-5 w-5" />}
            label="Total Pending"
            value={`₹${dashboardData.revenue.totalPending.toLocaleString()}`}
            subtitle="Outstanding from patients"
            gradient="from-amber-500 to-orange-500"
            onClick={() => setActiveDrawer("pending")}
          />
          <ClickableStatCard
            icon={<BedDouble className="h-5 w-5" />}
            label="Bed &amp; OT Charges"
            value={`₹${(dashboardData.revenue.bedCharges + dashboardData.revenue.otCharges).toLocaleString()}`}
            subtitle={`Bed ₹${dashboardData.revenue.bedCharges.toLocaleString()} · OT ₹${dashboardData.revenue.otCharges.toLocaleString()}`}
            gradient="from-violet-600 to-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ClickableStatCard
            icon={<Stethoscope className="h-5 w-5" />}
            label="Doctor Fees Revenue"
            value={`₹${dashboardData.revenue.doctorFees.toLocaleString()}`}
            subtitle="Across all departments"
            gradient="from-cyan-500 to-blue-500"
          />
          <ClickableStatCard
            icon={<Pill className="h-5 w-5" />}
            label="Pharmacy Income"
            value={`₹${dashboardData.revenue.pharmacy.toLocaleString()}`}
            subtitle="IPD medicine sales"
            gradient="from-rose-500 to-pink-500"
            onClick={() => setActiveDrawer("pharmacyIncome")}
          />
          <ClickableStatCard
            icon={<FlaskConical className="h-5 w-5" />}
            label="Lab Income (Path + Radio)"
            value={`₹${(dashboardData.revenue.labPathology + dashboardData.revenue.labRadiology).toLocaleString()}`}
            subtitle={`Path ₹${dashboardData.revenue.labPathology.toLocaleString()} · Radio ₹${dashboardData.revenue.labRadiology.toLocaleString()}`}
            gradient="from-indigo-500 to-blue-600"
            onClick={() => setActiveDrawer("labIncome")}
          />
        </div>

        {/* Patient Movement */}
        <IPDMovementStats stats={dashboardData.movementStats} onOpenDrawer={setActiveDrawer} />

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
            <WardOccupancyChart data={dashboardData.wardOccupancy} />
          </div>
          <div className="lg:col-span-1">
            <button type="button" onClick={() => setActiveDrawer("paymentSources")} className="w-full text-left">
              <PaymentSourceChart data={dashboardData.paymentSources} />
            </button>
          </div>
        </div>

        {/* Doctor Workload */}
        <IPDDoctorWorkloadTable doctors={filteredDoctors} onViewAll={() => setActiveDrawer("doctorWorkload")} />

        {/* Nurse Assignments + Cancelled Admissions */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <IPDNurseShiftPanel assignments={filteredNurses} onViewAll={() => setActiveDrawer("nurseAssignments")} />
          <CancelledAdmissionsCard cancellations={dashboardData.cancelledAdmissions} onViewAll={() => setActiveDrawer("cancelledAdmissions")} />
        </div>

        {/* Medicine & Lab Tables */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <IPDMedicineSalesTable medicines={dashboardData.medicineSales} onViewAll={() => setActiveDrawer("medicineSales")} />
          <IPDLabTestsTable tests={dashboardData.labTests} onViewAll={() => setActiveDrawer("labTests")} />
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
          <UserCog className="h-3.5 w-3.5" />
          Data refreshed live from IPD, Pharmacy, and Lab modules · Super Admin access only
        </div>
      </div>

      {/* Detail Drawer */}
      <IPDDetailDrawer type={activeDrawer} onClose={() => setActiveDrawer(null)} data={dashboardData} />
    </div>
  );
}