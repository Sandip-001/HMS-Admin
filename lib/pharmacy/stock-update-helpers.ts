// lib/admin/pharmacy/stock-update-helpers.ts
import type { StockUpdateFormData, StockUpdateFormErrors } from "@/types/pharmacy/stock-update-types";

export function calculateTotalAmount(data: StockUpdateFormData): number {
  const purchasePrice = Number(data.purchasePrice) || 0;
  const quantity = Number(data.quantity) || 0;
  const gstPercent = Number(data.gstPercent) || 0;
  const discountPercent = Number(data.discountPercent) || 0;

  const base = purchasePrice * quantity;
  const afterDiscount = base - (base * discountPercent) / 100;
  const afterGst = afterDiscount + (afterDiscount * gstPercent) / 100;

  return Math.round(afterGst * 100) / 100;
}

export function validateStockForm(data: StockUpdateFormData): StockUpdateFormErrors {
  const errors: StockUpdateFormErrors = {};

  if (!data.supplier) errors.supplier = "Please select a supplier";
  if (!data.invoiceNumber.trim()) errors.invoiceNumber = "Invoice number is required";
  if (!data.purchaseDate) errors.purchaseDate = "Purchase date is required";
  if (!data.medicineName) errors.medicineName = "Please select a medicine";
  if (!data.batchNo.trim()) errors.batchNo = "Batch number is required";

  if (!data.purchasePrice.trim()) errors.purchasePrice = "Purchase price is required";
  else if (Number(data.purchasePrice) <= 0) errors.purchasePrice = "Must be greater than 0";

  if (!data.sellingPrice.trim()) errors.sellingPrice = "Selling price is required";
  else if (Number(data.sellingPrice) <= Number(data.purchasePrice)) errors.sellingPrice = "Must be greater than purchase price";

  if (!data.mrp.trim()) errors.mrp = "MRP is required";
  else if (Number(data.mrp) < Number(data.sellingPrice)) errors.mrp = "MRP cannot be less than selling price";

  if (!data.expiryDate) errors.expiryDate = "Expiry date is required";

  if (!data.quantity.trim()) errors.quantity = "Quantity is required";
  else if (Number(data.quantity) <= 0) errors.quantity = "Must be greater than 0";

  if (data.gstPercent.trim() && (Number(data.gstPercent) < 0 || Number(data.gstPercent) > 28)) {
    errors.gstPercent = "GST must be between 0-28%";
  }

  if (data.discountPercent.trim() && (Number(data.discountPercent) < 0 || Number(data.discountPercent) > 100)) {
    errors.discountPercent = "Discount must be between 0-100%";
  }

  return errors;
}

export function hasErrors(errors: StockUpdateFormErrors): boolean {
  return Object.keys(errors).length > 0;
}