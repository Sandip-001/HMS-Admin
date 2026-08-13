"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { MedicineBatchRecord } from "@/types/pharmacy/batch-types";
import { getDaysToExpiry, getStatusColor } from "@/lib/pharmacy/batch-helpers";
import {
  AlertTriangle, Calendar, FileText, IndianRupee, MapPin, Package,
} from "lucide-react";

interface BatchViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: MedicineBatchRecord | null;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">{value ?? "—"}</p>
    </div>
  );
}

export function BatchViewDialog({ open, onOpenChange, batch }: BatchViewDialogProps) {
  if (!batch) return null;

  const daysLeft = getDaysToExpiry(batch.expiryDate);
  const daysLeftLabel =
    daysLeft < 0
      ? `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago`
      : daysLeft === 0
      ? "Expires today"
      : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[680px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {batch.batchNumber.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-slate-800 truncate">
                Batch {batch.batchNumber}
              </DialogTitle>
              <p className="text-xs text-slate-500 truncate">{batch.medicineName}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {batch.expiryDate}
            </Badge>
          </div>

          {/* Expiry countdown highlight */}
          <div
            className={`rounded-2xl border p-4 flex items-center gap-3 ${
              daysLeft < 0
                ? "border-red-200 bg-red-50"
                : daysLeft <= 90
                ? "border-amber-200 bg-amber-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            <AlertTriangle
              className={`w-8 h-8 flex-shrink-0 ${
                daysLeft < 0 ? "text-red-500" : daysLeft <= 90 ? "text-amber-500" : "text-green-500"
              }`}
            />
            <div>
              <p className="text-sm font-semibold text-slate-800">{daysLeftLabel}</p>
              <p className="text-xs text-slate-500">Manufactured: {batch.manufacturingDate}</p>
            </div>
          </div>

          {/* Purchase reference */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Purchase Reference</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Medicine" value={batch.medicineName} />
              <DetailItem label="Purchase Invoice" value={batch.purchaseInvoice} />
              <DetailItem label="GRN Number" value={batch.grnNumber} />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pricing</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Purchase Price" value={`₹${batch.purchasePrice}`} />
              <DetailItem label="MRP" value={`₹${batch.mrp}`} />
              <DetailItem label="Selling Price" value={`₹${batch.sellingPrice}`} />
              <DetailItem label="GST %" value={`${batch.gst}%`} />
              <DetailItem label="Discount %" value={`${batch.discount}%`} />
            </div>
          </div>

          {/* Quantities */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quantities</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <DetailItem label="Received Qty" value={batch.receivedQuantity} />
              <DetailItem label="Current Qty" value={batch.currentQuantity} />
              <DetailItem label="Free Qty" value={batch.freeQuantity} />
              <DetailItem label="Rejected Qty" value={batch.rejectedQuantity} />
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Storage Location</p>
            </div>
            <DetailItem label="Location" value={batch.location} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}