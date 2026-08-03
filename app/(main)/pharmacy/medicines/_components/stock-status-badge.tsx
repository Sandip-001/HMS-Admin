
import { Badge } from "@/components/ui/badge";
import type { MedicineStockStatus } from "@/types/pharmacy/medicine-types";

const styles: Record<MedicineStockStatus, string> = {
  Available: "bg-emerald-50 text-emerald-700",
  "Low Stock": "bg-amber-50 text-amber-700",
  "Out of Stock": "bg-red-50 text-red-700",
};

export function StockStatusBadge({ status }: { status: MedicineStockStatus }) {
  return <Badge className={`font-medium hover:${styles[status]} ${styles[status]}`}>{status}</Badge>;
}