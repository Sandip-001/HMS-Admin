"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BarcodeQrPreview } from "@/components/ui/barcode-qr-preview";
import { getCurrentStock, getStockStatus, getStockStatusColor } from "@/lib/pharmacy/medicine-helpers";
import type { Medicine } from "@/types/pharmacy/medicine-types";
import { AlertTriangle, MapPin, Pill, ShieldAlert, Snowflake } from "lucide-react";

interface MedicineViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine | null;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">{value ?? "—"}</p>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

export function MedicineViewDialog({ open, onOpenChange, medicine }: MedicineViewDialogProps) {
  if (!medicine) return null;

  const currentStock = getCurrentStock(medicine);
  const stockStatus = getStockStatus(medicine);

  const flags = [
    { label: "Controlled Drug", active: medicine.controlledDrug },
    { label: "Narcotic", active: medicine.narcotic },
    { label: "LASA Medicine", active: medicine.lasaMedicine },
    { label: "High Alert", active: medicine.highAlertMedicine },
    { label: "Look Alike / Sound Alike", active: medicine.lookAlikeSoundAlike },
    { label: "Prescription Required", active: medicine.prescriptionRequired },
  ].filter((f) => f.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[920px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {medicine.medicineName.charAt(0).toUpperCase()}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800">
                {medicine.medicineName}
              </DialogTitle>
              <p className="text-xs text-slate-500">
                {medicine.medicineCode} • {medicine.strength} • {medicine.dosageForm}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStockStatusColor(stockStatus)}>{stockStatus}</Badge>
            <Badge className={medicine.status === "Active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
              {medicine.status}
            </Badge>
            {flags.map((f) => (
              <Badge key={f.label} className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {f.label}
              </Badge>
            ))}
          </div>

          {/* Identity */}
          <SectionCard title="Identity" icon={<Pill className="w-4 h-4 text-blue-500" />}>
            <DetailItem label="Medicine Code" value={medicine.medicineCode} />
            <DetailItem label="Barcode" value={medicine.barcode} />
            <DetailItem label="Generic Name" value={medicine.generic} />
            <DetailItem label="Brand" value={medicine.brand} />
            <DetailItem label="Strength" value={medicine.strength} />
            <DetailItem label="Dosage Form" value={medicine.dosageForm} />
            <DetailItem label="Pack Size" value={medicine.packSize} />
            <DetailItem label="Unit" value={medicine.unit} />
            <DetailItem label="Route" value={medicine.route} />
            <DetailItem label="ATC Code" value={medicine.atcCode || "—"} />
          </SectionCard>

          {/* Classification */}
          <SectionCard title="Classification & Sourcing">
            <DetailItem label="Category" value={medicine.category} />
            <DetailItem label="Sub Category" value={medicine.subCategory} />
            <DetailItem label="Manufacturer" value={medicine.manufacturer} />
            <DetailItem label="Primary Supplier" value={medicine.primarySupplier} />
            <DetailItem label="HSN Code" value={medicine.hsnCode} />
            <DetailItem label="GST %" value={`${medicine.gstPercent}%`} />
            <DetailItem label="Purchase Unit" value={medicine.purchaseUnit} />
            <DetailItem label="Issue Unit" value={medicine.issueUnit} />
          </SectionCard>

          {/* Storage */}
          <SectionCard title="Storage" icon={<Snowflake className="w-4 h-4 text-cyan-500" />}>
            <DetailItem label="Storage Condition" value={medicine.storageCondition} />
            <DetailItem label="Storage Temperature" value={medicine.storageTemperature} />
            <DetailItem label="Rack" value={medicine.rack} />
            <DetailItem label="Shelf" value={medicine.shelf} />
            <DetailItem label="Bin" value={medicine.bin} />
          </SectionCard>

          {/* Stock */}
          <SectionCard title="Stock Control" icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}>
            <DetailItem label="Current Stock" value={currentStock} />
            <DetailItem label="Minimum Stock" value={medicine.minimumStock} />
            <DetailItem label="Maximum Stock" value={medicine.maximumStock} />
            <DetailItem label="Reorder Level" value={medicine.reorderLevel} />
            <DetailItem label="Reserved Stock" value={medicine.reservedStock} />
            <DetailItem label="Blocked Stock" value={medicine.blockedStock} />
            <DetailItem label="Expiry Alert Days" value={medicine.expiryAlertDays} />
            <DetailItem label="ABC Classification" value={medicine.abcClassification} />
            <DetailItem label="VED Classification" value={medicine.vedClassification} />
          </SectionCard>

          {/* Batches */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Batch Details ({medicine.batches.length})
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="py-2 pr-4">Batch No</th>
                    <th className="py-2 pr-4">Purchase Price</th>
                    <th className="py-2 pr-4">Selling Price</th>
                    <th className="py-2 pr-4">MRP</th>
                    <th className="py-2 pr-4">Stock</th>
                    <th className="py-2 pr-4">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {medicine.batches.map((batch) => (
                    <tr key={batch.id}>
                      <td className="py-2 pr-4 font-medium text-slate-700 whitespace-nowrap">{batch.batchNo}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">₹{batch.purchasePrice}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">₹{batch.sellingPrice}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">₹{batch.mrp}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{batch.stock}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{batch.expiryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Barcode / QR */}
          <BarcodeQrPreview value={medicine.barcode} fileName={medicine.medicineCode || medicine.id} />

          {/* Audit */}
          <div className="flex flex-wrap gap-6 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Rack {medicine.rack} / Shelf {medicine.shelf} / Bin {medicine.bin}
            </span>
            <span>Created By: {medicine.createdBy || "—"}</span>
            <span>Updated By: {medicine.updatedBy || "—"}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}