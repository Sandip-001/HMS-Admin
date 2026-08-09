"use client";

import { useEffect, useState } from "react";
import { Plus, PackagePlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { PurchaseItemRow } from "./purchase-item-row";
import {
  DEFAULT_PURCHASE_FORM,
  DEFAULT_PURCHASE_ITEM,
  PAYMENT_MODE_OPTIONS,
  STATUS_OPTIONS,
  SUPPLIER_DROPDOWN_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "@/lib/pharmacy/purchase-data";
import {
  calculatePurchaseTotal,
  calculateTotalAcceptedQty,
  hasErrors,
  validatePurchaseForm,
  validatePurchaseItem,
} from "@/lib/pharmacy/purchase-helpers";
import type {
  PurchaseFormData,
  PurchaseItem,
  PurchaseItemErrors,
  PurchaseOrder,
} from "@/types/pharmacy/purchase-types";

interface PurchaseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPurchase: PurchaseOrder | null;
  onSave: (data: PurchaseFormData) => void;
}

function makeItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function PurchaseFormDialog({ open, onOpenChange, editingPurchase, onSave }: PurchaseFormDialogProps) {
  const [formData, setFormData] = useState<PurchaseFormData>(DEFAULT_PURCHASE_FORM);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, PurchaseItemErrors>>({});

  useEffect(() => {
    if (open) {
      if (editingPurchase) {
        const { id, poNumber, ...rest } = editingPurchase;
        setFormData(rest);
      } else {
        setFormData({
          ...DEFAULT_PURCHASE_FORM,
          items: [{ ...DEFAULT_PURCHASE_ITEM, itemId: makeItemId() }],
        });
      }
      setErrors({});
      setItemErrors({});
    }
  }, [open, editingPurchase]);

  function updateField<K extends keyof PurchaseFormData>(key: K, value: PurchaseFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => ({ ...prev, [key as string]: undefined }));
    }
  }

  function handleSupplierChange(supplierId: string) {
    const selected = SUPPLIER_DROPDOWN_OPTIONS.find((s) => s.id === supplierId);
    setFormData((prev) => ({ ...prev, supplierId, supplierName: selected?.name ?? "" }));
    if (errors.supplierId) setErrors((prev) => ({ ...prev, supplierId: undefined }));
  }

  function handleItemChange<K extends keyof PurchaseItem>(itemId: string, key: K, value: PurchaseItem[K]) {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.itemId === itemId ? { ...item, [key]: value } : item)),
    }));
    setItemErrors((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [key]: undefined },
    }));
  }

  function handleAddItem() {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...DEFAULT_PURCHASE_ITEM, itemId: makeItemId() }],
    }));
  }

  function handleRemoveItem(itemId: string) {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.itemId !== itemId),
    }));
    setItemErrors((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }

  function handleSave() {
    const validationErrors = validatePurchaseForm(formData);
    let hasItemErrors = false;
    const newItemErrors: Record<string, PurchaseItemErrors> = {};

    formData.items.forEach((item) => {
      const { itemId, ...rest } = item;
      const itemErr = validatePurchaseItem(rest);
      if (hasErrors(itemErr)) {
        hasItemErrors = true;
        newItemErrors[itemId] = itemErr;
      }
    });

    if (hasErrors(validationErrors) || hasItemErrors || formData.items.length === 0) {
      setErrors(validationErrors);
      setItemErrors(newItemErrors);
      return;
    }

    onSave(formData);
    onOpenChange(false);
  }

  const totalValue = calculatePurchaseTotal(formData.items);
  const totalAcceptedQty = calculateTotalAcceptedQty(formData.items);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[96vw] !max-w-[1100px] max-h-[92vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-blue-600" />
            {editingPurchase ? "Edit Purchase Entry" : "New Stock Purchase Entry"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Purchase Header */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Purchase Details</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Supplier" required error={errors.supplierId}>
                <Select value={formData.supplierId} onValueChange={(v) => handleSupplierChange(v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_DROPDOWN_OPTIONS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="GRN Number" error={errors.grnNumber}>
                <Input placeholder="e.g. GRN-2024-0501" value={formData.grnNumber} onChange={(e) => updateField("grnNumber", e.target.value)} />
              </FormField>

              <FormField label="Invoice" error={errors.invoice}>
                <Input placeholder="e.g. INV-2024-1042" value={formData.invoice} onChange={(e) => updateField("invoice", e.target.value)} />
              </FormField>

              <FormField label="Purchase Date" required error={errors.purchaseDate}>
                <Input type="date" value={formData.purchaseDate} onChange={(e) => updateField("purchaseDate", e.target.value)} />
              </FormField>

              <FormField label="Received Date" error={errors.receivedDate}>
                <Input type="date" value={formData.receivedDate} onChange={(e) => updateField("receivedDate", e.target.value)} />
              </FormField>

              <FormField label="Payment Mode" required error={errors.paymentMode}>
                <Select value={formData.paymentMode} onValueChange={(v) => updateField("paymentMode", (v ?? "") as PurchaseFormData["paymentMode"])}>
                  <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_MODE_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Warehouse" required error={errors.warehouse}>
                <Select value={formData.warehouse} onValueChange={(v) => updateField("warehouse", v ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                  <SelectContent>
                    {WAREHOUSE_OPTIONS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Status" error={errors.status}>
                <Select value={formData.status} onValueChange={(v) => updateField("status", (v ?? "Draft") as PurchaseFormData["status"])}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="sm:col-span-2 lg:col-span-3">
                <FormField label="Remarks" error={errors.remarks}>
                  <Textarea
                    placeholder="Any additional notes about this purchase..."
                    value={formData.remarks}
                    onChange={(e) => updateField("remarks", e.target.value)}
                    className="min-h-[70px]"
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Medicine Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Medicine Line Items ({formData.items.length})
              </p>
              <Button variant="outline" size="sm" onClick={handleAddItem} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Plus className="w-4 h-4 mr-1" />
                Add Medicine
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item) => (
                <PurchaseItemRow
                  key={item.itemId}
                  item={item}
                  errors={itemErrors[item.itemId]}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                  canRemove={formData.items.length > 1}
                />
              ))}

              {formData.items.length === 0 && (
                <div className="text-center py-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60">
                  <p className="text-sm text-slate-500 mb-3">No medicines added yet</p>
                  <Button variant="outline" size="sm" onClick={handleAddItem} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Medicine
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {formData.items.length > 0 && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Total Accepted Quantity</p>
                <p className="text-xl font-bold text-slate-800">{totalAcceptedQty.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Purchase Value (incl. GST)</p>
                <p className="text-2xl font-bold text-blue-700">₹{totalValue.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" onClick={handleSave}>
            {editingPurchase ? "Update Purchase" : "Save Purchase Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}