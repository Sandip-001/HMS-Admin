// app/admin/pharmacy/stock-update/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Boxes, IndianRupee, Plus, Search, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StockEntriesTable } from "./_components/stock-entries-table";
import { StockFormDialog } from "./_components/stock-form-dialog";
import { DeleteStockDialog } from "./_components/delete-stock-dialog";
import { STOCK_UPDATE_ENTRIES, MEDICINE_OPTIONS } from "@/lib/pharmacy/stock-update-data";
import { calculateTotalAmount } from "@/lib/pharmacy/stock-update-helpers";
import type { StockUpdateEntry, StockUpdateFormData } from "@/types/pharmacy/stock-update-types";

export default function StockUpdatePage() {
  const searchParams = useSearchParams();
  const preselectedMedicineId = searchParams.get("medicineId");

  const [entries, setEntries] = useState<StockUpdateEntry[]>(STOCK_UPDATE_ENTRIES);
  const [search, setSearch] = useState("");
  const [medicineFilter, setMedicineFilter] = useState<string | null>("All Medicines");
  const [statusFilter, setStatusFilter] = useState<string | null>("All Status");

  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<StockUpdateEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockUpdateEntry | null>(null);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.medicineName.toLowerCase().includes(search.toLowerCase()) ||
        entry.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        entry.supplier.toLowerCase().includes(search.toLowerCase());
      const matchesMedicine = medicineFilter === "All Medicines" || entry.medicineName === medicineFilter;
      const matchesStatus = statusFilter === "All Status" || entry.status === statusFilter;
      return matchesSearch && matchesMedicine && matchesStatus;
    });
  }, [entries, search, medicineFilter, statusFilter]);

  const totalPurchaseValue = entries.reduce((sum, e) => sum + e.totalAmount, 0);
  const unpaidCount = entries.filter((e) => e.status === "Unpaid").length;
  const totalUnitsStocked = entries.reduce((sum, e) => sum + e.quantity, 0);

  function handleOpenAdd() {
    setEditingEntry(null);
    setFormOpen(true);
  }

  function handleSaveEntry(data: StockUpdateFormData) {
    const totalAmount = calculateTotalAmount(data);
    const purchaseDateFormatted = new Date(data.purchaseDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const expiryDateFormatted = new Date(data.expiryDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

    if (editingEntry) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingEntry.id
            ? {
                ...e,
                supplier: data.supplier,
                invoiceNumber: data.invoiceNumber,
                purchaseDate: purchaseDateFormatted,
                medicineName: data.medicineName,
                batchNo: data.batchNo,
                purchasePrice: Number(data.purchasePrice),
                sellingPrice: Number(data.sellingPrice),
                mrp: Number(data.mrp),
                expiryDate: expiryDateFormatted,
                quantity: Number(data.quantity),
                gstPercent: Number(data.gstPercent) || 0,
                discountPercent: Number(data.discountPercent) || 0,
                totalAmount,
                status: data.status,
              }
            : e
        )
      );
      toast.success(`Stock entry "${data.invoiceNumber}" updated`);
    } else {
      setEntries((prev) => [
        {
          id: `STK-${Date.now()}`,
          supplier: data.supplier,
          invoiceNumber: data.invoiceNumber,
          purchaseDate: purchaseDateFormatted,
          medicineName: data.medicineName,
          batchNo: data.batchNo,
          purchasePrice: Number(data.purchasePrice),
          sellingPrice: Number(data.sellingPrice),
          mrp: Number(data.mrp),
          expiryDate: expiryDateFormatted,
          quantity: Number(data.quantity),
          gstPercent: Number(data.gstPercent) || 0,
          discountPercent: Number(data.discountPercent) || 0,
          totalAmount,
          status: data.status,
        },
        ...prev,
      ]);
      toast.success(`Stock added for "${data.medicineName}" (Batch ${data.batchNo})`);
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    toast.success(`Stock entry "${deleteTarget.invoiceNumber}" deleted`);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Stock Update</h1>
            <p className="mt-1 text-sm text-slate-500">Track purchase invoices, batch pricing, and supplier payments.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4" /> Update Stock
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><IndianRupee className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Total Purchase Value</p><p className="text-2xl font-bold text-slate-800">₹{totalPurchaseValue.toLocaleString()}</p></div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Boxes className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Total Units Stocked</p><p className="text-2xl font-bold text-slate-800">{totalUnitsStocked}</p></div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><CircleDollarSign className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Unpaid Invoices</p><p className="text-2xl font-bold text-slate-800">{unpaidCount}</p></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search invoice, medicine or supplier" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>

            <Select value={medicineFilter} onValueChange={setMedicineFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Medicines">All Medicines</SelectItem>
                {MEDICINE_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <StockEntriesTable
            entries={filteredEntries}
            onEdit={(entry) => { setEditingEntry(entry); setFormOpen(true); }}
            onDelete={(entry) => setDeleteTarget(entry)}
          />
        </div>
      </div>

      <StockFormDialog open={formOpen} onOpenChange={setFormOpen} editingEntry={editingEntry} onSave={handleSaveEntry} />
      <DeleteStockDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        invoiceNumber={deleteTarget?.invoiceNumber ?? ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}