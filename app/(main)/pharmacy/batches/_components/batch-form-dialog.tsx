"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { DEFAULT_BATCH_FORM, MEDICINE_DROPDOWN_OPTIONS, STATUS_OPTIONS } from "@/lib/pharmacy/batch-data";
import { hasErrors, validateBatchForm } from "@/lib/pharmacy/batch-helpers";
import type { BatchFormData, MedicineBatchRecord } from "@/types/pharmacy/batch-types";

interface BatchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBatch: MedicineBatchRecord | null;
  onSave: (data: BatchFormData) => void;
}

export function BatchFormDialog({ open, onOpenChange, editingBatch, onSave }: BatchFormDialogProps) {
  const [formData, setFormData] = useState<BatchFormData>(DEFAULT_BATCH_FORM);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (open) {
      if (editingBatch) {
        const { id, ...rest } = editingBatch;
        setFormData(rest);
      } else {
        setFormData(DEFAULT_BATCH_FORM);
      }
      setErrors({});
    }
  }, [open, editingBatch]);

  function updateField<K extends keyof BatchFormData>(key: K, value: BatchFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleMedicineChange(medicineId: string) {
    const selected = MEDICINE_DROPDOWN_OPTIONS.find((m) => m.id === medicineId);
    setFormData((prev) => ({
      ...prev,
      medicineId,
      medicineName: selected?.name ?? "",
    }));
    if (errors.medicineId) {
      setErrors((prev) => ({ ...prev, medicineId: undefined }));
    }
  }

  function handleSave() {
    const validationErrors = validateBatchForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[860px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">
            {editingBatch ? "Edit Batch" : "Add New Batch"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Batch Identity */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Batch Identity</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Batch Number" required error={errors.batchNumber}>
                <Input placeholder="e.g. P001" value={formData.batchNumber} onChange={(e) => updateField("batchNumber", e.target.value)} />
              </FormField>

              <div className="sm:col-span-1 lg:col-span-2">
                <FormField label="Medicine Name" required error={errors.medicineId}>
                  <Select value={formData.medicineName} onValueChange={(v) => handleMedicineChange(v ?? "")}>
                    <SelectTrigger><SelectValue placeholder="Select medicine" /></SelectTrigger>
                    <SelectContent>
                      {MEDICINE_DROPDOWN_OPTIONS.map((m) => (
                        <SelectItem key={m.name} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField label="Manufacturing Date" required error={errors.manufacturingDate}>
                <Input type="date" value={formData.manufacturingDate} onChange={(e) => updateField("manufacturingDate", e.target.value)} />
              </FormField>

              <FormField label="Expiry Date" required error={errors.expiryDate}>
                <Input type="date" value={formData.expiryDate} onChange={(e) => updateField("expiryDate", e.target.value)} />
              </FormField>

              <FormField label="Location" required error={errors.location}>
                <Input placeholder="e.g. A-04 / S2 / B12" value={formData.location} onChange={(e) => updateField("location", e.target.value)} />
              </FormField>
            </div>
          </div>

          {/* Purchase Reference */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Purchase Reference</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Purchase Invoice" required error={errors.purchaseInvoice}>
                <Input placeholder="e.g. INV-2024-1042" value={formData.purchaseInvoice} onChange={(e) => updateField("purchaseInvoice", e.target.value)} />
              </FormField>
              <FormField label="GRN Number" required error={errors.grnNumber}>
                <Input placeholder="e.g. GRN-2024-0501" value={formData.grnNumber} onChange={(e) => updateField("grnNumber", e.target.value)} />
              </FormField>
              <FormField label="Status" required error={errors.status}>
                <Select value={formData.status} onValueChange={(v) => updateField("status", (v ?? "Active") as BatchFormData["status"])}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Pricing</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Purchase Price (₹)" required error={errors.purchasePrice}>
                <Input type="number" placeholder="e.g. 20" value={formData.purchasePrice} onChange={(e) => updateField("purchasePrice", e.target.value)} />
              </FormField>
              <FormField label="MRP (₹)" required error={errors.mrp}>
                <Input type="number" placeholder="e.g. 28" value={formData.mrp} onChange={(e) => updateField("mrp", e.target.value)} />
              </FormField>
              <FormField label="Selling Price (₹)" required error={errors.sellingPrice}>
                <Input type="number" placeholder="e.g. 25" value={formData.sellingPrice} onChange={(e) => updateField("sellingPrice", e.target.value)} />
              </FormField>
              <FormField label="GST (%)" required error={errors.gst}>
                <Input type="number" placeholder="e.g. 12" value={formData.gst} onChange={(e) => updateField("gst", e.target.value)} />
              </FormField>
              <FormField label="Discount (%)" error={errors.discount}>
                <Input type="number" placeholder="e.g. 5" value={formData.discount} onChange={(e) => updateField("discount", e.target.value)} />
              </FormField>
            </div>
          </div>

          {/* Quantities */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Quantities</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormField label="Received Quantity" required error={errors.receivedQuantity}>
                <Input type="number" placeholder="e.g. 1000" value={formData.receivedQuantity} onChange={(e) => updateField("receivedQuantity", e.target.value)} />
              </FormField>
              <FormField label="Current Quantity" required error={errors.currentQuantity}>
                <Input type="number" placeholder="e.g. 780" value={formData.currentQuantity} onChange={(e) => updateField("currentQuantity", e.target.value)} />
              </FormField>
              <FormField label="Free Quantity" error={errors.freeQuantity}>
                <Input type="number" placeholder="e.g. 20" value={formData.freeQuantity} onChange={(e) => updateField("freeQuantity", e.target.value)} />
              </FormField>
              <FormField label="Rejected Quantity" error={errors.rejectedQuantity}>
                <Input type="number" placeholder="e.g. 0" value={formData.rejectedQuantity} onChange={(e) => updateField("rejectedQuantity", e.target.value)} />
              </FormField>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" onClick={handleSave}>
            {editingBatch ? "Update Batch" : "Save Batch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}