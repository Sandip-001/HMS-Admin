// app/admin/pharmacy/expiry-medicines/_components/expiry-section-card.tsx
"use client";

import { AlertTriangle, Clock3 } from "lucide-react";
import { DownloadExcelButton } from "./download-excel-button";
import { ExpiryStatusBadge } from "./expiry-status-badge";
import type { ExpiryMedicineItem } from "@/types/pharmacy/expiry-medicines-types";

export function ExpirySectionCard({
  title,
  subtitle,
  items,
  type,
}: {
  title: string;
  subtitle: string;
  items: ExpiryMedicineItem[];
  type: "expired" | "near-expiry";
}) {
  const Icon = type === "expired" ? AlertTriangle : Clock3;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              type === "expired" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        <DownloadExcelButton
          data={items}
          fileName={type === "expired" ? "expired-medicines-list" : "near-expiry-medicines-list"}
          label="Download Excel"
        />
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-3 py-3 font-medium">Medicine</th>
              <th className="px-3 py-3 font-medium">Batch / Rack</th>
              <th className="px-3 py-3 font-medium">Brand / Category</th>
              <th className="px-3 py-3 font-medium">Supplier</th>
              <th className="px-3 py-3 font-medium">Stock</th>
              <th className="px-3 py-3 font-medium">Expiry Date</th>
              <th className="px-3 py-3 font-medium">Days Left</th>
              <th className="px-3 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-3 py-3">
                  <p className="font-medium text-slate-800">{item.medicineName}</p>
                  <p className="text-xs text-slate-400">{item.genericName}</p>
                </td>
                <td className="px-3 py-3 text-slate-600">
                  {item.batchNo}
                  <div className="text-xs text-slate-400">{item.rack}</div>
                </td>
                <td className="px-3 py-3 text-slate-600">
                  {item.brand}
                  <div className="text-xs text-slate-400">{item.category}</div>
                </td>
                <td className="px-3 py-3 text-slate-600">{item.supplier}</td>
                <td className="px-3 py-3 font-medium text-slate-700">{item.stock} pcs</td>
                <td className="px-3 py-3 text-slate-600">{item.expiryDate}</td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.daysLeft < 0
                        ? "bg-red-50 text-red-700"
                        : item.daysLeft <= 30
                        ? "bg-orange-50 text-orange-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days ago` : `${item.daysLeft} days left`}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <ExpiryStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.medicineName}</p>
                <p className="text-xs text-slate-400">{item.genericName}</p>
              </div>
              <ExpiryStatusBadge status={item.status} />
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-600">
              <div><span className="text-slate-400">Batch:</span> {item.batchNo}</div>
              <div><span className="text-slate-400">Rack:</span> {item.rack}</div>
              <div><span className="text-slate-400">Brand:</span> {item.brand}</div>
              <div><span className="text-slate-400">Category:</span> {item.category}</div>
              <div><span className="text-slate-400">Stock:</span> {item.stock} pcs</div>
              <div><span className="text-slate-400">Expiry:</span> {item.expiryDate}</div>
              <div className="col-span-2"><span className="text-slate-400">Supplier:</span> {item.supplier}</div>
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  item.daysLeft < 0
                    ? "bg-red-50 text-red-700"
                    : item.daysLeft <= 30
                    ? "bg-orange-50 text-orange-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days ago` : `${item.daysLeft} days left`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}