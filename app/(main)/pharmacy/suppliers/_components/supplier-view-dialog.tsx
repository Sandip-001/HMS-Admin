"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PharmacySupplier } from "@/types/pharmacy/supplier-types";
import {
  Building2, CalendarDays, CreditCard, FileText, Hash, IndianRupee,
  Landmark, Mail, MapPin, Phone, Star, Truck,
} from "lucide-react";

interface SupplierViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: PharmacySupplier | null;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">{value ?? "—"}</p>
    </div>
  );
}

export function SupplierViewDialog({ open, onOpenChange, supplier }: SupplierViewDialogProps) {
  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[720px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {supplier.supplierName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-slate-800 truncate">
                {supplier.supplierName}
              </DialogTitle>
              <p className="text-xs text-slate-500 font-mono">{supplier.supplierCode}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                supplier.activeStatus === "Active"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }
            >
              {supplier.activeStatus}
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {supplier.supplierType}
            </Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {supplier.performanceRating} Rating
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact Information</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem
                label="Phone"
                value={
                  <a href={`tel:${supplier.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {supplier.phone}
                  </a>
                }
              />
              <DetailItem
                label="Email"
                value={
                  <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {supplier.email}
                  </a>
                }
              />
              <div className="sm:col-span-2">
                <DetailItem
                  label="Address"
                  value={
                    <span className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="whitespace-normal">{supplier.address}</span>
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          {/* Compliance & Banking */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compliance & Banking</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Drug License No." value={supplier.drugLicenseNumber} />
              <DetailItem label="GST Number" value={<span className="font-mono">{supplier.gst}</span>} />
              <DetailItem label="PAN" value={<span className="font-mono">{supplier.pan}</span>} />
              <div className="col-span-2">
                <DetailItem
                  label="Bank Details"
                  value={
                    <span className="flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-slate-400" />
                      {supplier.bankDetails}
                    </span>
                  }
                />
              </div>
              <DetailItem label="IFSC Code" value={<span className="font-mono">{supplier.ifsc}</span>} />
            </div>
          </div>

          {/* Financial Terms */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Financial Terms</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Credit Limit" value={`₹${Number(supplier.creditLimit).toLocaleString()}`} />
              <DetailItem label="Credit Days" value={`${supplier.creditDays} days`} />
              <DetailItem
                label="Payment Terms"
                value={
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    {supplier.paymentTerms}
                  </span>
                }
              />
              <DetailItem
                label="Outstanding Amount"
                value={<span className="text-orange-600 font-semibold">₹{Number(supplier.outstandingAmount).toLocaleString()}</span>}
              />
              <DetailItem
                label="Last Purchase Date"
                value={
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    {supplier.lastPurchaseDate}
                  </span>
                }
              />
              <DetailItem
                label="Performance Rating"
                value={
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {supplier.performanceRating} / 5
                  </span>
                }
              />
            </div>
          </div>

          {/* Record Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Record Information</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Supplier Code" value={supplier.supplierCode} />
              <DetailItem label="Supplier Type" value={supplier.supplierType} />
              <DetailItem label="Created Date" value={supplier.createdDate} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}