// types/pharmacy/purchase-types.ts

export interface PurchaseItem {
  itemId: string;
  medicineId: string;
  medicineName: string;
  batch: string;
  mrp: string;
  ptr: string;
  pts: string;
  gst: string;
  discount: string;
  freeQty: string;
  acceptedQty: string;
  rejectedQty: string;
  expiry: string;
  manufacture: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber?: string; // Auto-generated from backend
  grnNumber: string;
  invoice: string;
  supplierId: string;
  supplierName: string;
  purchaseDate: string;
  receivedDate: string;
  paymentMode: "Cash" | "Cheque" | "Bank Transfer" | "UPI" | "Credit" | "";
  warehouse: string;
  remarks: string;
  status: "Draft" | "Pending" | "Received" | "Completed" | "Cancelled";
  items: PurchaseItem[];
}

export type PurchaseFormData = Omit<PurchaseOrder, "id" | "poNumber">;

export type PurchaseFormErrors = Partial<Record<keyof Omit<PurchaseFormData, "items">, string>>;

export type PurchaseItemErrors = Partial<Record<keyof Omit<PurchaseItem, "itemId">, string>>;