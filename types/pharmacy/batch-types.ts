// types/pharmacy/batch-types.ts

export interface MedicineBatchRecord {
  id: string;
  batchNumber: string;
  medicineId: string;
  medicineName: string;
  manufacturingDate: string;
  expiryDate: string;
  purchaseInvoice: string;
  grnNumber: string;
  purchasePrice: string;
  mrp: string;
  sellingPrice: string;
  gst: string;
  discount: string;
  receivedQuantity: string;
  currentQuantity: string;
  freeQuantity: string;
  rejectedQuantity: string;
  location: string;
  status: "Active" | "Near Expiry" | "Expired" | "Blocked" | "Inactive";
}

export type BatchFormData = Omit<MedicineBatchRecord, "id">;

export type BatchFormErrors = Partial<Record<keyof BatchFormData, string>>;