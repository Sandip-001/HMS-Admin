"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PurchaseOrder } from "@/types/pharmacy/purchase-types";
import { calculateItemTotal, calculatePurchaseTotal, calculateTotalAcceptedQty, getStatusColor } from "@/lib/pharmacy/purchase-helpers";
import {
  Building2, Calendar, CreditCard, FileText, MapPin, Package, StickyNote,
} from "lucide-react";

interface PurchaseViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: PurchaseOrder | null;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">{value ?? "—"}</p>
    </div>
  );
}

export function PurchaseViewDialog({ open, onOpenChange, purchase }: PurchaseViewDialogProps) {
  if (!purchase) return null;

  const totalValue = calculatePurchaseTotal(purchase.items);
  const totalAcceptedQty = calculateTotalAcceptedQty(purchase.items);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[96vw] !max-w-[900px] max-h-[92vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {purchase.supplierName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-slate-800 truncate">
                {purchase.poNumber}
              </DialogTitle>
              <p className="text-xs text-slate-500 truncate">{purchase.supplierName}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusColor(purchase.status)}>{purchase.status}</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              {purchase.paymentMode || "—"}
            </Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {purchase.warehouse}
            </Badge>
          </div>

          {/* Purchase details */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Purchase Details</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Supplier" value={purchase.supplierName} />
              <DetailItem label="GRN Number" value={purchase.grnNumber || "—"} />
              <DetailItem label="Invoice" value={purchase.invoice || "—"} />
              <DetailItem
                label="Purchase Date"
                value={
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {purchase.purchaseDate || "—"}
                  </span>
                }
              />
              <DetailItem
                label="Received Date"
                value={
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {purchase.receivedDate || "Pending"}
                  </span>
                }
              />
              <DetailItem label="Warehouse" value={purchase.warehouse} />
            </div>
            {purchase.remarks && (
              <div className="mt-4 pt-4 border-t border-slate-200/60">
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <StickyNote className="w-3.5 h-3.5" /> Remarks
                </p>
                <p className="text-sm text-slate-700">{purchase.remarks}</p>
              </div>
            )}
          </div>

          {/* Medicine line items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Medicine Line Items ({purchase.items.length})
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="py-2 pr-4">Medicine</th>
                    <th className="py-2 pr-4">Batch</th>
                    <th className="py-2 pr-4">MRP</th>
                    <th className="py-2 pr-4">PTR</th>
                    <th className="py-2 pr-4">GST</th>
                    <th className="py-2 pr-4">Disc.</th>
                    <th className="py-2 pr-4">Free</th>
                    <th className="py-2 pr-4">Accepted</th>
                    <th className="py-2 pr-4">Rejected</th>
                    <th className="py-2 pr-4">Expiry</th>
                    <th className="py-2 pr-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {purchase.items.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-4 text-center text-slate-400">
                        No medicine items added to this purchase yet.
                      </td>
                    </tr>
                  ) : (
                    purchase.items.map((item) => (
                      <tr key={item.itemId}>
                        <td className="py-2 pr-4 font-medium text-slate-700 whitespace-nowrap">{item.medicineName}</td>
                        <td className="py-2 pr-4 whitespace-nowrap font-mono text-slate-600">{item.batch}</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-slate-600">₹{item.mrp}</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-slate-600">₹{item.ptr}</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-slate-600">{item.gst}%</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-red-600">{item.discount}%</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-slate-600">{item.freeQty}</td>
                        <td className="py-2 pr-4 whitespace-nowrap font-medium text-slate-800">{item.acceptedQty}</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-slate-500">{item.rejectedQty}</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-slate-600">{item.expiry}</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-right font-semibold text-slate-800">
                          ₹{calculateItemTotal(item).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          {purchase.items.length > 0 && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Total Accepted Quantity</p>
                <p className="text-xl font-bold text-slate-800">{totalAcceptedQty.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Purchase Value (incl. GST)</p>
                <p className="text-2xl font-bold text-blue-700">₹{totalValue.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
