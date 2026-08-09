// types/pharmacy/supplier-types.ts

export interface PharmacySupplier {
  supplierId?: string;
  supplierName: string;
  phone: string;
  email: string;
  address: string;
  supplierCode?: string;
  supplierType: "Manufacturer" | "Distributor" | "Wholesaler" | "Retailer" | "";
  drugLicenseNumber: string;
  gst: string;
  pan: string;
  bankDetails: string;
  ifsc: string;
  creditLimit: string;
  creditDays: string;
  paymentTerms: "Immediate" | "7 Days" | "15 Days" | "30 Days" | "60 Days" | "90 Days" | "";
  outstandingAmount: string;
  performanceRating: string;
  lastPurchaseDate: string;
  activeStatus: "Active" | "Inactive";
  createdDate?: string;
}

export type SupplierFormData = Omit<PharmacySupplier, "supplierId" | "supplierCode" | "createdDate">;

export type SupplierFormErrors = Partial<Record<keyof SupplierFormData, string>>;