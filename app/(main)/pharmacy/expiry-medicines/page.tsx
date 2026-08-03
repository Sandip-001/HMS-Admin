// app/admin/pharmacy/expiry-medicines/page.tsx
"use client";

import { useMemo } from "react";
import { AlertTriangle, Clock3, PackageSearch } from "lucide-react";
import { ExpiryStatCard } from "./_components/expiry-stat-card";
import { ExpirySectionCard } from "./_components/expiry-section-card";
import { EXPIRY_MEDICINES } from "@/lib/pharmacy/expiry-medicines-data";

export default function ExpiryMedicinesPage() {
  const expiredMedicines = useMemo(
    () => EXPIRY_MEDICINES.filter((item) => item.status === "Expired"),
    []
  );

  const nearExpiryMedicines = useMemo(
    () => EXPIRY_MEDICINES.filter((item) => item.status === "Near Expiry"),
    []
  );

  const totalAffectedStock = useMemo(
    () => EXPIRY_MEDICINES.reduce((sum, item) => sum + item.stock, 0),
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Expiry Medicines</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor expired and near-expiry medicines with quick Excel download support.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ExpiryStatCard
            icon={AlertTriangle}
            label="Expired Medicines"
            value={expiredMedicines.length.toString()}
            tint="red"
          />
          <ExpiryStatCard
            icon={Clock3}
            label="Near Expiry Medicines"
            value={nearExpiryMedicines.length.toString()}
            tint="amber"
          />
          <ExpiryStatCard
            icon={PackageSearch}
            label="Affected Stock Units"
            value={totalAffectedStock.toString()}
            tint="blue"
          />
        </div>

        <div className="grid grid-cols-1 gap-5">
          <ExpirySectionCard
            title="Expired Medicines List"
            subtitle="Medicines already expired and requiring immediate action"
            items={expiredMedicines}
            type="expired"
          />

          <ExpirySectionCard
            title="Near Expiry Medicines List"
            subtitle="Medicines nearing expiry so stock movement can be planned"
            items={nearExpiryMedicines}
            type="near-expiry"
          />
        </div>
      </div>
    </div>
  );
}