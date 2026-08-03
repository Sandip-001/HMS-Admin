// app/admin/pharmacy/stock-update/_components/stock-entries-table.tsx
"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "./payment-status-badge";
import type { StockUpdateEntry } from "@/types/pharmacy/stock-update-types";

export function StockEntriesTable({
  entries, onEdit, onDelete,
}: {
  entries: StockUpdateEntry[];
  onEdit: (entry: StockUpdateEntry) => void;
  onDelete: (entry: StockUpdateEntry) => void;
}) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 xl:block">
        <table className="w-full min-w-[1180px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-3 py-3 font-medium">Invoice</th>
              <th className="px-3 py-3 font-medium">Supplier</th>
              <th className="px-3 py-3 font-medium">Medicine / Batch</th>
              <th className="px-3 py-3 font-medium">Purchase Date</th>
              <th className="px-3 py-3 font-medium">Qty</th>
              <th className="px-3 py-3 font-medium">Purchase Price</th>
              <th className="px-3 py-3 font-medium">Selling / MRP</th>
              <th className="px-3 py-3 font-medium">GST / Discount</th>
              <th className="px-3 py-3 font-medium">Total</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-3 py-3 font-medium text-slate-700">{entry.invoiceNumber}</td>
                <td className="px-3 py-3 text-slate-600">{entry.supplier}</td>
                <td className="px-3 py-3">
                  <p className="font-medium text-slate-800">{entry.medicineName}</p>
                  <p className="text-xs text-slate-400">Batch: {entry.batchNo} · Exp: {entry.expiryDate}</p>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-slate-600">{entry.purchaseDate}</td>
                <td className="px-3 py-3 text-slate-600">{entry.quantity} pcs</td>
                <td className="px-3 py-3 text-slate-600">₹{entry.purchasePrice}</td>
                <td className="px-3 py-3 text-slate-600">₹{entry.sellingPrice} / ₹{entry.mrp}</td>
                <td className="px-3 py-3 text-slate-600">{entry.gstPercent}% / {entry.discountPercent}%</td>
                <td className="px-3 py-3 font-semibold text-slate-800">₹{entry.totalAmount.toLocaleString()}</td>
                <td className="px-3 py-3"><PaymentStatusBadge status={entry.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(entry)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => onDelete(entry)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 xl:hidden">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">{entry.medicineName}</p>
                <p className="text-xs text-slate-400">Batch: {entry.batchNo} · Invoice: {entry.invoiceNumber}</p>
              </div>
              <PaymentStatusBadge status={entry.status} />
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-600">
              <div><span className="text-slate-400">Supplier:</span> {entry.supplier}</div>
              <div><span className="text-slate-400">Purchase Date:</span> {entry.purchaseDate}</div>
              <div><span className="text-slate-400">Qty:</span> {entry.quantity} pcs</div>
              <div><span className="text-slate-400">Expiry:</span> {entry.expiryDate}</div>
              <div><span className="text-slate-400">Purchase Price:</span> ₹{entry.purchasePrice}</div>
              <div><span className="text-slate-400">Selling / MRP:</span> ₹{entry.sellingPrice} / ₹{entry.mrp}</div>
              <div><span className="text-slate-400">GST:</span> {entry.gstPercent}%</div>
              <div><span className="text-slate-400">Discount:</span> {entry.discountPercent}%</div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <p className="text-sm font-semibold text-slate-800">Total: ₹{entry.totalAmount.toLocaleString()}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(entry)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => onDelete(entry)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}