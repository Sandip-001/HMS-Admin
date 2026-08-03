
import type { Medicine } from "@/types/pharmacy/medicine-types";

export const MEDICINES: Medicine[] = [
  {
    id: "1",
    medicineName: "Paracetamol 650",
    generic: "Paracetamol",
    category: "Pain Killers",
    brand: "Cipla",
    supplier: "Rakesh Kumar",
    minimumStock: 100,
    rack: "A-04",
    batches: [
      { id: "B1", batchNo: "P001", purchasePrice: 20, sellingPrice: 25, mrp: 28, stock: 100, expiryDate: "Jan 2027", addedOn: "10 Jan 2024" },
      { id: "B2", batchNo: "P002", purchasePrice: 40, sellingPrice: 45, mrp: 56, stock: 200, expiryDate: "Dec 2028", addedOn: "05 Mar 2024" },
      { id: "B3", batchNo: "P003", purchasePrice: 38, sellingPrice: 44, mrp: 57, stock: 150, expiryDate: "Jun 2029", addedOn: "18 Jun 2024" },
    ],
  },
  {
    id: "2",
    medicineName: "Azithromycin 500",
    generic: "Azithromycin",
    category: "Antibiotics",
    brand: "Sun Pharma",
    supplier: "Anita Desai",
    minimumStock: 80,
    rack: "B-12",
    batches: [
      { id: "B4", batchNo: "A101", purchasePrice: 55, sellingPrice: 65, mrp: 78, stock: 40, expiryDate: "Mar 2027", addedOn: "12 Feb 2024" },
      { id: "B5", batchNo: "A102", purchasePrice: 58, sellingPrice: 68, mrp: 80, stock: 0, expiryDate: "Sep 2026", addedOn: "20 Apr 2024" },
    ],
  },
  {
    id: "3",
    medicineName: "Atorvastatin 20",
    generic: "Atorvastatin",
    category: "Heart Medicines",
    brand: "Dr. Reddy's",
    supplier: "Suresh Menon",
    minimumStock: 60,
    rack: "C-08",
    batches: [
      { id: "B6", batchNo: "H201", purchasePrice: 32, sellingPrice: 38, mrp: 45, stock: 0, expiryDate: "Nov 2026", addedOn: "08 Jan 2024" },
    ],
  },
  {
    id: "4",
    medicineName: "Metformin 500",
    generic: "Metformin Hydrochloride",
    category: "Diabetes",
    brand: "Mankind",
    supplier: "Rakesh Kumar",
    minimumStock: 120,
    rack: "A-09",
    batches: [
      { id: "B7", batchNo: "D301", purchasePrice: 15, sellingPrice: 19, mrp: 24, stock: 300, expiryDate: "Feb 2028", addedOn: "15 Jan 2024" },
    ],
  },
];

export const DEFAULT_MEDICINE_FORM = {
  medicineName: "",
  generic: "",
  category: "",
  brand: "",
  supplier: "",
  minimumStock: "",
  rack: "",
};

export const CATEGORY_OPTIONS = ["Antibiotics", "Pain Killers", "Diabetes", "Blood Pressure", "Heart Medicines", "Respiratory", "Gastro", "Skin Care"];
export const BRAND_OPTIONS = ["Sun Pharma", "Cipla", "Mankind", "Dr. Reddy's", "Abbott", "Alkem", "Lupin", "Zydus", "Torrent"];
export const SUPPLIER_OPTIONS = ["Rakesh Kumar", "Anita Desai", "Suresh Menon", "Priya Nair"];