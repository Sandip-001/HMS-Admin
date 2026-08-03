// app/admin/pharmacy/medicines/_components/medicines-table.tsx
"use client";

import { StockStatusBadge } from "./stock-status-badge";
import { MedicineActionsMenu } from "./medicine-actions-menu";
import { getActiveBatch, getStockStatus, getTotalStock } from "@/lib/pharmacy/medicine-helpers";
import type { Medicine } from "@/types/pharmacy/medicine-types";

export function MedicinesTable({
  medicines,
  onView, onEdit, onRestock, onDelete,
}: {
  medicines: Medicine[];
  onView: (m: Medicine) => void;
  onEdit: (m: Medicine) => void;
  onRestock: (m: Medicine) => void;
  onDelete: (m: Medicine) => void;
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 md:block">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Medicine Name</th>
              <th className="px-4 py-3 font-medium">Category / Brand</th>
              <th className="px-4 py-3 font-medium">Total Stock</th>
              <th className="px-4 py-3 font-medium">Purchase Price</th>
              <th className="px-4 py-3 font-medium">Selling Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => {
              const activeBatch = getActiveBatch(med);
              return (
                <tr key={med.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{med.medicineName}</p>
                    <p className="text-xs text-slate-400">{med.generic}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {med.category}
                    <div className="text-xs text-slate-400">{med.brand}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{getTotalStock(med)} pcs</td>
                  <td className="px-4 py-3 text-slate-600">{activeBatch ? `₹${activeBatch.purchasePrice}` : "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{activeBatch ? `₹${activeBatch.sellingPrice}` : "-"}</td>
                  <td className="px-4 py-3"><StockStatusBadge status={getStockStatus(med)} /></td>
                  <td className="px-4 py-3">
                    <MedicineActionsMenu
                      onView={() => onView(med)}
                      onEdit={() => onEdit(med)}
                      onRestock={() => onRestock(med)}
                      onDelete={() => onDelete(med)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {medicines.map((med) => {
          const activeBatch = getActiveBatch(med);
          return (
            <div key={med.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{med.medicineName}</p>
                  <p className="text-xs text-slate-400">{med.generic} · {med.category}</p>
                </div>
                <MedicineActionsMenu
                  onView={() => onView(med)}
                  onEdit={() => onEdit(med)}
                  onRestock={() => onRestock(med)}
                  onDelete={() => onDelete(med)}
                />
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-600">
                <div><span className="text-slate-400">Brand:</span> {med.brand}</div>
                <div><span className="text-slate-400">Total Stock:</span> {getTotalStock(med)} pcs</div>
                <div><span className="text-slate-400">Purchase:</span> {activeBatch ? `₹${activeBatch.purchasePrice}` : "-"}</div>
                <div><span className="text-slate-400">Selling:</span> {activeBatch ? `₹${activeBatch.sellingPrice}` : "-"}</div>
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <StockStatusBadge status={getStockStatus(med)} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}