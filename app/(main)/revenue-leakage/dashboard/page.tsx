// app/(main)/revenue-leakage/dashboard/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  AlertOctagon,
  IndianRupee,
  PackageX,
  Sparkles,
  UserCog,
  Wallet,
} from "lucide-react";
import { ClickableStatCard } from "./_components/leakage-stat-cards";
import { LeakageFilterBar } from "./_components/leakage-filter-bar";
import { LeakageTrendChart, DepartmentLeakageChart, LeakageCategoryPieChart } from "./_components/leakage-charts";
import { LeakageDiscountTable } from "./_components/leakage-discount-table";
import { LeakageExpiredMedicineTable } from "./_components/leakage-expired-medicine-table";
import { LeakagePendingBillsTable } from "./_components/leakage-pending-bills-table";
import { LeakageOtherIssuesPanel } from "./_components/leakage-other-issues-panel";
import { LeakageStaffBehaviorTable } from "./_components/leakage-staff-behavior-table";
import { LeakageDetailDrawer } from "./_components/leakage-detail-drawer";
import { DATE_RANGE_OPTIONS, getRevenueLeakageDashboardData } from "@/lib/revenue-leakage/revenue-leakage-data";
import { exportFullSummaryToExcel } from "@/lib/revenue-leakage/revenue-leakage-excel-export";
import type {
  DateRangeKey,
  LeakageDrawerContentType,
  RevenueLeakageFilters,
} from "@/types/revenue-leakage/revenue-leakage-types";

const initialFilters: RevenueLeakageFilters = {
  range: "today",
  department: "All Departments",
};

export default function RevenueLeakageAnalyticsPage() {
  const [filters, setFilters] = useState<RevenueLeakageFilters>(initialFilters);
  const [activeDrawer, setActiveDrawer] = useState<LeakageDrawerContentType>(null);

  const dashboardData = useMemo(() => getRevenueLeakageDashboardData(filters.range), [filters.range]);

  const filteredDiscounts = useMemo(() => {
    if (filters.department === "All Departments") return dashboardData.discountRecords;
    return dashboardData.discountRecords.filter((d) => d.department === filters.department);
  }, [dashboardData.discountRecords, filters.department]);

  const filteredPending = useMemo(() => {
    if (filters.department === "All Departments") return dashboardData.pendingBills;
    return dashboardData.pendingBills.filter((p) => p.department === filters.department);
  }, [dashboardData.pendingBills, filters.department]);

  const filteredOther = useMemo(() => {
    if (filters.department === "All Departments") return dashboardData.otherLeakageRecords;
    return dashboardData.otherLeakageRecords.filter((o) => o.department === filters.department);
  }, [dashboardData.otherLeakageRecords, filters.department]);

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
    exportFullSummaryToExcel(dashboardData.summary, rangeLabel);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-red-50/30">
      <div className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-amber-700 to-red-700 bg-clip-text text-transparent sm:text-3xl">
                Revenue Leakage Analytics
              </h1>
              <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                <Sparkles className="h-3 w-3" /> Admin
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Discounts, expired stock, unpaid bills, and every other revenue leak across IPD, OPD, ICU, Emergency, OT, Pharmacy &amp; Lab — {rangeLabel}
            </p>
          </div>
        </div>

        <LeakageFilterBar
          filters={filters}
          onRangeChange={handleRangeChange}
          onDepartmentChange={handleDepartmentChange}
          onCustomFromChange={(v) => setFilters((prev) => ({ ...prev, customFrom: v }))}
          onCustomToChange={(v) => setFilters((prev) => ({ ...prev, customTo: v }))}
          onReset={handleReset}
          onExportSummary={handleExportSummary}
        />

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ClickableStatCard
            icon={<IndianRupee className="h-5 w-5" />}
            label="Grand Total Leakage"
            value={`₹${dashboardData.summary.grandTotalLeakage.toLocaleString("en-IN")}`}
            subtitle="All leakage sources combined"
            changePercentage={dashboardData.summary.changeVsPrevious}
            gradient="from-red-600 to-rose-700"
            onClick={() => setActiveDrawer("grandTotal")}
          />
          <ClickableStatCard
            icon={<Wallet className="h-5 w-5" />}
            label="Discount Leakage"
            value={`₹${dashboardData.summary.totalDiscountLeakage.toLocaleString("en-IN")}`}
            subtitle={`${dashboardData.summary.totalDiscountRecords} discount records`}
            gradient="from-amber-500 to-orange-600"
            onClick={() => setActiveDrawer("totalDiscount")}
          />
          <ClickableStatCard
            icon={<PackageX className="h-5 w-5" />}
            label="Expired Medicine Loss"
            value={`₹${dashboardData.summary.totalExpiredMedicineLoss.toLocaleString("en-IN")}`}
            subtitle={`${dashboardData.summary.totalExpiredBatches} expired batches`}
            gradient="from-violet-500 to-purple-600"
            onClick={() => setActiveDrawer("expiredMedicine")}
          />
          <ClickableStatCard
            icon={<Wallet className="h-5 w-5" />}
            label="Pending Bill Amount"
            value={`₹${dashboardData.summary.totalPendingAmount.toLocaleString("en-IN")}`}
            subtitle={`${dashboardData.summary.totalPendingBills} unpaid bills`}
            gradient="from-red-500 to-rose-600"
            onClick={() => setActiveDrawer("pendingAmount")}
          />
          <ClickableStatCard
            icon={<AlertOctagon className="h-5 w-5" />}
            label="Other Leakage Issues"
            value={`₹${dashboardData.summary.totalOtherLeakage.toLocaleString("en-IN")}`}
            subtitle={`${dashboardData.summary.totalOtherIssues} identified issues`}
            gradient="from-slate-500 to-slate-700"
            onClick={() => setActiveDrawer("otherLeakage")}
          />
        </div>

        {/* Charts Row 1 */}
        <LeakageTrendChart data={dashboardData.dailyTrends} />

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <button type="button" onClick={() => setActiveDrawer("departmentBreakdown")} className="w-full text-left">
            <DepartmentLeakageChart data={dashboardData.departmentSummary} />
          </button>
          <LeakageCategoryPieChart
            discountTotal={dashboardData.summary.totalDiscountLeakage}
            expiredTotal={dashboardData.summary.totalExpiredMedicineLoss}
            pendingTotal={dashboardData.summary.totalPendingAmount}
            otherTotal={dashboardData.summary.totalOtherLeakage}
          />
        </div>

        {/* Discount Records */}
        <LeakageDiscountTable records={filteredDiscounts} onViewAll={() => setActiveDrawer("totalDiscount")} />

        {/* Expired Medicine + Pending Bills */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <LeakageExpiredMedicineTable records={dashboardData.expiredMedicines} onViewAll={() => setActiveDrawer("expiredMedicine")} />
          <LeakagePendingBillsTable records={filteredPending} onViewAll={() => setActiveDrawer("pendingAmount")} />
        </div>

        {/* Other Issues + Staff Behavior */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <LeakageOtherIssuesPanel records={filteredOther} onViewAll={() => setActiveDrawer("otherLeakage")} />
          <LeakageStaffBehaviorTable records={dashboardData.staffDiscountBehavior} onViewAll={() => setActiveDrawer("staffBehavior")} />
        </div>

        <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
          <UserCog className="h-3.5 w-3.5" />
          Data aggregated live from IPD, OPD, ICU, Emergency, OT, Pharmacy, and Lab modules · Admin access only
        </div>
      </div>

      <LeakageDetailDrawer type={activeDrawer} onClose={() => setActiveDrawer(null)} data={dashboardData} />
    </div>
  );
}