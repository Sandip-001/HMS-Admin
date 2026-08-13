import type { DateRange, PharmacySale } from "@/types/pharmacy/sales-types";

export function isWithinRange(dateStr: string, range: DateRange): boolean {
  if (!range.from && !range.to) return true;
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  if (range.from) {
    const from = new Date(range.from);
    from.setHours(0, 0, 0, 0);
    if (date < from) return false;
  }
  if (range.to) {
    const to = new Date(range.to);
    to.setHours(23, 59, 59, 999);
    if (date > to) return false;
  }
  return true;
}

export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700 border-green-200";
    case "Pending":
      return "bg-red-100 text-red-700 border-red-200";
    case "Partially Paid":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function getPatientTypeColor(type: string): string {
  switch (type) {
    case "IPD":
      return "bg-blue-100 text-blue-700";
    case "OPD":
      return "bg-green-100 text-green-700";
    case "ICU":
      return "bg-purple-100 text-purple-700";
    case "Emergency":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function getBillTypeColor(type: string): string {
  return type === "Cash" ? "bg-cyan-100 text-cyan-700" : "bg-orange-100 text-orange-700";
}

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getMedicineSummary(sale: PharmacySale): string {
  return sale.medicines.map((m) => m.medicineName).join(", ");
}

export function getTotalQuantity(sale: PharmacySale): number {
  return sale.medicines.reduce((sum, m) => sum + m.quantity, 0);
}

export function formatDateLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}