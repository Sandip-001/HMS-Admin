// app/admin/pharmacy/expiry-medicines/_components/download-excel-button.tsx
"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportExpiryMedicinesToExcel } from "@/lib/pharmacy/expiry-export";
import type { ExpiryMedicineItem } from "@/types/pharmacy/expiry-medicines-types";

export function DownloadExcelButton({
  data,
  fileName,
  label,
}: {
  data: ExpiryMedicineItem[];
  fileName: string;
  label: string;
}) {
  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={() => exportExpiryMedicinesToExcel(data, fileName)}
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}