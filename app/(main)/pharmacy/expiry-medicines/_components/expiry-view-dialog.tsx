"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ExpiryMedicineRecord } from "@/types/pharmacy/expiry-types";
import { getDaysLeftLabel, getStatusColor, getStockValue } from "@/lib/pharmacy/expiry-helpers";
import {
  AlertTriangle, Calendar, MapPin, Package, ShieldAlert, Truck,
} from "lucide-react";

interface ExpiryViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: ExpiryMedicineRecord | null;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">{value ?? "—"}</p>
    </div>
  );
}

export function ExpiryViewDialog({ open, onOpenChange, record }: ExpiryViewDialogProps) {
  if (!record) return null;

  const flags = [
    { label: "Controlled Drug", active: record.controlledDrug },
    { label: "Narcotic", active: record.narcotic },
    { label: "High Alert", active: record.highAlertMedicine },
  ].filter((f) => f.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[680px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {record.medicineName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-slate-800 truncate">
                {record.medicineName}
              </DialogTitle>
              <p className="text-xs text-slate-500">
                {record.medicineCode} • Batch {record.batchNo}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {record.expiryDateLabel}
            </Badge>
            {flags.map((f) => (
              <Badge key={f.label} className="bg-purple-100 text-purple-700 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {f.label}
              </Badge>
            ))}
          </div>

          {/* Expiry countdown highlight */}
          <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
            record.status === "Expired"
              ? "border-red-200 bg-red-50"
              : record.status === "Critical"
              ? "border-orange-200 bg-orange-50"
              : "border-amber-200 bg-amber-50"
          }`}>
            <AlertTriangle className={`w-8 h-8 flex-shrink-0 ${
              record.status === "Expired" ? "text-red-500" : record.status === "Critical" ? "text-orange-500" : "text-amber-500"
            }`} />
            <div>
              <p className="text-sm font-semibold text-slate-800">{getDaysLeftLabel(record.daysLeft)}</p>
              <p className="text-xs text-slate-500">Expiry date: {record.expiryDateLabel}</p>
            </div>
          </div>

          {/* Medicine details */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medicine Details</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Generic Name" value={record.generic} />
              <DetailItem label="Brand" value={record.brand} />
              <DetailItem label="Strength" value={record.strength} />
              <DetailItem label="Dosage Form" value={record.dosageForm} />
              <DetailItem label="Category" value={record.category} />
              <DetailItem label="Sub Category" value={record.subCategory} />
            </div>
          </div>

          {/* Batch & stock */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Batch & Stock</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Batch No" value={record.batchNo} />
              <DetailItem label="Current Stock" value={record.stock} />
              <DetailItem label="Stock Value" value={`₹${getStockValue(record).toLocaleString()}`} />
              <DetailItem label="Purchase Price" value={`₹${record.purchasePrice}`} />
              <DetailItem label="Selling Price" value={`₹${record.sellingPrice}`} />
              <DetailItem label="MRP" value={`₹${record.mrp}`} />
              <DetailItem label="Manufacturer" value={record.manufacturer} />
              <DetailItem label="Primary Supplier" value={record.primarySupplier} />
              <DetailItem label="Batch Added On" value={record.addedOn} />
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Storage Location</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <DetailItem label="Rack" value={record.rack} />
              <DetailItem label="Shelf" value={record.shelf} />
              <DetailItem label="Bin" value={record.bin} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}