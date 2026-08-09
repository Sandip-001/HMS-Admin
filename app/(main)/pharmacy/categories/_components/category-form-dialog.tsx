"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFormField } from "./category-form-field";
import {
  CATEGORY_OPTIONS,
  DEFAULT_CATEGORY_FORM,
  PARENT_CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/pharmacy/category-brand-data";
import { hasErrors, validateCategoryForm } from "@/lib/pharmacy/category-helpers";
import type { CategoryFormData, PharmacyCategory } from "@/types/pharmacy/category-brand-types";

export function CategoryFormDialog({
  open,
  onOpenChange,
  editingCategory,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: PharmacyCategory | null;
  onSave: (data: CategoryFormData) => void;
}) {
  const [formData, setFormData] = useState<CategoryFormData>(DEFAULT_CATEGORY_FORM);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (open) {
      setFormData(
        editingCategory
          ? {
              categoryName: editingCategory.categoryName,
              description: editingCategory.description,
              parentCategory: editingCategory.parentCategory,
              medicineType: editingCategory.medicineType,
              gstPercent: editingCategory.gstPercent,
              status: editingCategory.status,
              displayOrder: editingCategory.displayOrder,
            }
          : DEFAULT_CATEGORY_FORM
      );
      setErrors({});
    }
  }, [open, editingCategory]);

  function updateField<K extends keyof CategoryFormData>(
    key: K,
    value: CategoryFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSave() {
    const validationErrors = validateCategoryForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[720px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
          <CategoryFormField label="Category Name *" error={errors.categoryName}>
            <Input
              placeholder="e.g. Antibiotics"
              value={formData.categoryName}
              onChange={(e) => updateField("categoryName", e.target.value)}
            />
          </CategoryFormField>

          <CategoryFormField label="Parent Category *" error={errors.parentCategory}>
            <Select
              value={formData.parentCategory}
              onValueChange={(v) => updateField("parentCategory", v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                {PARENT_CATEGORY_OPTIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CategoryFormField>

          <div className="sm:col-span-2">
            <CategoryFormField label="Description *" error={errors.description}>
              <Textarea
                placeholder="Enter category description..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="min-h-[80px]"
              />
            </CategoryFormField>
          </div>

          <CategoryFormField label="Medicine Type *" error={errors.medicineType}>
            <Select
              value={formData.medicineType}
              onValueChange={(v) => updateField("medicineType", v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select medicine type" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CategoryFormField>

          <CategoryFormField label="GST (%)" error={errors.gstPercent}>
            <Input
              type="number"
              placeholder="e.g. 12"
              value={formData.gstPercent}
              onChange={(e) => updateField("gstPercent", e.target.value)}
            />
          </CategoryFormField>

          <CategoryFormField label="Status *" error={errors.status}>
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
          </CategoryFormField>

          <CategoryFormField label="Display Order *" error={errors.displayOrder}>
            <Input
              type="number"
              placeholder="e.g. 1"
              value={formData.displayOrder}
              onChange={(e) => updateField("displayOrder", e.target.value)}
            />
          </CategoryFormField>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
          >
            {editingCategory ? "Update Category" : "Save Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}