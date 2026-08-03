
import { Badge } from "@/components/ui/badge";
import type { ExpiryStatus } from "@/types/pharmacy/expiry-medicines-types";

export function ExpiryStatusBadge({ status }: { status: ExpiryStatus }) {
  return status === "Expired" ? (
    <Badge className="bg-red-50 text-red-700 hover:bg-red-50">Expired</Badge>
  ) : (
    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Near Expiry</Badge>
  );
}