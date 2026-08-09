"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import {
  ABC_OPTIONS,
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  DEFAULT_MEDICINE_FORM,
  DOSAGE_FORM_OPTIONS,
  ISSUE_UNIT_OPTIONS,
  MANUFACTURER_OPTIONS,
  PURCHASE_UNIT_OPTIONS,
  ROUTE_OPTIONS,
  STATUS_OPTIONS,
  STORAGE_CONDITION_OPTIONS,
  SUB_CATEGORY_OPTIONS,
  SUPPLIER_OPTIONS,
  UNIT_OPTIONS,
  VED_OPTIONS,
} from "@/lib/pharmacy/medicine-data";
import { hasErrors, validateMedicineForm } from "@/lib/pharmacy/medicine-helpers";
import type { Medicine, MedicineFormData } from "@/types/pharmacy/medicine-types";

interface MedicineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMedicine: Medicine | null;
  onSave: (data: MedicineFormData) => void;
}

const SAFETY_FLAGS: { key: keyof MedicineFormData; label: string }[] = [
  { key: "controlledDrug", label: "Controlled Drug" },
  { key: "narcotic", label: "Narcotic" },
  { key: "lasaMedicine", label: "LASA Medicine" },
  { key: "highAlertMedicine", label: "High Alert Medicine" },
  { key: "lookAlikeSoundAlike", label: "Look Alike Sound Alike" },
  { key: "prescriptionRequired", label: "Prescription Required" },
];

export function MedicineFormDialog({ open, onOpenChange, editingMedicine, onSave }: MedicineFormDialogProps) {
  const [formData, setFormData] = useState<MedicineFormData>(DEFAULT_MEDICINE_FORM);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (open) {
      if (editingMedicine) {
        const { id, medicineCode, createdBy, updatedBy, batches, ...rest } = editingMedicine;
        setFormData(rest);
      } else {
        setFormData(DEFAULT_MEDICINE_FORM);
      }
      setErrors({});
    }
  }, [open, editingMedicine]);

  function updateField<K extends keyof MedicineFormData>(key: K, value: MedicineFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
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
      <DialogContent className="!w-[95vw] !max-w-[960px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">
            {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Identity */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Identity</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Medicine Name" required error={errors.medicineName}>
                <Input placeholder="e.g. Paracetamol 650" value={formData.medicineName} onChange={(e) => updateField("medicineName", e.target.value)} />
              </FormField>
              <FormField label="Generic Name" required error={errors.generic}>
                <Input placeholder="e.g. Paracetamol" value={formData.generic} onChange={(e) => updateField("generic", e.target.value)} />
              </FormField>
              <FormField label="Brand Name" required error={errors.brand}>
                <Select value={formData.brand} onValueChange={(v) => updateField("brand", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    {BRAND_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Barcode / QR Code" error={errors.barcode}>
                <Input placeholder="e.g. 8901234567891" value={formData.barcode} onChange={(e) => updateField("barcode", e.target.value)} />
              </FormField>
              <FormField label="Strength" required error={errors.strength}>
                <Input placeholder="e.g. 650 mg" value={formData.strength} onChange={(e) => updateField("strength", e.target.value)} />
              </FormField>
              <FormField label="Dosage Form" required error={errors.dosageForm}>
                <Select value={formData.dosageForm} onValueChange={(v) => updateField("dosageForm", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select dosage form" /></SelectTrigger>
                  <SelectContent>
                    {DOSAGE_FORM_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Pack Size" required error={errors.packSize}>
                <Input placeholder="e.g. 10x10" value={formData.packSize} onChange={(e) => updateField("packSize", e.target.value)} />
              </FormField>
              <FormField label="Unit" required error={errors.unit}>
                <Select value={formData.unit} onValueChange={(v) => updateField("unit", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>
                    {UNIT_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Route" required error={errors.route}>
                <Select value={formData.route} onValueChange={(v) => updateField("route", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
                  <SelectContent>
                    {ROUTE_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="ATC Code (optional)" error={errors.atcCode}>
                <Input placeholder="e.g. N02BE01" value={formData.atcCode} onChange={(e) => updateField("atcCode", e.target.value)} />
              </FormField>
            </div>
          </div>

          {/* Classification & Sourcing */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Classification & Sourcing</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Category" required error={errors.category}>
                <Select value={formData.category} onValueChange={(v) => updateField("category", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Sub Category" required error={errors.subCategory}>
                <Select value={formData.subCategory} onValueChange={(v) => updateField("subCategory", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select sub category" /></SelectTrigger>
                  <SelectContent>
                    {SUB_CATEGORY_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Manufacturer" required error={errors.manufacturer}>
                <Select value={formData.manufacturer} onValueChange={(v) => updateField("manufacturer", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select manufacturer" /></SelectTrigger>
                  <SelectContent>
                    {MANUFACTURER_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Primary Supplier" required error={errors.primarySupplier}>
                <Select value={formData.primarySupplier} onValueChange={(v) => updateField("primarySupplier", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="HSN Code" required error={errors.hsnCode}>
                <Input placeholder="e.g. 30049099" value={formData.hsnCode} onChange={(e) => updateField("hsnCode", e.target.value)} />
              </FormField>
              <FormField label="GST %" required error={errors.gstPercent}>
                <Input type="number" placeholder="e.g. 12" value={formData.gstPercent} onChange={(e) => updateField("gstPercent", e.target.value)} />
              </FormField>
              <FormField label="Purchase Unit" required error={errors.purchaseUnit}>
                <Select value={formData.purchaseUnit} onValueChange={(v) => updateField("purchaseUnit", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select purchase unit" /></SelectTrigger>
                  <SelectContent>
                    {PURCHASE_UNIT_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Issue Unit" required error={errors.issueUnit}>
                <Select value={formData.issueUnit} onValueChange={(v) => updateField("issueUnit", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select issue unit" /></SelectTrigger>
                  <SelectContent>
                    {ISSUE_UNIT_OPTIONS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Storage */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Storage & Location</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Storage Condition" required error={errors.storageCondition}>
                <Select value={formData.storageCondition} onValueChange={(v) => updateField("storageCondition", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                  <SelectContent>
                    {STORAGE_CONDITION_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Storage Temperature" required error={errors.storageTemperature}>
                <Input placeholder="e.g. 15-25°C" value={formData.storageTemperature} onChange={(e) => updateField("storageTemperature", e.target.value)} />
              </FormField>
              <FormField label="Rack" required error={errors.rack}>
                <Input placeholder="e.g. A-04" value={formData.rack} onChange={(e) => updateField("rack", e.target.value)} />
              </FormField>
              <FormField label="Shelf" required error={errors.shelf}>
                <Input placeholder="e.g. S2" value={formData.shelf} onChange={(e) => updateField("shelf", e.target.value)} />
              </FormField>
              <FormField label="Bin" required error={errors.bin}>
                <Input placeholder="e.g. B12" value={formData.bin} onChange={(e) => updateField("bin", e.target.value)} />
              </FormField>
            </div>
          </div>

          {/* Stock Control */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Stock Control</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Minimum Stock" required error={errors.minimumStock}>
                <Input type="number" placeholder="e.g. 100" value={formData.minimumStock} onChange={(e) => updateField("minimumStock", Number(e.target.value))} />
              </FormField>
              <FormField label="Maximum Stock" required error={errors.maximumStock}>
                <Input type="number" placeholder="e.g. 600" value={formData.maximumStock} onChange={(e) => updateField("maximumStock", e.target.value)} />
              </FormField>
              <FormField label="Reorder Level" required error={errors.reorderLevel}>
                <Input type="number" placeholder="e.g. 150" value={formData.reorderLevel} onChange={(e) => updateField("reorderLevel", e.target.value)} />
              </FormField>
              <FormField label="Reserved Stock" error={errors.reservedStock}>
                <Input type="number" placeholder="e.g. 20" value={formData.reservedStock} onChange={(e) => updateField("reservedStock", e.target.value)} />
              </FormField>
              <FormField label="Blocked Stock" error={errors.blockedStock}>
                <Input type="number" placeholder="e.g. 0" value={formData.blockedStock} onChange={(e) => updateField("blockedStock", e.target.value)} />
              </FormField>
              <FormField label="Expiry Alert Days" required error={errors.expiryAlertDays}>
                <Input type="number" placeholder="e.g. 90" value={formData.expiryAlertDays} onChange={(e) => updateField("expiryAlertDays", e.target.value)} />
              </FormField>
              <FormField label="ABC Classification" required error={errors.abcClassification}>
                <Select value={formData.abcClassification} onValueChange={(v) => updateField("abcClassification", (v ?? "") as "A" | "B" | "C" | "")}>
                  <SelectTrigger><SelectValue placeholder="Select ABC" /></SelectTrigger>
                  <SelectContent>
                    {ABC_OPTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="VED Classification" required error={errors.vedClassification}>
                <Select value={formData.vedClassification} onValueChange={(v) => updateField("vedClassification", (v ?? "") as "V" | "E" | "D" | "")}>
                  <SelectTrigger><SelectValue placeholder="Select VED" /></SelectTrigger>
                  <SelectContent>
                    {VED_OPTIONS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Status" required error={errors.status}>
                <Select value={formData.status} onValueChange={(v) => updateField("status", (v ?? "Active") as "Active" | "Inactive")}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Safety Flags */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Safety Flags</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SAFETY_FLAGS.map((flag) => (
                <label key={flag.key} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 cursor-pointer hover:border-blue-300 transition-colors">
                  <Checkbox
                    checked={Boolean(formData[flag.key])}
                    onCheckedChange={(checked) => updateField(flag.key, Boolean(checked) as any)}
                  />
                  <span className="text-sm text-slate-700">{flag.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" onClick={handleSave}>
            {editingMedicine ? "Update Medicine" : "Save Medicine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
