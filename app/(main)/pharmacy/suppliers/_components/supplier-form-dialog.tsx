"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import {
  PAYMENT_TERMS_OPTIONS,
  DEFAULT_SUPPLIER_FORM,
  STATUS_OPTIONS,
  SUPPLIER_TYPE_OPTIONS,
} from "@/lib/pharmacy/supplier-data";
import { hasErrors, validateSupplierForm } from "@/lib/pharmacy/supplier-helpers";
import type { SupplierFormData, PharmacySupplier } from "@/types/pharmacy/supplier-types";

interface SupplierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSupplier: PharmacySupplier | null;
  onSave: (data: SupplierFormData) => void;
}

export function SupplierFormDialog({ open, onOpenChange, editingSupplier, onSave }: SupplierFormDialogProps) {
  const [formData, setFormData] = useState<SupplierFormData>(DEFAULT_SUPPLIER_FORM);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (open) {
      setFormData(
        editingSupplier
          ? {
              supplierName: editingSupplier.supplierName,
              phone: editingSupplier.phone,
              email: editingSupplier.email,
              address: editingSupplier.address,
              supplierType: editingSupplier.supplierType,
              drugLicenseNumber: editingSupplier.drugLicenseNumber,
              gst: editingSupplier.gst,
              pan: editingSupplier.pan,
              bankDetails: editingSupplier.bankDetails,
              ifsc: editingSupplier.ifsc,
              creditLimit: editingSupplier.creditLimit,
              creditDays: editingSupplier.creditDays,
              paymentTerms: editingSupplier.paymentTerms,
              outstandingAmount: editingSupplier.outstandingAmount,
              performanceRating: editingSupplier.performanceRating,
              lastPurchaseDate: editingSupplier.lastPurchaseDate,
              activeStatus: editingSupplier.activeStatus,
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
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">
            {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FormField label="Supplier Name" required error={errors.supplierName}>
              <Input
                placeholder="e.g. MediCare Distributors"
                value={formData.supplierName}
                onChange={(e) => updateField("supplierName", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Supplier Type" required error={errors.supplierType}>
            <Select
              value={formData.supplierType}
              onValueChange={(v) => updateField("supplierType", v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIER_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Phone" required error={errors.phone}>
            <Input
              placeholder="+91-9876543210"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </FormField>

          <FormField label="Email" required error={errors.email}>
            <Input
              type="email"
              placeholder="contact@supplier.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </FormField>

          <FormField label="Drug License Number" required error={errors.drugLicenseNumber}>
            <Input
              placeholder="DL-2024-XX-XXXXXX"
              value={formData.drugLicenseNumber}
              onChange={(e) => updateField("drugLicenseNumber", e.target.value)}
            />
          </FormField>

          <div className="lg:col-span-2">
            <FormField label="Address" required error={errors.address}>
              <Textarea
                placeholder="Enter complete address..."
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="min-h-[80px]"
              />
            </FormField>
          </div>

          <FormField label="GST Number" required error={errors.gst}>
            <Input
              placeholder="27AABCU9603R1ZM"
              value={formData.gst}
              onChange={(e) => updateField("gst", e.target.value.toUpperCase())}
            />
          </FormField>

          <FormField label="PAN" required error={errors.pan}>
            <Input
              placeholder="AABCU9603R"
              value={formData.pan}
              onChange={(e) => updateField("pan", e.target.value.toUpperCase())}
            />
          </FormField>

          <FormField label="Bank Details" required error={errors.bankDetails}>
            <Input
              placeholder="Bank Name, Account Number"
              value={formData.bankDetails}
              onChange={(e) => updateField("bankDetails", e.target.value)}
            />
          </FormField>

          <FormField label="IFSC Code" required error={errors.ifsc}>
            <Input
              placeholder="HDFC0001234"
              value={formData.ifsc}
              onChange={(e) => updateField("ifsc", e.target.value.toUpperCase())}
            />
          </FormField>

          <FormField label="Credit Limit (₹)" required error={errors.creditLimit}>
            <Input
              type="number"
              placeholder="500000"
              value={formData.creditLimit}
              onChange={(e) => updateField("creditLimit", e.target.value)}
            />
          </FormField>

          <FormField label="Credit Days" required error={errors.creditDays}>
            <Input
              type="number"
              placeholder="30"
              value={formData.creditDays}
              onChange={(e) => updateField("creditDays", e.target.value)}
            />
          </FormField>

          <FormField label="Payment Terms" required error={errors.paymentTerms}>
            <Select
              value={formData.paymentTerms}
              onValueChange={(v) => updateField("paymentTerms", v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select terms" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TERMS_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Outstanding Amount (₹)" error={errors.outstandingAmount}>
            <Input
              type="number"
              placeholder="0"
              value={formData.outstandingAmount}
              onChange={(e) => updateField("outstandingAmount", e.target.value)}
            />
          </FormField>

          <FormField label="Performance Rating (0-5)" required error={errors.performanceRating}>
            <Input
              type="number"
              placeholder="4.5"
              step="0.1"
              min="0"
              max="5"
              value={formData.performanceRating}
              onChange={(e) => updateField("performanceRating", e.target.value)}
            />
          </FormField>

          <FormField label="Last Purchase Date" required error={errors.lastPurchaseDate}>
            <Input
              type="date"
              value={formData.lastPurchaseDate}
              onChange={(e) => updateField("lastPurchaseDate", e.target.value)}
            />
          </FormField>

          <FormField label="Active Status" required error={errors.activeStatus}>
            <Select
              value={formData.activeStatus}
              onValueChange={(v) => updateField("activeStatus", (v ?? "Active") as "Active" | "Inactive")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" onClick={handleSave}>
            {editingSupplier ? "Update Supplier" : "Save Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
