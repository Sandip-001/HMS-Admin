
import type { Medicine, MedicineBatch, MedicineFormData, MedicineFormErrors, MedicineStockStatus } from "@/types/pharmacy/medicine-types";

export function getTotalStock(medicine: Medicine): number {
  return medicine.batches.reduce((sum, b) => sum + b.stock, 0);
}

export function getActiveBatch(medicine: Medicine): MedicineBatch | undefined {
  return medicine.batches.find((b) => b.stock > 0);
}

export function getStockStatus(medicine: Medicine): MedicineStockStatus {
  const total = getTotalStock(medicine);
  if (total === 0) return "Out of Stock";
  if (total <= medicine.minimumStock) return "Low Stock";
  return "Available";
}

export function validateMedicineForm(data: MedicineFormData): MedicineFormErrors {
  const errors: MedicineFormErrors = {};

  if (!data.medicineName.trim()) errors.medicineName = "Medicine name is required";
  if (!data.generic.trim()) errors.generic = "Generic name is required";
  if (!data.category) errors.category = "Please select a category";
  if (!data.brand) errors.brand = "Please select a brand";
  if (!data.supplier) errors.supplier = "Please select a supplier";

  if (!data.minimumStock.trim()) {
    errors.minimumStock = "Minimum stock is required";
  } else if (Number(data.minimumStock) <= 0) {
    errors.minimumStock = "Minimum stock must be greater than 0";
  }

  if (!data.rack.trim()) errors.rack = "Rack location is required";

  return errors;
}

export function hasErrors(errors: MedicineFormErrors): boolean {
  return Object.keys(errors).length > 0;
}