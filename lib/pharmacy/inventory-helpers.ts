// lib/pharmacy/inventory-helpers.ts

import type { InventoryItem, StockAdjustmentFormData, StockAdjustmentErrors } from "@/types/pharmacy/inventory-types";

export function getStatusColor(status: string): string {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-700 border-green-200";
    case "Low Stock":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Out of Stock":
      return "bg-red-100 text-red-700 border-red-200";
    case "Overstock":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function getStockHealthPercent(item: InventoryItem): number {
  if (item.currentStock === 0) return 0;
  return Math.round((item.available / item.currentStock) * 100);
}

export function validateStockAdjustment(data: StockAdjustmentFormData, availableStock: number): StockAdjustmentErrors {
  const errors: StockAdjustmentErrors = {};

  if (!data.adjustmentType) errors.adjustmentType = "Adjustment type is required";

  if (!data.quantity.trim()) {
    errors.quantity = "Quantity is required";
  } else if (isNaN(Number(data.quantity)) || Number(data.quantity) <= 0) {
    errors.quantity = "Enter a valid quantity";
  } else if (Number(data.quantity) > availableStock) {
    errors.quantity = `Quantity cannot exceed available stock (${availableStock})`;
  }

  if (!data.reason.trim()) {
    errors.reason = "Reason is required";
  } else if (data.reason.length < 5) {
    errors.reason = "Please provide a more detailed reason";
  }

  if (data.adjustmentType === "Transferred" && !data.destinationWarehouse) {
    errors.destinationWarehouse = "Destination warehouse is required for transfers";
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}