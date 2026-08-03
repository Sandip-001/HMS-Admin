// app/admin/pharmacy/medicines/_components/medicine-form-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MedicineFormField } from "./medicine-form-field";
import {
  BRAND_OPTIONS, CATEGORY_OPTIONS, DEFAULT_MEDICINE_FORM, SUPPLIER_OPTIONS,
} from "@/lib/pharmacy/medicine-data";
import { hasErrors, validateMedicineForm } from "@/lib/pharmacy/medicine-helpers";
import type { Medicine, MedicineFormData, MedicineFormErrors } from "@/types/pharmacy/medicine-types";

export function MedicineFormDialog({
  open,
  onOpenChange,
  editingMedicine,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMedicine: Medicine | null;
  onSave: (data: MedicineFormData) => void;
}) {
  const [formData, setFormData] = useState<MedicineFormData>(DEFAULT_MEDICINE_FORM);
  const [errors, setErrors] = useState<MedicineFormErrors>({});

  useEffect(() => {
    if (open) {
      setFormData(
        editingMedicine
          ? {
              medicineName: editingMedicine.medicineName,
              generic: editingMedicine.generic,
              category: editingMedicine.category,
              brand: editingMedicine.brand,
              supplier: editingMedicine.supplier,
              minimumStock: String(editingMedicine.minimumStock),
              rack: editingMedicine.rack,
            }
          : DEFAULT_MEDICINE_FORM
      );
      setErrors({});
    }
  }, [open, editingMedicine]);

  function updateField<K extends keyof MedicineFormData>(key: K, value: MedicineFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSave() {
    const validationErrors = validateMedicineForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">
            {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
          <MedicineFormField label="Medicine Name *" error={errors.medicineName}>
            <Input placeholder="e.g. Paracetamol 650" value={formData.medicineName} onChange={(e) => updateField("medicineName", e.target.value)} />
          </MedicineFormField>

          <MedicineFormField label="Generic *" error={errors.generic}>
            <Input placeholder="e.g. Paracetamol" value={formData.generic} onChange={(e) => updateField("generic", e.target.value)} />
          </MedicineFormField>

          <MedicineFormField label="Category *" error={errors.category}>
            <Select value={formData.category} onValueChange={(v) => updateField("category", v ?? "")}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </MedicineFormField>

          <MedicineFormField label="Brand *" error={errors.brand}>
            <Select value={formData.brand} onValueChange={(v) => updateField("brand", v ?? "")}>
              <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
              <SelectContent>
                {BRAND_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </MedicineFormField>

          <MedicineFormField label="Supplier *" error={errors.supplier}>
            <Select value={formData.supplier} onValueChange={(v) => updateField("supplier", v ?? "")}>
              <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
              <SelectContent>
                {SUPPLIER_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </MedicineFormField>

          <MedicineFormField label="Minimum Stock *" error={errors.minimumStock}>
            <Input
              type="number"
              placeholder="e.g. 100"
              value={formData.minimumStock}
              onChange={(e) => updateField("minimumStock", e.target.value)}
            />
          </MedicineFormField>

          <MedicineFormField label="Rack *" error={errors.rack}>
            <Input placeholder="e.g. A-04" value={formData.rack} onChange={(e) => updateField("rack", e.target.value)} />
          </MedicineFormField>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            {editingMedicine ? "Update Medicine" : "Save Medicine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}