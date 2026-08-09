"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEDICINE_DROPDOWN_OPTIONS } from "@/lib/pharmacy/purchase-data";
import type { PurchaseItem, PurchaseItemErrors } from "@/types/pharmacy/purchase-types";
import { calculateItemTotal } from "@/lib/pharmacy/purchase-helpers";

interface PurchaseItemRowProps {
  item: PurchaseItem;
  errors?: PurchaseItemErrors;
  onChange: <K extends keyof PurchaseItem>(itemId: string, key: K, value: PurchaseItem[K]) => void;
  onRemove: (itemId: string) => void;
  canRemove: boolean;
}

export function PurchaseItemRow({ item, errors, onChange, onRemove, canRemove }: PurchaseItemRowProps) {
  function handleMedicineChange(medicineId: string) {
    const selected = MEDICINE_DROPDOWN_OPTIONS.find((m) => m.id === medicineId);
    onChange(item.itemId, "medicineId", medicineId);
    onChange(item.itemId, "medicineName", selected?.name ?? "");
  }

  const lineTotal = calculateItemTotal(item);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 relative">
      {canRemove && (
        <button
          onClick={() => onRemove(item.itemId)}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 pr-8">
        <div className="lg:col-span-2">
          <label className="text-xs font-medium text-slate-600 mb-1 block">Medicine *</label>
          <Select value={item.medicineId} onValueChange={(v) => handleMedicineChange(v ?? "")}>
            <SelectTrigger className={errors?.medicineId ? "border-red-300" : ""}>
              <SelectValue placeholder="Select medicine" />
            </SelectTrigger>
            <SelectContent>
              {MEDICINE_DROPDOWN_OPTIONS.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.medicineId && <p className="text-xs text-red-500 mt-1">{errors.medicineId}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Batch *</label>
          <Input
            placeholder="e.g. P001"
            value={item.batch}
            onChange={(e) => onChange(item.itemId, "batch", e.target.value)}
            className={errors?.batch ? "border-red-300" : ""}
          />
          {errors?.batch && <p className="text-xs text-red-500 mt-1">{errors.batch}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">MRP (₹) *</label>
          <Input
            type="number"
            placeholder="e.g. 28"
            value={item.mrp}
            onChange={(e) => onChange(item.itemId, "mrp", e.target.value)}
            className={errors?.mrp ? "border-red-300" : ""}
          />
          {errors?.mrp && <p className="text-xs text-red-500 mt-1">{errors.mrp}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">PTR (₹) *</label>
          <Input
            type="number"
            placeholder="e.g. 24"
            value={item.ptr}
            onChange={(e) => onChange(item.itemId, "ptr", e.target.value)}
            className={errors?.ptr ? "border-red-300" : ""}
          />
          {errors?.ptr && <p className="text-xs text-red-500 mt-1">{errors.ptr}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">PTS (₹) *</label>
          <Input
            type="number"
            placeholder="e.g. 22"
            value={item.pts}
            onChange={(e) => onChange(item.itemId, "pts", e.target.value)}
            className={errors?.pts ? "border-red-300" : ""}
          />
          {errors?.pts && <p className="text-xs text-red-500 mt-1">{errors.pts}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">GST (%) *</label>
          <Input
            type="number"
            placeholder="e.g. 12"
            value={item.gst}
            onChange={(e) => onChange(item.itemId, "gst", e.target.value)}
            className={errors?.gst ? "border-red-300" : ""}
          />
          {errors?.gst && <p className="text-xs text-red-500 mt-1">{errors.gst}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Discount (%)</label>
          <Input
            type="number"
            placeholder="e.g. 5"
            value={item.discount}
            onChange={(e) => onChange(item.itemId, "discount", e.target.value)}
            className={errors?.discount ? "border-red-300" : ""}
          />
          {errors?.discount && <p className="text-xs text-red-500 mt-1">{errors.discount}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Free Qty</label>
          <Input
            type="number"
            placeholder="e.g. 20"
            value={item.freeQty}
            onChange={(e) => onChange(item.itemId, "freeQty", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Accepted Qty *</label>
          <Input
            type="number"
            placeholder="e.g. 980"
            value={item.acceptedQty}
            onChange={(e) => onChange(item.itemId, "acceptedQty", e.target.value)}
            className={errors?.acceptedQty ? "border-red-300" : ""}
          />
          {errors?.acceptedQty && <p className="text-xs text-red-500 mt-1">{errors.acceptedQty}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Rejected Qty</label>
          <Input
            type="number"
            placeholder="e.g. 0"
            value={item.rejectedQty}
            onChange={(e) => onChange(item.itemId, "rejectedQty", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Manufacture *</label>
          <Input
            type="date"
            value={item.manufacture}
            onChange={(e) => onChange(item.itemId, "manufacture", e.target.value)}
            className={errors?.manufacture ? "border-red-300" : ""}
          />
          {errors?.manufacture && <p className="text-xs text-red-500 mt-1">{errors.manufacture}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Expiry *</label>
          <Input
            type="date"
            value={item.expiry}
            onChange={(e) => onChange(item.itemId, "expiry", e.target.value)}
            className={errors?.expiry ? "border-red-300" : ""}
          />
          {errors?.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
        <p className="text-sm text-slate-600">
          Line Total: <span className="font-semibold text-slate-800">₹{lineTotal.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}