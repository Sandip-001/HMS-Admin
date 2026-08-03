// app/admin/pharmacy/medicines/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pill, Plus, Boxes, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicineFilters } from "./_components/medicine-filters";
import { MedicinesTable } from "./_components/medicines-table";
import { MedicineFormDialog } from "./_components/medicine-form-dialog";
import { ViewMedicineDialog } from "./_components/view-medicine-dialog";
import { DeleteMedicineDialog } from "./_components/delete-medicine-dialog";
import { MEDICINES } from "@/lib/pharmacy/medicine-data";
import { getStockStatus, getTotalStock } from "@/lib/pharmacy/medicine-helpers";
import type { Medicine, MedicineFormData } from "@/types/pharmacy/medicine-types";

export default function MedicinesPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>(MEDICINES);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>("All Categories");
  const [brandFilter, setBrandFilter] = useState<string | null>("All Brands");
  const [statusFilter, setStatusFilter] = useState<string | null>("All Status");

  const [formOpen, setFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);

  const filteredMedicines = useMemo(() => {
  return medicines.filter((med) => {
    const matchesSearch =
      med.medicineName.toLowerCase().includes(search.toLowerCase()) ||
      med.generic.toLowerCase().includes(search.toLowerCase());

    const selectedCategory = categoryFilter ?? "All Categories";
    const selectedBrand = brandFilter ?? "All Brands";
    const selectedStatus = statusFilter ?? "All Status";

    const matchesCategory =
      selectedCategory === "All Categories" || med.category === selectedCategory;

    const matchesBrand =
      selectedBrand === "All Brands" || med.brand === selectedBrand;

    const matchesStatus =
      selectedStatus === "All Status" || getStockStatus(med) === selectedStatus;

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });
}, [medicines, search, categoryFilter, brandFilter, statusFilter]);

  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter((m) => getStockStatus(m) === "Low Stock").length;
  const outOfStockCount = medicines.filter((m) => getStockStatus(m) === "Out of Stock").length;

  function handleOpenAdd() {
    setEditingMedicine(null);
    setFormOpen(true);
  }

  function handleSaveMedicine(data: MedicineFormData) {
    if (editingMedicine) {
      setMedicines((prev) =>
        prev.map((m) => (m.id === editingMedicine.id ? { ...m, ...data, minimumStock: Number(data.minimumStock) } : m))
      );
      toast.success(`Medicine "${data.medicineName}" updated`);
    } else {
      setMedicines((prev) => [
        { id: `MED-${Date.now()}`, ...data, minimumStock: Number(data.minimumStock), batches: [] },
        ...prev,
      ]);
      toast.success(`Medicine "${data.medicineName}" added`);
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    setMedicines((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    toast.success(`Medicine "${deleteTarget.medicineName}" deleted`);
    setDeleteTarget(null);
  }

  function handleRestock(medicine: Medicine) {
    router.push(`/admin/pharmacy/stock-update?medicineId=${medicine.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Medicines</h1>
            <p className="mt-1 text-sm text-slate-500">Manage medicines, batches, pricing, and stock across the pharmacy.</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4" /> Add Medicine
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Pill className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Total Medicines</p><p className="text-2xl font-bold text-slate-800">{totalMedicines}</p></div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Boxes className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Low Stock</p><p className="text-2xl font-bold text-slate-800">{lowStockCount}</p></div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Out of Stock</p><p className="text-2xl font-bold text-slate-800">{outOfStockCount}</p></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <MedicineFilters
              search={search} onSearchChange={setSearch}
              categoryFilter={categoryFilter} onCategoryFilterChange={setCategoryFilter}
              brandFilter={brandFilter} onBrandFilterChange={setBrandFilter}
              statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
            />
          </div>

          <MedicinesTable
            medicines={filteredMedicines}
            onView={(m) => { setViewingMedicine(m); setViewOpen(true); }}
            onEdit={(m) => { setEditingMedicine(m); setFormOpen(true); }}
            onRestock={handleRestock}
            onDelete={(m) => setDeleteTarget(m)}
          />
        </div>
      </div>

      <MedicineFormDialog open={formOpen} onOpenChange={setFormOpen} editingMedicine={editingMedicine} onSave={handleSaveMedicine} />
      <ViewMedicineDialog open={viewOpen} onOpenChange={setViewOpen} medicine={viewingMedicine} />
      <DeleteMedicineDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        medicineName={deleteTarget?.medicineName ?? ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}