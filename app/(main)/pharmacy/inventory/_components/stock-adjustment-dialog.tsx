"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { ADJUSTMENT_TYPE_OPTIONS, WAREHOUSE_OPTIONS } from "@/lib/pharmacy/inventory-data";
import { hasErrors, validateStockAdjustment } from "@/lib/pharmacy/inventory-helpers";
import type { InventoryItem, StockAdjustmentFormData, StockAdjustmentType } from "@/types/pharmacy/inventory-types";

const DEFAULT_ADJUSTMENT_FORM: StockAdjustmentFormData = {
  adjustmentType: "",
  quantity: "",
  reason: "",
  destinationWarehouse: "",
};

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onSave: (itemId: string, data: StockAdjustmentFormData) => void;
}

export function StockAdjustmentDialog({ open, onOpenChange, item, onSave }: StockAdjustmentDialogProps) {
  const [formData, setFormData] = useState<StockAdjustmentFormData>(DEFAULT_ADJUSTMENT_FORM);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (open) {
      setFormData(DEFAULT_ADJUSTMENT_FORM);
      setErrors({});
    }
  }, [open, item]);

  function updateField<K extends keyof StockAdjustmentFormData>(key: K, value: StockAdjustmentFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSave() {
    if (!item) return;
    const validationErrors = validateStockAdjustment(formData, item.available);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    onSave(item.id, formData);
    onOpenChange(false);
  }

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[560px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">
            Stock Adjustment — {item.medicineName}
          </DialogTitle>
          <p className="text-xs text-slate-500 mt-1">
            Available Stock: <span className="font-semibold text-slate-700">{item.available.toLocaleString()} {item.unit}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <FormField label="Adjustment Type" required error={errors.adjustmentType}>
            <Select
              value={formData.adjustmentType}
              onValueChange={(v) => updateField("adjustmentType", (v ?? "") as StockAdjustmentType | "")}
            >
              <SelectTrigger><SelectValue placeholder="Select adjustment type" /></SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_TYPE_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Quantity" required error={errors.quantity}>
            <Input
              type="number"
              placeholder={`Max ${item.available}`}
              value={formData.quantity}
              onChange={(e) => updateField("quantity", e.target.value)}
            />
          </FormField>

          {formData.adjustmentType === "Transferred" && (
            <FormField label="Destination Warehouse" required error={errors.destinationWarehouse}>
              <Select
                value={formData.destinationWarehouse}
                onValueChange={(v) => updateField("destinationWarehouse", v ?? "")}
              >
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>
                  {WAREHOUSE_OPTIONS.filter((w) => w !== item.warehouse).map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <FormField label="Reason" required error={errors.reason}>
            <Textarea
              placeholder="Provide a reason for this stock adjustment..."
              value={formData.reason}
              onChange={(e) => updateField("reason", e.target.value)}
              className="min-h-[80px]"
            />
          </FormField>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" onClick={handleSave}>
            Apply Adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}