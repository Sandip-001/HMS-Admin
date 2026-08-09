// types/pharmacy/medicine-types.ts

export interface MedicineBatch {
  id: string;
  batchNo: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  stock: number;
  expiryDate: string;
  addedOn: string;
}

export interface Medicine {
  id: string;
  medicineCode?: string; // Auto-generated from backend
  barcode: string;

  // Identity
  medicineName: string;
  generic: string;
  brand: string;
  strength: string;
  dosageForm: string;
  packSize: string;
  unit: string;
  route: string;
  atcCode?: string;

  // Classification
  category: string;
  subCategory: string;
  manufacturer: string;
  primarySupplier: string;

  // Tax & Units
  hsnCode: string;
  gstPercent: string;
  purchaseUnit: string;
  issueUnit: string;

  // Storage
  storageCondition: string;
  storageTemperature: string;

  // Safety flags
  controlledDrug: boolean;
  narcotic: boolean;
  lasaMedicine: boolean;
  highAlertMedicine: boolean;
  lookAlikeSoundAlike: boolean;
  prescriptionRequired: boolean;

  // Stock control
  expiryAlertDays: string;
  reorderLevel: string;
  maximumStock: string;
  minimumStock: number;
  reservedStock: string;
  blockedStock: string;

  // Location
  rack: string;
  shelf: string;
  bin: string;

  // Inventory classification
  abcClassification: "A" | "B" | "C" | "";
  vedClassification: "V" | "E" | "D" | "";

  // Status & audit
  status: "Active" | "Inactive";
  createdBy?: string;
  updatedBy?: string;

  batches: MedicineBatch[];
}

export type MedicineFormData = Omit<
  Medicine,
  "id" | "medicineCode" | "createdBy" | "updatedBy" | "batches"
>;

export type MedicineFormErrors = Partial<Record<keyof MedicineFormData, string>>;

export type MedicineStockStatus = "Available" | "Low Stock" | "Out of Stock";