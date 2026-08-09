"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import {
  COUNTRY_OPTIONS,
  DEFAULT_BRAND_FORM,
  STATUS_OPTIONS,
} from "@/lib/pharmacy/category-brand-data";
import { hasErrors, validateBrandForm } from "@/lib/pharmacy/brand-helpers";
import type { BrandFormData, PharmacyBrand } from "@/types/pharmacy/category-brand-types";

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBrand: PharmacyBrand | null;
  onSave: (data: BrandFormData) => void;
}

export function BrandFormDialog({ open, onOpenChange, editingBrand, onSave }: BrandFormDialogProps) {
  const [formData, setFormData] = useState<BrandFormData>(DEFAULT_BRAND_FORM);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (open) {
      setFormData(
        editingBrand
          ? {
              brandName: editingBrand.brandName,
              manufacturer: editingBrand.manufacturer,
              country: editingBrand.country,
              website: editingBrand.website,
              licenseNumber: editingBrand.licenseNumber,
              gst: editingBrand.gst,
              supportContact: editingBrand.supportContact,
              status: editingBrand.status,
            }
          : DEFAULT_BRAND_FORM
      );
      setErrors({});
    }
  }, [open, editingBrand]);

  function updateField<K extends keyof BrandFormData>(key: K, value: BrandFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSave() {
    const validationErrors = validateBrandForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">
            {editingBrand ? "Edit Brand" : "Add New Brand"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
          <FormField label="Brand Name" required error={errors.brandName}>
            <Input
              placeholder="e.g. Pfizer"
              value={formData.brandName}
              onChange={(e) => updateField("brandName", e.target.value)}
            />
          </FormField>

          <FormField label="Manufacturer" required error={errors.manufacturer}>
            <Input
              placeholder="e.g. Pfizer Inc."
              value={formData.manufacturer}
              onChange={(e) => updateField("manufacturer", e.target.value)}
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Country" required error={errors.country}>
              <Select
                value={formData.country}
                onValueChange={(v) => updateField("country", v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField label="Website" required error={errors.website}>
              <Input
                type="url"
                placeholder="e.g. https://www.pfizer.com"
                value={formData.website}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="License Number" required error={errors.licenseNumber}>
            <Input
              placeholder="e.g. LIC-2024-001"
              value={formData.licenseNumber}
              onChange={(e) => updateField("licenseNumber", e.target.value)}
            />
          </FormField>

          <FormField label="GST (%)" required error={errors.gst}>
            <Input
              type="number"
              placeholder="e.g. 12"
              value={formData.gst}
              onChange={(e) => updateField("gst", e.target.value)}
            />
          </FormField>

          <FormField label="Support Contact" required error={errors.supportContact}>
            <Input
              placeholder="e.g. +1-800-555-0100"
              value={formData.supportContact}
              onChange={(e) => updateField("supportContact", e.target.value)}
            />
          </FormField>

          <FormField label="Status" required error={errors.status}>
            <Select
              value={formData.status}
              onValueChange={(v) => updateField("status", (v ?? "Active") as "Active" | "Inactive")}
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
            {editingBrand ? "Update Brand" : "Save Brand"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}