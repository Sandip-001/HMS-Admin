// lib/pharmacy/purchase-helpers.ts

import type {
  PurchaseFormData,
  PurchaseFormErrors,
  PurchaseItem,
  PurchaseItemErrors,
} from "@/types/pharmacy/purchase-types";

export function validatePurchaseForm(data: PurchaseFormData): PurchaseFormErrors {
  const errors: PurchaseFormErrors = {};

  if (!data.supplierId) errors.supplierId = "Supplier is required";
  if (!data.purchaseDate) errors.purchaseDate = "Purchase date is required";

  if (data.receivedDate && data.purchaseDate && new Date(data.receivedDate) < new Date(data.purchaseDate)) {
    errors.receivedDate = "Received date cannot be before purchase date";
  }

  if (!data.paymentMode) errors.paymentMode = "Payment mode is required";
  if (!data.warehouse) errors.warehouse = "Warehouse is required";

  return errors;
}

export function validatePurchaseItem(item: Omit<PurchaseItem, "itemId">): PurchaseItemErrors {
  const errors: PurchaseItemErrors = {};

  if (!item.medicineId) errors.medicineId = "Medicine is required";
  if (!item.batch.trim()) errors.batch = "Batch is required";

  if (!item.mrp.trim()) {
    errors.mrp = "MRP is required";
  } else if (isNaN(Number(item.mrp)) || Number(item.mrp) < 0) {
    errors.mrp = "Enter a valid MRP";
  }

  if (!item.ptr.trim()) {
    errors.ptr = "PTR is required";
  } else if (isNaN(Number(item.ptr)) || Number(item.ptr) < 0) {
    errors.ptr = "Enter a valid PTR";
  }

  if (!item.pts.trim()) {
    errors.pts = "PTS is required";
  } else if (isNaN(Number(item.pts)) || Number(item.pts) < 0) {
    errors.pts = "Enter a valid PTS";
  }

  if (!item.gst.trim()) {
    errors.gst = "GST % is required";
  } else if (isNaN(Number(item.gst)) || Number(item.gst) < 0 || Number(item.gst) > 100) {
    errors.gst = "GST must be between 0 and 100";
  }

  if (item.discount.trim() && (isNaN(Number(item.discount)) || Number(item.discount) < 0 || Number(item.discount) > 100)) {
    errors.discount = "Discount must be between 0 and 100";
  }

  if (!item.acceptedQty.trim()) {
    errors.acceptedQty = "Accepted quantity is required";
  } else if (isNaN(Number(item.acceptedQty)) || Number(item.acceptedQty) < 0) {
    errors.acceptedQty = "Enter a valid accepted quantity";
  }

  if (item.rejectedQty.trim() && (isNaN(Number(item.rejectedQty)) || Number(item.rejectedQty) < 0)) {
    errors.rejectedQty = "Enter a valid rejected quantity";
  }

  if (!item.expiry) errors.expiry = "Expiry date is required";
  if (!item.manufacture) errors.manufacture = "Manufacture date is required";

  if (item.manufacture && item.expiry && new Date(item.expiry) <= new Date(item.manufacture)) {
    errors.expiry = "Expiry must be after manufacture date";
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "Received":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function calculateItemTotal(item: Omit<PurchaseItem, "itemId">): number {
  const ptr = Number(item.ptr) || 0;
  const qty = Number(item.acceptedQty) || 0;
  const gst = Number(item.gst) || 0;
  const discount = Number(item.discount) || 0;
  const base = ptr * qty;
  const afterDiscount = base - (base * discount) / 100;
  const withGst = afterDiscount + (afterDiscount * gst) / 100;
  return Math.round(withGst * 100) / 100;
}

export function calculatePurchaseTotal(items: Omit<PurchaseItem, "itemId">[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

export function calculateTotalAcceptedQty(items: Omit<PurchaseItem, "itemId">[]): number {
  return items.reduce((sum, item) => sum + (Number(item.acceptedQty) || 0), 0);
}