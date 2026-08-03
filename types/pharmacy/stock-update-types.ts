
export type PaymentStatus = "Paid" | "Unpaid";

export interface StockUpdateEntry {
  id: string;
  supplier: string;
  invoiceNumber: string;
  purchaseDate: string;
  medicineName: string;
  batchNo: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  expiryDate: string;
  quantity: number;
  gstPercent: number;
  discountPercent: number;
  totalAmount: number;
  status: PaymentStatus;
}

export interface StockUpdateFormData {
  supplier: string;
  invoiceNumber: string;
  purchaseDate: string;
  medicineName: string;
  batchNo: string;
  purchasePrice: string;
  sellingPrice: string;
  mrp: string;
  expiryDate: string;
  quantity: string;
  gstPercent: string;
  discountPercent: string;
  status: PaymentStatus;
}

export interface StockUpdateFormErrors {
  supplier?: string;
  invoiceNumber?: string;
  purchaseDate?: string;
  medicineName?: string;
  batchNo?: string;
  purchasePrice?: string;
  sellingPrice?: string;
  mrp?: string;
  expiryDate?: string;
  quantity?: string;
  gstPercent?: string;
  discountPercent?: string;
}