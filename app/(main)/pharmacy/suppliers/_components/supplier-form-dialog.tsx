// app/admin/pharmacy/suppliers/_components/supplier-form-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SupplierFormField } from "./supplier-form-field";
import { DEFAULT_SUPPLIER_FORM } from "@/lib/pharmacy/supplier-data";
import { hasValidationErrors, validateSupplierForm } from "@/lib/pharmacy/supplier-validation";
import type { Supplier, SupplierFormData, SupplierFormErrors } from "@/types/pharmacy/supplier-types";

export function SupplierFormDialog({
  open,
  onOpenChange,
  editingSupplier,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSupplier: Supplier | null;
  onSave: (data: SupplierFormData) => void;
}) {
  const [formData, setFormData] = useState<SupplierFormData>(DEFAULT_SUPPLIER_FORM);
  const [errors, setErrors] = useState<SupplierFormErrors>({});

  useEffect(() => {
    if (open) {
      setFormData(
        editingSupplier
          ? {
              supplierName: editingSupplier.supplierName,
              contactPerson: editingSupplier.contactPerson,
              gstNumber: editingSupplier.gstNumber,
              phone: editingSupplier.phone,
              email: editingSupplier.email,
              address: editingSupplier.address,
              paymentTerms: editingSupplier.paymentTerms,
            }
          : DEFAULT_SUPPLIER_FORM
      );
      setErrors({});
    }
  }, [open, editingSupplier]);

  function updateField<K extends keyof SupplierFormData>(key: K, value: SupplierFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSave() {
    const validationErrors = validateSupplierForm(formData);
    if (hasValidationErrors(validationErrors)) {
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
            {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
          <SupplierFormField label="Supplier Name *" error={errors.supplierName}>
            <Input
              placeholder="e.g. Sun Pharma Supply Co."
              value={formData.supplierName}
              onChange={(e) => updateField("supplierName", e.target.value)}
            />
          </SupplierFormField>

          <SupplierFormField label="Contact Person *" error={errors.contactPerson}>
            <Input
              placeholder="e.g. Rakesh Kumar"
              value={formData.contactPerson}
              onChange={(e) => updateField("contactPerson", e.target.value)}
            />
          </SupplierFormField>

          <SupplierFormField label="GST Number *" error={errors.gstNumber}>
            <Input
              placeholder="e.g. 29ABCDE1234F1Z5"
              value={formData.gstNumber}
              onChange={(e) => updateField("gstNumber", e.target.value.toUpperCase())}
              maxLength={15}
            />
          </SupplierFormField>

          <SupplierFormField label="Phone *" error={errors.phone}>
            <Input
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
              maxLength={10}
            />
          </SupplierFormField>

          <SupplierFormField label="Email *" error={errors.email}>
            <Input
              type="email"
              placeholder="e.g. contact@supplier.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </SupplierFormField>

          <SupplierFormField label="Payment Terms *" error={errors.paymentTerms}>
            <Select value={formData.paymentTerms} onValueChange={(v) => updateField("paymentTerms", v ?? "")}>
              <SelectTrigger><SelectValue placeholder="Select payment terms" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Advance Payment">Advance Payment</SelectItem>
                <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                <SelectItem value="Net 15 Days">Net 15 Days</SelectItem>
                <SelectItem value="Net 30 Days">Net 30 Days</SelectItem>
                <SelectItem value="Net 45 Days">Net 45 Days</SelectItem>
                <SelectItem value="Net 60 Days">Net 60 Days</SelectItem>
              </SelectContent>
            </Select>
          </SupplierFormField>

          <div className="sm:col-span-2">
            <SupplierFormField label="Address *" error={errors.address}>
              <Textarea
                rows={3}
                placeholder="Enter full supplier address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </SupplierFormField>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            {editingSupplier ? "Update Supplier" : "Save Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}