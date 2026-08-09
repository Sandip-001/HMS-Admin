// lib/pharmacy/purchase-data.ts

import type { PurchaseOrder, PurchaseItem } from "@/types/pharmacy/purchase-types";
import { PHARMACY_SUPPLIERS } from "@/lib/pharmacy/supplier-data";
import { MEDICINES } from "./medicine-data";


export const SUPPLIER_DROPDOWN_OPTIONS = PHARMACY_SUPPLIERS.map((s) => ({ id: s.supplierId!, name: s.supplierName }));

export const MEDICINE_DROPDOWN_OPTIONS = MEDICINES.map((m) => ({ id: m.id, name: m.medicineName }));

export const PAYMENT_MODE_OPTIONS = ["Cash", "Cheque", "Bank Transfer", "UPI", "Credit"];
export const WAREHOUSE_OPTIONS = ["Main Warehouse", "Central Store", "Branch Store - North", "Branch Store - South", "Cold Storage"];
export const STATUS_OPTIONS = ["Draft", "Pending", "Received", "Completed", "Cancelled"];

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    grnNumber: "GRN-2024-0501",
    invoice: "INV-2024-1042",
    supplierId: "1",
    supplierName: "MediCare Distributors",
    purchaseDate: "2024-08-01",
    receivedDate: "2024-08-03",
    paymentMode: "Bank Transfer",
    warehouse: "Main Warehouse",
    remarks: "Regular monthly stock replenishment",
    status: "Completed",
    items: [
      {
        itemId: "I1",
        medicineId: "1",
        medicineName: "Paracetamol 650",
        batch: "P001",
        mrp: "28",
        ptr: "24",
        pts: "22",
        gst: "12",
        discount: "5",
        freeQty: "20",
        acceptedQty: "980",
        rejectedQty: "0",
        expiry: "2027-01-31",
        manufacture: "2024-01-05",
      },
      {
        itemId: "I2",
        medicineId: "4",
        medicineName: "Metformin 500",
        batch: "D301",
        mrp: "24",
        ptr: "17",
        pts: "15",
        gst: "12",
        discount: "4",
        freeQty: "100",
        acceptedQty: "2900",
        rejectedQty: "15",
        expiry: "2028-02-28",
        manufacture: "2024-01-15",
      },
    ],
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    grnNumber: "GRN-2024-0455",
    invoice: "INV-2024-0987",
    supplierId: "2",
    supplierName: "Apollo Pharma Wholesale",
    purchaseDate: "2024-07-20",
    receivedDate: "2024-07-22",
    paymentMode: "Credit",
    warehouse: "Central Store",
    remarks: "Urgent order for antibiotics restock",
    status: "Received",
    items: [
      {
        itemId: "I3",
        medicineId: "2",
        medicineName: "Azithromycin 500",
        batch: "A101",
        mrp: "78",
        ptr: "60",
        pts: "55",
        gst: "12",
        discount: "0",
        freeQty: "10",
        acceptedQty: "485",
        rejectedQty: "5",
        expiry: "2027-03-31",
        manufacture: "2023-11-15",
      },
    ],
  },
  {
    id: "3",
    poNumber: "PO-2024-003",
    grnNumber: "GRN-2024-0288",
    invoice: "INV-2024-0654",
    supplierId: "3",
    supplierName: "Sunrise Pharmaceuticals",
    purchaseDate: "2024-06-10",
    receivedDate: "",
    paymentMode: "Cheque",
    warehouse: "Main Warehouse",
    remarks: "Awaiting delivery confirmation from supplier",
    status: "Pending",
    items: [
      {
        itemId: "I4",
        medicineId: "3",
        medicineName: "Atorvastatin 20",
        batch: "H201",
        mrp: "45",
        ptr: "34",
        pts: "32",
        gst: "12",
        discount: "2",
        freeQty: "0",
        acceptedQty: "0",
        rejectedQty: "0",
        expiry: "2026-11-30",
        manufacture: "2023-08-12",
      },
    ],
  },
  {
    id: "4",
    poNumber: "PO-2024-004",
    grnNumber: "",
    invoice: "",
    supplierId: "5",
    supplierName: "Metro Drug Distributors",
    purchaseDate: "2024-08-05",
    receivedDate: "",
    paymentMode: "UPI",
    warehouse: "Branch Store - North",
    remarks: "Draft order, pending approval",
    status: "Draft",
    items: [],
  },
];

export const DEFAULT_PURCHASE_ITEM: Omit<PurchaseItem, "itemId"> = {
  medicineId: "",
  medicineName: "",
  batch: "",
  mrp: "",
  ptr: "",
  pts: "",
  gst: "",
  discount: "0",
  freeQty: "0",
  acceptedQty: "",
  rejectedQty: "0",
  expiry: "",
  manufacture: "",
};

export const DEFAULT_PURCHASE_FORM: Omit<PurchaseOrder, "id" | "poNumber"> = {
  grnNumber: "",
  invoice: "",
  supplierId: "",
  supplierName: "",
  purchaseDate: "",
  receivedDate: "",
  paymentMode: "",
  warehouse: "",
  remarks: "",
  status: "Draft",
  items: [],
};