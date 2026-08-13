"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PharmacyCategory } from "@/types/pharmacy/category-brand-types";
import { CalendarDays, Layers, ListTree, Percent, User } from "lucide-react";

interface CategoryViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: PharmacyCategory | null;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">{value ?? "—"}</p>
    </div>
  );
}

export function CategoryViewDialog({ open, onOpenChange, category }: CategoryViewDialogProps) {
  if (!category) return null;

  const medicineTypeColor =
    category.medicineType === "Tablet"
      ? "bg-blue-100 text-blue-700"
      : category.medicineType === "Injection"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {category.categoryName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-slate-800 truncate">
                {category.categoryName}
              </DialogTitle>
              <p className="text-xs text-slate-500">Category ID: {category.categoryId}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                category.status === "Active"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }
            >
              {category.status}
            </Badge>
            <Badge className={medicineTypeColor}>{category.medicineType}</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <ListTree className="w-3 h-3" />
              {category.parentCategory}
            </Badge>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed">{category.description}</p>
          </div>

          {/* Details grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category Details</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Parent Category" value={category.parentCategory} />
              <DetailItem label="Medicine Type" value={category.medicineType} />
              <DetailItem label="Display Order" value={category.displayOrder} />
              <DetailItem label="GST %" value={`${category.gstPercent}%`} />
              <DetailItem label="Medicine Count" value={category.medicineCount ?? 0} />
              <DetailItem label="Status" value={category.status} />
            </div>
          </div>

          {/* Medicine count progress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medicines in this Category</p>
              <span className="text-sm font-bold text-slate-800">{category.medicineCount ?? 0}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, ((category.medicineCount || 0) / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* Audit info */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-slate-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Audit Information</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DetailItem label="Created By" value={category.createdBy} />
              <DetailItem
                label="Created Date"
                value={
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    {category.createdDate}
                  </span>
                }
              />
              <DetailItem
                label="Updated Date"
                value={
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    {category.updatedDate}
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}