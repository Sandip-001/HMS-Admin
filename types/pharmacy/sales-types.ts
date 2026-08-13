// types/pharmacy/sales-types.ts

export interface SaleMedicineItem {
  id: string;
  medicineName: string;
  strength: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type PatientType = "IPD" | "OPD" | "ICU" | "Emergency";
export type BillType = "Cash" | "Credit";
export type PaymentStatus = "Paid" | "Pending" | "Partially Paid";
export type PaymentMode = "Cash" | "Card" | "UPI" | "Insurance" | "Credit";

export interface PharmacySale {
  id: string;
  billNumber: string;
  billDate: string; // ISO date, e.g. 2024-05-20 — used for date-range filtering
  billTime: string; // e.g. "11:40 AM"

  // Patient
  patientName: string;
  uhid: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  patientType: PatientType;
  ward?: string;
  bed?: string;

  // Clinical reference
  doctorName: string;
  department: string;
  prescriptionNumber: string;

  // Billing
  billType: BillType;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  subTotal: number;
  discountPercent: number;
  discountAmount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;

  medicines: SaleMedicineItem[];
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}