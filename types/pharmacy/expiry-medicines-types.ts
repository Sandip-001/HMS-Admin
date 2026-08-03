
export type ExpiryStatus = "Expired" | "Near Expiry";

export interface ExpiryMedicineItem {
  id: string;
  medicineName: string;
  genericName: string;
  brand: string;
  category: string;
  batchNo: string;
  rack: string;
  stock: number;
  expiryDate: string;
  supplier: string;
  status: ExpiryStatus;
  daysLeft: number;
}