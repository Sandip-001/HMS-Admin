// lib/pharmacy/category-helpers.ts

import type { CategoryFormData, CategoryFormErrors } from "@/types/pharmacy/category-brand-types";

export function validateCategoryForm(data: CategoryFormData): CategoryFormErrors {
  const errors: CategoryFormErrors = {};

  if (!data.categoryName.trim()) {
    errors.categoryName = "Category name is required";
  } else if (data.categoryName.length < 2) {
    errors.categoryName = "Category name must be at least 2 characters";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required";
  } else if (data.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!data.parentCategory) {
    errors.parentCategory = "Parent category is required";
  }

  if (!data.medicineType) {
    errors.medicineType = "Medicine type is required";
  }

  if (!data.gstPercent) {
    errors.gstPercent = "GST percentage is required";
  } else {
    const gst = Number(data.gstPercent);
    if (isNaN(gst) || gst < 0 || gst > 100) {
      errors.gstPercent = "GST must be between 0 and 100";
    }
  }

  if (!data.status) {
    errors.status = "Status is required";
  }

  if (!data.displayOrder) {
    errors.displayOrder = "Display order is required";
  } else {
    const order = Number(data.displayOrder);
    if (isNaN(order) || order < 1) {
      errors.displayOrder = "Display order must be a positive number";
    }
  }

  return errors;
}

export function hasErrors(errors: CategoryFormErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}