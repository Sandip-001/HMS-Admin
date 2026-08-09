// types/pharmacy/category-brand-types.ts

export interface PharmacyCategory {
  categoryId?: string; // Auto-generated from backend
  categoryName: string;
  description: string;
  parentCategory: string;
  medicineCount?: number;
  medicineType: "Tablet" | "Injection" | "Consumable" | "";
  gstPercent: string;
  status: "Active" | "Inactive";
  displayOrder: string;
  createdBy?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface PharmacyBrand {
  brandId?: string;
  brandName: string;
  medicineCount?: number;
  manufacturer: string;
  country: string;
  website: string;
  licenseNumber: string;
  gst: string;
  supportContact: string;
  status: "Active" | "Inactive";
  createdDate?: string;
}

export type CategoryFormData = Omit<PharmacyCategory, "medicineCount" | "createdBy" | "createdDate" | "updatedDate">;

export type BrandFormData = Omit<PharmacyBrand, "brandId" | "medicineCount" | "createdDate">;

export type CategoryFormErrors = Partial<Record<keyof CategoryFormData, string>>;

export type BrandFormErrors = Partial<Record<keyof BrandFormData, string>>;