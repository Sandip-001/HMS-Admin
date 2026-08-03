// app/admin/pharmacy/medicines/_components/view-medicine-dialog.tsx
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Pill } from "lucide-react";
import { MedicineBatchesTable } from "./medicine-batches-table";
import { getTotalStock } from "@/lib/pharmacy/medicine-helpers";
import type { Medicine } from "@/types/pharmacy/medicine-types";

export function ViewMedicineDialog({
  open,
  onOpenChange,
  medicine,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine | null;
}) {
  if (!medicine) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[94vw] sm:!w-[90vw] !max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Pill className="h-5 w-5 text-blue-600" /> Medicine Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-4 py-4 sm:px-5 sm:py-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <Info label="Medicine Name" value={medicine.medicineName} />
              <Info label="Generic" value={medicine.generic} />
              <Info label="Category" value={medicine.category} />
              <Info label="Brand" value={medicine.brand} />
              <Info label="Supplier" value={medicine.supplier} />
              <Info label="Total Stock" value={`${getTotalStock(medicine)} pcs`} />
              <Info label="Minimum Stock" value={`${medicine.minimumStock} pcs`} />
              <Info label="Rack" value={medicine.rack} />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">Batch History</p>
            <MedicineBatchesTable batches={medicine.batches} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}