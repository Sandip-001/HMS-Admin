// lib/admin/pharmacy/supplier-data.ts
import type { Supplier } from "@/types/pharmacy/supplier-types";

export const SUPPLIERS: Supplier[] = [
  {
    id: "1",
    supplierName: "MedPlus Distributors",
    contactPerson: "Rakesh Kumar",
    gstNumber: "29ABCDE1234F1Z5",
    phone: "9876543210",
    email: "rakesh@medplusdist.com",
    address: "45, Industrial Area, Phase 2, Chandigarh - 160002",
    paymentTerms: "Net 30 Days",
    createdOn: "12 Jan 2024",
  },
  {
    id: "2",
    supplierName: "Sun Pharma Supply Co.",
    contactPerson: "Anita Desai",
    gstNumber: "24AACCS1234K1Z8",
    phone: "9823456712",
    email: "anita@sunpharmasupply.com",
    address: "12, Vapi Industrial Estate, Vapi, Gujarat - 396195",
    paymentTerms: "Net 45 Days",
    createdOn: "15 Jan 2024",
  },
  {
    id: "3",
    supplierName: "Cipla Wholesale",
    contactPerson: "Suresh Menon",
    gstNumber: "27AAACC1206D1ZM",
    phone: "9012345678",
    email: "suresh@ciplawholesale.com",
    address: "Cipla House, Peninsula, Mumbai - 400013",
    paymentTerms: "Net 15 Days",
    createdOn: "18 Jan 2024",
  },
  {
    id: "4",
    supplierName: "Apollo Pharma Traders",
    contactPerson: "Priya Nair",
    gstNumber: "33AAAAP1234Q1Z2",
    phone: "9345678901",
    email: "priya@apollopharmatraders.com",
    address: "78, Anna Salai, Chennai - 600002",
    paymentTerms: "Advance Payment",
    createdOn: "22 Jan 2024",
  },
];

export const DEFAULT_SUPPLIER_FORM = {
  supplierName: "",
  contactPerson: "",
  gstNumber: "",
  phone: "",
  email: "",
  address: "",
  paymentTerms: "",
};