// lib/pharmacy/expiry-helpers.ts

import { MEDICINES } from "@/lib/pharmacy/medicine-data";
import type { ExpiryMedicineRecord, ExpiryStatus } from "@/types/pharmacy/expiry-types";
import type { Medicine } from "@/types/pharmacy/medicine-types";

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/** Parses labels like "Sep 2026" into the last day of that month (pharma convention: valid through end of printed month). */
export function parseExpiryLabel(label: string): Date {
  const [monthStr, yearStr] = label.trim().split(" ");
  const month = MONTH_MAP[monthStr] ?? 0;
  const year = Number(yearStr) || new Date().getFullYear();
  // Day 0 of next month = last day of target month
  return new Date(year, month + 1, 0, 23, 59, 59);
}

export function getDaysLeft(expiryDate: Date, referenceDate: Date = new Date()): number {
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);
  const target = new Date(expiryDate);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - ref.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(daysLeft: number): ExpiryStatus {
  if (daysLeft < 0) return "Expired";
  if (daysLeft <= 30) return "Critical";
  return "Near Expiry";
}

/**
 * Flattens all medicines + their batches into per-batch expiry records,
 * keeping only batches that are already expired OR within the medicine's
 * own configured `expiryAlertDays` window — this is the purpose-built
 * "expiry alert" dataset for this page (not the full inventory).
 */
export function buildExpiryRecords(medicines: Medicine[] = MEDICINES): ExpiryMedicineRecord[] {
  const records: ExpiryMedicineRecord[] = [];

  medicines.forEach((medicine) => {
    const alertDays = Number(medicine.expiryAlertDays) || 90;

    medicine.batches.forEach((batch) => {
      const expiryDate = parseExpiryLabel(batch.expiryDate);
      const daysLeft = getDaysLeft(expiryDate);

      // Only include batches that are expired or within the alert window
      if (daysLeft > alertDays) return;

      const monthKey = `${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, "0")}`;

      records.push({
        recordId: `${medicine.id}-${batch.id}`,
        medicineId: medicine.id,
        medicineCode: medicine.medicineCode,
        batchId: batch.id,
        batchNo: batch.batchNo,
        medicineName: medicine.medicineName,
        generic: medicine.generic,
        brand: medicine.brand,
        category: medicine.category,
        subCategory: medicine.subCategory,
        dosageForm: medicine.dosageForm,
        strength: medicine.strength,
        manufacturer: medicine.manufacturer,
        primarySupplier: medicine.primarySupplier,
        stock: batch.stock,
        purchasePrice: batch.purchasePrice,
        sellingPrice: batch.sellingPrice,
        mrp: batch.mrp,
        addedOn: batch.addedOn,
        expiryDateLabel: batch.expiryDate,
        expiryDate,
        daysLeft,
        status: getExpiryStatus(daysLeft),
        monthKey,
        rack: medicine.rack,
        shelf: medicine.shelf,
        bin: medicine.bin,
        controlledDrug: medicine.controlledDrug,
        narcotic: medicine.narcotic,
        highAlertMedicine: medicine.highAlertMedicine,
        expiryAlertDays: alertDays,
      });
    });
  });

  // Soonest expiry first
  return records.sort((a, b) => a.daysLeft - b.daysLeft);
}

export function getStatusColor(status: ExpiryStatus): string {
  switch (status) {
    case "Expired":
      return "bg-red-100 text-red-700 border-red-200";
    case "Critical":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Near Expiry":
      return "bg-amber-100 text-amber-700 border-amber-200";
  }
}

export function getDaysLeftLabel(daysLeft: number): string {
  if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago`;
  if (daysLeft === 0) return "Expires today";
  return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`;
}

export function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function getAvailableMonths(records: ExpiryMedicineRecord[]): { key: string; label: string }[] {
  const uniqueMonths = Array.from(new Set(records.map((r) => r.monthKey))).sort();
  return uniqueMonths.map((key) => ({ key, label: getMonthLabel(key) }));
}

export function getStockValue(record: ExpiryMedicineRecord): number {
  return record.stock * record.purchasePrice;
}