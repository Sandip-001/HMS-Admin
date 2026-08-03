
import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types/pharmacy/stock-update-types";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return status === "Paid" ? (
    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">Paid</Badge>
  ) : (
    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Unpaid</Badge>
  );
}