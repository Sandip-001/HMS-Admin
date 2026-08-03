// lib/admin/pharmacy/medicine-sales-insights-helpers.ts
import type {
  MedicineSalesRecord,
  RankedMedicineItem,
} from "@/types/pharmacy/medicine-sales-insights-types";

export function getSelectedMonths(allMonths: string[], selectedMonthCount: string) {
  const count = Number(selectedMonthCount);
  return allMonths.slice(-count);
}

export function rankMedicinesBySelectedMonths(
  records: MedicineSalesRecord[],
  selectedMonths: string[]
): RankedMedicineItem[] {
  return records.map((item) => ({
    id: item.id,
    medicineName: item.medicineName,
    genericName: item.genericName,
    brand: item.brand,
    category: item.category,
    totalUnitsSold: item.monthlySales
      .filter((monthItem) => selectedMonths.includes(monthItem.month))
      .reduce((sum, monthItem) => sum + monthItem.unitsSold, 0),
  }));
}