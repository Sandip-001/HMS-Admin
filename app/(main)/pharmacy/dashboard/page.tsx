// app/admin/pharmacy/dashboard/page.tsx
"use client";

import { IndianRupee, ShoppingCart, PackageX, CalendarClock } from "lucide-react";
import { PharmacyKpiCard } from "./_components/pharmacy-kpi-card";
import { MonthlySalesTrendChart } from "./_components/monthly-sales-trend-chart";
import { CategorySalesDonutChart } from "./_components/category-sales-donut-chart";
import { TopSellingMedicinesChart } from "./_components/top-selling-medicines-chart";
import { LeastSellingMedicinesChart } from "./_components/least-selling-medicines-chart";
import { RevenueProfitChart } from "./_components/revenue-profit-chart";
import { StockStatusDonutChart } from "./_components/stock-status-donut-chart";
import { ExpiryTimelineChart } from "./_components/expiry-timeline-chart";
import { DiseaseUsageChart } from "./_components/disease-usage-chart";
import { SupplierPurchaseChart } from "./_components/supplier-purchase-chart";
import {
  PHARMACY_KPI,
  MONTHLY_SALES,
  CATEGORY_SALES,
  TOP_SELLING_MEDICINES,
  LEAST_SELLING_MEDICINES,
  REVENUE_PROFIT,
  STOCK_STATUS,
  EXPIRY_TIMELINE,
  DISEASE_USAGE,
  SUPPLIER_PURCHASE,
} from "@/lib/pharmacy/pharmacy-dashboard-data";

export default function PharmacyMasterDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Pharmacy Master Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time overview of sales, stock, and supplier performance across the pharmacy module.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PharmacyKpiCard icon={IndianRupee} label="Total Sales (This Month)" value={`₹${(PHARMACY_KPI.totalSalesThisMonth / 1000).toFixed(0)}k`} tint="blue" />
          <PharmacyKpiCard icon={ShoppingCart} label="Total Orders" value={PHARMACY_KPI.totalOrders.toLocaleString()} tint="emerald" />
          <PharmacyKpiCard icon={PackageX} label="Low Stock Items" value={String(PHARMACY_KPI.lowStockItems)} tint="amber" />
          <PharmacyKpiCard icon={CalendarClock} label="Expiring Soon" value={String(PHARMACY_KPI.expiringSoonItems)} tint="rose" suffix="items" />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <MonthlySalesTrendChart data={MONTHLY_SALES} />
          <CategorySalesDonutChart data={CATEGORY_SALES} />
          <StockStatusDonutChart data={STOCK_STATUS} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <TopSellingMedicinesChart data={TOP_SELLING_MEDICINES} />
          <LeastSellingMedicinesChart data={LEAST_SELLING_MEDICINES} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RevenueProfitChart data={REVENUE_PROFIT} />
          <ExpiryTimelineChart data={EXPIRY_TIMELINE} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <DiseaseUsageChart data={DISEASE_USAGE} />
          <SupplierPurchaseChart data={SUPPLIER_PURCHASE} />
        </div>
      </div>
    </div>
  );
}