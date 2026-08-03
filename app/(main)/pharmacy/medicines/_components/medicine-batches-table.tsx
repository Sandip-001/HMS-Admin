
import { Badge } from "@/components/ui/badge";
import { BatchBarcode } from "./batch-barcode";
import type { MedicineBatch } from "@/types/pharmacy/medicine-types";

export function MedicineBatchesTable({ batches }: { batches: MedicineBatch[] }) {
  return (
    <div className="space-y-3">
      {batches.map((batch) => (
        <div key={batch.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <BatchInfo label="Batch No." value={batch.batchNo} highlight />
              <BatchInfo label="Purchase Price" value={`₹${batch.purchasePrice}`} />
              <BatchInfo label="Selling Price" value={`₹${batch.sellingPrice}`} />
              <BatchInfo label="MRP" value={`₹${batch.mrp}`} />
              <div>
                <p className="text-xs text-slate-400">Stock</p>
                {batch.stock === 0 ? (
                  <Badge className="mt-1 bg-red-50 text-red-700">Out of Stock</Badge>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-slate-800">{batch.stock} pcs</p>
                )}
              </div>
              <BatchInfo label="Expiry" value={batch.expiryDate} />
            </div>

            <div className="shrink-0 self-center border-t border-slate-100 pt-3 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
              <BatchBarcode code={batch.batchNo} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BatchInfo({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${highlight ? "text-blue-600" : "text-slate-800"}`}>{value}</p>
    </div>
  );
}