// app/admin/pharmacy/stock-update/_components/stock-form-dialog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StockFormField } from "./stock-form-field";
import {
  DEFAULT_STOCK_FORM, MEDICINE_OPTIONS, SUPPLIER_OPTIONS,
} from "@/lib/pharmacy/stock-update-data";
import { calculateTotalAmount, hasErrors, validateStockForm } from "@/lib/pharmacy/stock-update-helpers";
import type { StockUpdateEntry, StockUpdateFormData, StockUpdateFormErrors } from "@/types/pharmacy/stock-update-types";

export function StockFormDialog({
  open, onOpenChange, editingEntry, onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntry: StockUpdateEntry | null;
  onSave: (data: StockUpdateFormData) => void;
}) {
  const [formData, setFormData] = useState<StockUpdateFormData>(DEFAULT_STOCK_FORM);
  const [errors, setErrors] = useState<StockUpdateFormErrors>({});

  useEffect(() => {
    if (open) {
      setFormData(
        editingEntry
          ? {
              supplier: editingEntry.supplier,
              invoiceNumber: editingEntry.invoiceNumber,
              purchaseDate: editingEntry.purchaseDate,
              medicineName: editingEntry.medicineName,
              batchNo: editingEntry.batchNo,
              purchasePrice: String(editingEntry.purchasePrice),
              sellingPrice: String(editingEntry.sellingPrice),
              mrp: String(editingEntry.mrp),
              expiryDate: editingEntry.expiryDate,
              quantity: String(editingEntry.quantity),
              gstPercent: String(editingEntry.gstPercent),
              discountPercent: String(editingEntry.discountPercent),
              status: editingEntry.status,
            }
          : DEFAULT_STOCK_FORM
      );
      setErrors({});
    }
  }, [open, editingEntry]);

  const totalAmount = useMemo(() => calculateTotalAmount(formData), [formData]);

  function updateField<
  K extends keyof StockUpdateFormData & keyof StockUpdateFormErrors
>(key: K, value: StockUpdateFormData[K]) {
  setFormData((prev) => ({ ...prev, [key]: value }));
  if (errors[key]) {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }
}

  function handleSave() {
    const validationErrors = validateStockForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[94vw] sm:!w-[90vw] !max-w-[760px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4">
          <DialogTitle className="text-base font-semibold text-slate-800">
            {editingEntry ? "Edit Stock Entry" : "Update Stock"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-4 py-4 sm:px-5 sm:py-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Purchase Details</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StockFormField label="Supplier *" error={errors.supplier}>
                <Select value={formData.supplier} onValueChange={(v) => updateField("supplier", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </StockFormField>

              <StockFormField label="Invoice Number *" error={errors.invoiceNumber}>
                <Input placeholder="e.g. INV-2024-1042" value={formData.invoiceNumber} onChange={(e) => updateField("invoiceNumber", e.target.value)} />
              </StockFormField>

              <StockFormField label="Purchase Date *" error={errors.purchaseDate}>
                <Input type="date" value={formData.purchaseDate} onChange={(e) => updateField("purchaseDate", e.target.value)} />
              </StockFormField>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Medicine & Batch Details</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StockFormField label="Medicine Name *" error={errors.medicineName}>
                <Select value={formData.medicineName} onValueChange={(v) => updateField("medicineName", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select medicine" /></SelectTrigger>
                  <SelectContent>
                    {MEDICINE_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </StockFormField>

              <StockFormField label="Batch No *" error={errors.batchNo}>
                <Input placeholder="e.g. P004" value={formData.batchNo} onChange={(e) => updateField("batchNo", e.target.value)} />
              </StockFormField>

              <StockFormField label="Expiry Date *" error={errors.expiryDate}>
                <Input type="date" value={formData.expiryDate} onChange={(e) => updateField("expiryDate", e.target.value)} />
              </StockFormField>

              <StockFormField label="Purchase Price (₹) *" error={errors.purchasePrice}>
                <Input type="number" placeholder="e.g. 38" value={formData.purchasePrice} onChange={(e) => updateField("purchasePrice", e.target.value)} />
              </StockFormField>

              <StockFormField label="Selling Price (₹) *" error={errors.sellingPrice}>
                <Input type="number" placeholder="e.g. 44" value={formData.sellingPrice} onChange={(e) => updateField("sellingPrice", e.target.value)} />
              </StockFormField>

              <StockFormField label="MRP (₹) *" error={errors.mrp}>
                <Input type="number" placeholder="e.g. 57" value={formData.mrp} onChange={(e) => updateField("mrp", e.target.value)} />
              </StockFormField>

              <StockFormField label="Quantity *" error={errors.quantity}>
                <Input type="number" placeholder="e.g. 150" value={formData.quantity} onChange={(e) => updateField("quantity", e.target.value)} />
              </StockFormField>

              <StockFormField label="GST (%)" error={errors.gstPercent}>
                <Input type="number" placeholder="e.g. 12" value={formData.gstPercent} onChange={(e) => updateField("gstPercent", e.target.value)} />
              </StockFormField>

              <StockFormField label="Discount (%)" error={errors.discountPercent}>
                <Input type="number" placeholder="e.g. 5" value={formData.discountPercent} onChange={(e) => updateField("discountPercent", e.target.value)} />
              </StockFormField>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-slate-500">Total Amount (auto-calculated)</p>
                <p className="text-2xl font-bold text-slate-900">₹{totalAmount.toLocaleString()}</p>
              </div>

              <div className="w-full sm:w-52">
                <StockFormField label="Status *">
                  <Select value={formData.status} onValueChange={(v) => updateField("status", v as "Paid" | "Unpaid")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </StockFormField>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            {editingEntry ? "Update Entry" : "Save Stock Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}