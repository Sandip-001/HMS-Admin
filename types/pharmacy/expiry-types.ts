// types/pharmacy/expiry-types.ts

export type ExpiryStatus = "Expired" | "Critical" | "Near Expiry";

export interface ExpiryMedicineRecord {
  // Composite identity
  recordId: string; // `${medicineId}-${batchId}`
  medicineId: string;
  medicineCode?: string;
  batchId: string;
  batchNo: string;

  // Medicine identity
  medicineName: string;
  generic: string;
  brand: string;
  category: string;
  subCategory: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  primarySupplier: string;

  // Batch financials
  stock: number;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  addedOn: string;

  // Expiry calculation
  expiryDateLabel: string; // original "MMM yyyy" label, e.g. "Sep 2026"
  expiryDate: Date;
  daysLeft: number;
  status: ExpiryStatus;
  monthKey: string; // "2026-09" — used for month-wise filtering

  // Location & safety
  rack: string;
  shelf: string;
  bin: string;
  controlledDrug: boolean;
  narcotic: boolean;
  highAlertMedicine: boolean;

  // Medicine's own configured alert window (days)
  expiryAlertDays: number;
}