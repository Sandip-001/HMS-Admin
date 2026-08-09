// lib/pharmacy/batch-helpers.ts

import type { BatchFormData, BatchFormErrors } from "@/types/pharmacy/batch-types";

export function validateBatchForm(data: BatchFormData): BatchFormErrors {
  const errors: BatchFormErrors = {};

  if (!data.batchNumber.trim()) errors.batchNumber = "Batch number is required";
  if (!data.medicineId) errors.medicineId = "Medicine is required";

  if (!data.manufacturingDate) {
    errors.manufacturingDate = "Manufacturing date is required";
  }

  if (!data.expiryDate) {
    errors.expiryDate = "Expiry date is required";
  } else if (data.manufacturingDate && new Date(data.expiryDate) <= new Date(data.manufacturingDate)) {
    errors.expiryDate = "Expiry date must be after manufacturing date";
  }

  if (!data.purchaseInvoice.trim()) errors.purchaseInvoice = "Purchase invoice is required";
  if (!data.grnNumber.trim()) errors.grnNumber = "GRN number is required";

  if (!data.purchasePrice.trim()) {
    errors.purchasePrice = "Purchase price is required";
  } else if (isNaN(Number(data.purchasePrice)) || Number(data.purchasePrice) < 0) {
    errors.purchasePrice = "Enter a valid purchase price";
  }

  if (!data.mrp.trim()) {
    errors.mrp = "MRP is required";
  } else if (isNaN(Number(data.mrp)) || Number(data.mrp) < 0) {
    errors.mrp = "Enter a valid MRP";
  }

  if (!data.sellingPrice.trim()) {
    errors.sellingPrice = "Selling price is required";
  } else if (isNaN(Number(data.sellingPrice)) || Number(data.sellingPrice) < 0) {
    errors.sellingPrice = "Enter a valid selling price";
  } else if (Number(data.sellingPrice) > Number(data.mrp)) {
    errors.sellingPrice = "Selling price cannot exceed MRP";
  }

  if (!data.gst.trim()) {
    errors.gst = "GST % is required";
  } else if (isNaN(Number(data.gst)) || Number(data.gst) < 0 || Number(data.gst) > 100) {
    errors.gst = "GST must be between 0 and 100";
  }

  if (data.discount.trim() && (isNaN(Number(data.discount)) || Number(data.discount) < 0 || Number(data.discount) > 100)) {
    errors.discount = "Discount must be between 0 and 100";
  }

  if (!data.receivedQuantity.trim()) {
    errors.receivedQuantity = "Received quantity is required";
  } else if (isNaN(Number(data.receivedQuantity)) || Number(data.receivedQuantity) < 0) {
    errors.receivedQuantity = "Enter a valid received quantity";
  }

  if (!data.currentQuantity.trim()) {
    errors.currentQuantity = "Current quantity is required";
  } else if (isNaN(Number(data.currentQuantity)) || Number(data.currentQuantity) < 0) {
    errors.currentQuantity = "Enter a valid current quantity";
  } else if (Number(data.currentQuantity) > Number(data.receivedQuantity)) {
    errors.currentQuantity = "Current quantity cannot exceed received quantity";
  }

  if (data.freeQuantity.trim() && (isNaN(Number(data.freeQuantity)) || Number(data.freeQuantity) < 0)) {
    errors.freeQuantity = "Enter a valid free quantity";
  }

  if (data.rejectedQuantity.trim() && (isNaN(Number(data.rejectedQuantity)) || Number(data.rejectedQuantity) < 0)) {
    errors.rejectedQuantity = "Enter a valid rejected quantity";
  }

  if (!data.location.trim()) errors.location = "Location is required";
  if (!data.status) errors.status = "Status is required";

  return errors;
}

export function hasErrors(errors: BatchFormErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "Near Expiry":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Expired":
      return "bg-red-100 text-red-700 border-red-200";
    case "Blocked":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function getDaysToExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}