
export interface Supplier {
  id: string;
  supplierName: string;
  contactPerson: string;
  gstNumber: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
  createdOn: string;
}

export interface SupplierFormData {
  supplierName: string;
  contactPerson: string;
  gstNumber: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
}

export interface SupplierFormErrors {
  supplierName?: string;
  contactPerson?: string;
  gstNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  paymentTerms?: string;
}