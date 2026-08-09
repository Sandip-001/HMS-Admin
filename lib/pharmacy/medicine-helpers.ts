// lib/pharmacy/medicine-helpers.ts

import type { Medicine, MedicineFormData, MedicineFormErrors, MedicineStockStatus } from "@/types/pharmacy/medicine-types";

export function validateMedicineForm(data: MedicineFormData): MedicineFormErrors {
  const errors: MedicineFormErrors = {};

  if (!data.medicineName.trim()) errors.medicineName = "Medicine name is required";
  if (!data.generic.trim()) errors.generic = "Generic name is required";
  if (!data.brand) errors.brand = "Brand is required";
  if (!data.strength.trim()) errors.strength = "Strength is required";
  if (!data.dosageForm) errors.dosageForm = "Dosage form is required";
  if (!data.packSize.trim()) errors.packSize = "Pack size is required";
  if (!data.unit) errors.unit = "Unit is required";
  if (!data.route) errors.route = "Route is required";
  if (!data.category) errors.category = "Category is required";
  if (!data.subCategory) errors.subCategory = "Sub category is required";
  if (!data.manufacturer) errors.manufacturer = "Manufacturer is required";
  if (!data.primarySupplier) errors.primarySupplier = "Primary supplier is required";
  if (!data.hsnCode.trim()) errors.hsnCode = "HSN code is required";

  if (!data.gstPercent.trim()) {
    errors.gstPercent = "GST % is required";
  } else if (isNaN(Number(data.gstPercent)) || Number(data.gstPercent) < 0 || Number(data.gstPercent) > 100) {
    errors.gstPercent = "GST must be between 0 and 100";
  }

  if (!data.purchaseUnit) errors.purchaseUnit = "Purchase unit is required";
  if (!data.issueUnit) errors.issueUnit = "Issue unit is required";
  if (!data.storageCondition) errors.storageCondition = "Storage condition is required";
  if (!data.storageTemperature.trim()) errors.storageTemperature = "Storage temperature is required";

  if (!data.expiryAlertDays.trim()) {
    errors.expiryAlertDays = "Expiry alert days is required";
  } else if (isNaN(Number(data.expiryAlertDays)) || Number(data.expiryAlertDays) < 0) {
    errors.expiryAlertDays = "Enter a valid number of days";
  }

  if (!data.reorderLevel.trim()) {
    errors.reorderLevel = "Reorder level is required";
  } else if (isNaN(Number(data.reorderLevel)) || Number(data.reorderLevel) < 0) {
    errors.reorderLevel = "Enter a valid reorder level";
  }

  if (!data.maximumStock.trim()) {
    errors.maximumStock = "Maximum stock is required";
  } else if (isNaN(Number(data.maximumStock)) || Number(data.maximumStock) < 0) {
    errors.maximumStock = "Enter a valid maximum stock";
  }

  if (data.minimumStock === undefined || data.minimumStock === null || String(data.minimumStock).trim() === "") {
    errors.minimumStock = "Minimum stock is required";
  } else if (isNaN(Number(data.minimumStock)) || Number(data.minimumStock) < 0) {
    errors.minimumStock = "Enter a valid minimum stock";
  }

  if (
    data.maximumStock &&
    data.minimumStock !== undefined &&
    Number(data.minimumStock) > Number(data.maximumStock)
  ) {
    errors.minimumStock = "Minimum stock cannot exceed maximum stock";
  }

  if (!data.rack.trim()) errors.rack = "Rack is required";
  if (!data.shelf.trim()) errors.shelf = "Shelf is required";
  if (!data.bin.trim()) errors.bin = "Bin is required";
  if (!data.abcClassification) errors.abcClassification = "ABC classification is required";
  if (!data.vedClassification) errors.vedClassification = "VED classification is required";
  if (!data.status) errors.status = "Status is required";

  return errors;
}

export function hasErrors(errors: MedicineFormErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

export function getCurrentStock(medicine: Medicine): number {
  return medicine.batches.reduce((sum, batch) => sum + batch.stock, 0);
}

export function getStockStatus(medicine: Medicine): MedicineStockStatus {
  const currentStock = getCurrentStock(medicine);
  if (currentStock <= 0) return "Out of Stock";
  if (currentStock <= medicine.minimumStock) return "Low Stock";
  return "Available";
}

export function getStockStatusColor(status: MedicineStockStatus): string {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700 border-green-200";
    case "Low Stock":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Out of Stock":
      return "bg-red-100 text-red-700 border-red-200";
  }
}

export function getEarliestExpiry(medicine: Medicine): string {
  if (medicine.batches.length === 0) return "N/A";
  return medicine.batches[0].expiryDate;
}