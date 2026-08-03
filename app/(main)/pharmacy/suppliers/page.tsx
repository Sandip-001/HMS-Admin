// app/admin/pharmacy/suppliers/page.tsx
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupplierCard } from "./_components/supplier-card";
import { SupplierFormDialog } from "./_components/supplier-form-dialog";
import { DeleteSupplierDialog } from "./_components/delete-supplier-dialog";
import { SUPPLIERS } from "@/lib/pharmacy/supplier-data";
import type { Supplier, SupplierFormData } from "@/types/pharmacy/supplier-types";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter(
        (s) =>
          s.supplierName.toLowerCase().includes(search.toLowerCase()) ||
          s.contactPerson.toLowerCase().includes(search.toLowerCase())
      ),
    [suppliers, search]
  );

  function handleOpenAdd() {
    setEditingSupplier(null);
    setFormOpen(true);
  }

  function handleOpenEdit(supplier: Supplier) {
    setEditingSupplier(supplier);
    setFormOpen(true);
  }

  function handleSaveSupplier(data: SupplierFormData) {
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? { ...s, ...data } : s))
      );
      toast.success(`Supplier "${data.supplierName}" updated`);
    } else {
      setSuppliers((prev) => [
        {
          id: `SUP-${Date.now()}`,
          ...data,
          createdOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        },
        ...prev,
      ]);
      toast.success(`Supplier "${data.supplierName}" added`);
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    setSuppliers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast.success(`Supplier "${deleteTarget.supplierName}" deleted`);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Suppliers</h1>
            <p className="mt-1 text-sm text-slate-500">Manage pharmacy medicine suppliers and their contact details.</p>
          </div>

          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4" /> Add Supplier
          </Button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Truck className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-slate-500">Total Suppliers</p>
            <p className="text-xl font-bold text-slate-800">{suppliers.length}</p>
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search suppliers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onEdit={() => handleOpenEdit(supplier)}
              onDelete={() => setDeleteTarget(supplier)}
            />
          ))}
          {filteredSuppliers.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-slate-400">No suppliers found.</p>
          )}
        </div>
      </div>

      <SupplierFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editingSupplier={editingSupplier}
        onSave={handleSaveSupplier}
      />

      <DeleteSupplierDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        supplierName={deleteTarget?.supplierName ?? ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}