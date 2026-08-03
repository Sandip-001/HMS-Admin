
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
  medicineName: string;
  generic: string;
  category: string;
  brand: string;
  supplier: string;
  minimumStock: number;
  rack: string;
  batches: MedicineBatch[];
}

export interface MedicineFormData {
  medicineName: string;
  generic: string;
  category: string;
  brand: string;
  supplier: string;
  minimumStock: string;
  rack: string;
}

export interface MedicineFormErrors {
  medicineName?: string;
  generic?: string;
  category?: string;
  brand?: string;
  supplier?: string;
  minimumStock?: string;
  rack?: string;
}

export type MedicineStockStatus = "Available" | "Low Stock" | "Out of Stock";