
import type { ExpiryMedicineRecord } from "@/types/pharmacy/expiry-types";
import { getStockValue } from "@/lib/pharmacy/expiry-helpers";

export async function exportExpiryMedicinesToExcel(
  records: ExpiryMedicineRecord[],
  fileName: string = "expiry-medicines-report"
) {
  // Dynamic import keeps the (fairly large) xlsx library out of the main bundle
  // until the user actually clicks "Export".
  const XLSX = await import("xlsx");

  const rows = records.map((r) => ({
    "Medicine Code": r.medicineCode ?? "",
    "Medicine Name": r.medicineName,
    "Generic Name": r.generic,
    Brand: r.brand,
    Category: r.category,
    "Sub Category": r.subCategory,
    "Dosage Form": r.dosageForm,
    Strength: r.strength,
    "Batch No": r.batchNo,
    "Current Stock": r.stock,
    "Purchase Price (₹)": r.purchasePrice,
    "Selling Price (₹)": r.sellingPrice,
    "MRP (₹)": r.mrp,
    "Stock Value (₹)": getStockValue(r),
    "Expiry Date": r.expiryDateLabel,
    "Days Left": r.daysLeft,
    Status: r.status,
    Manufacturer: r.manufacturer,
    "Primary Supplier": r.primarySupplier,
    Location: `${r.rack} / ${r.shelf} / ${r.bin}`,
    "Controlled Drug": r.controlledDrug ? "Yes" : "No",
    Narcotic: r.narcotic ? "Yes" : "No",
    "High Alert": r.highAlertMedicine ? "Yes" : "No",
    "Batch Added On": r.addedOn,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-size columns roughly based on header + content length
  const colWidths = Object.keys(rows[0] ?? {}).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((row) => String((row as Record<string, unknown>)[key] ?? "").length)
    );
    return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expiry Report");

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `${fileName}-${timestamp}.xlsx`);
}