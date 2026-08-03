// app/admin/pharmacy/suppliers/_components/supplier-card.tsx
"use client";

import { Building2, Mail, MapPin, Phone, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Supplier } from "@/types/pharmacy/supplier-types";

export function SupplierCard({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: Supplier;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">{supplier.supplierName}</p>
            <p className="text-xs text-slate-400">{supplier.contactPerson}</p>
          </div>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-blue-50 hover:text-blue-600" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2.5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {supplier.phone}
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {supplier.email}
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-2">{supplier.address}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <Badge className="bg-slate-50 text-slate-600 hover:bg-slate-50">GST: {supplier.gstNumber}</Badge>
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{supplier.paymentTerms}</Badge>
      </div>
    </div>
  );
}