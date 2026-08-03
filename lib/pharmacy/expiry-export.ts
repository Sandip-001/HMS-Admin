
import * as XLSX from "xlsx";
import type { ExpiryMedicineItem } from "@/types/pharmacy/expiry-medicines-types";

export function exportExpiryMedicinesToExcel(data: ExpiryMedicineItem[], fileName: string) {
  const rows = data.map((item) => ({
    "Medicine Name": item.medicineName,
    Generic: item.genericName,
    Brand: item.brand,
    Category: item.category,
    "Batch No": item.batchNo,
    Rack: item.rack,
    Stock: item.stock,
    "Expiry Date": item.expiryDate,
    Supplier: item.supplier,
    Status: item.status,
    "Days Left": item.daysLeft,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expiry Medicines");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}