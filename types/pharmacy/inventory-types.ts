// types/pharmacy/inventory-types.ts

export interface InventoryItem {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  category: string;
  warehouse: string;
  unit: string;

  // Stock snapshot
  currentStock: number;   // Total physical stock across all batches
  available: number;      // Stock free to sell/issue
  reserved: number;       // Held for pending orders/prescriptions
  blocked: number;        // On hold (QC, dispute, etc.)
  damaged: number;
  expired: number;

  // Today's movement
  issuedToday: number;
  purchasedToday: number;
  transferred: number;

  // Control
  reorderLevel: number;
  stockValue: string; // ₹ value of current stock
  lastUpdated: string;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Overstock";
}

export type StockAdjustmentType = "Damaged" | "Expired" | "Blocked" | "Transferred" | "Reserved";

export interface StockAdjustmentFormData {
  adjustmentType: StockAdjustmentType | "";
  quantity: string;
  reason: string;
  destinationWarehouse?: string;
}

export type StockAdjustmentErrors = Partial<Record<keyof StockAdjustmentFormData, string>>;