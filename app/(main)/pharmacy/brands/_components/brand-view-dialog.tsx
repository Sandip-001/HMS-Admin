"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PharmacyBrand } from "@/types/pharmacy/category-brand-types";
import { Building2, CalendarDays, Globe, Hash, Percent, Phone } from "lucide-react";

interface BrandViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: PharmacyBrand | null;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">{value ?? "—"}</p>
    </div>
  );
}

export function BrandViewDialog({ open, onOpenChange, brand }: BrandViewDialogProps) {
  if (!brand) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {brand.brandName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-slate-800 truncate">
                {brand.brandName}
              </DialogTitle>
              <p className="text-xs text-slate-500">Brand ID: {brand.brandId}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                brand.status === "Active"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }
            >
              {brand.status}
            </Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {brand.country}
            </Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <Percent className="w-3 h-3" />
              GST {brand.gst}%
            </Badge>
          </div>

          {/* Manufacturer & Contact */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Manufacturer & Contact</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Manufacturer" value={brand.manufacturer} />
              <DetailItem label="Country" value={brand.country} />
              <DetailItem
                label="Support Contact"
                value={
                  <a href={`tel:${brand.supportContact}`} className="text-blue-600 hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {brand.supportContact}
                  </a>
                }
              />
              <DetailItem
                label="Website"
                value={
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Visit site
                  </a>
                }
              />
              <DetailItem
                label="License Number"
                value={
                  <span className="flex items-center gap-1 font-mono">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    {brand.licenseNumber}
                  </span>
                }
              />
              <DetailItem label="GST %" value={`${brand.gst}%`} />
            </div>
          </div>

          {/* Medicine count progress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medicines Supplied</p>
              <span className="text-sm font-bold text-slate-800">{brand.medicineCount ?? 0}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, ((brand.medicineCount || 0) / 300) * 100)}%` }}
              />
            </div>
          </div>

          {/* Audit info */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Record Information</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem label="Brand ID" value={brand.brandId} />
              <DetailItem label="Created Date" value={brand.createdDate} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}