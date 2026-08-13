"use client";

import { useState } from "react";
import {
  Plus, Search, Pill, PackageCheck, AlertTriangle, XCircle,
  Eye, Pencil, Trash2, Download, MapPin, ShieldAlert,
  LayoutGrid, List as ListIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MEDICINES, CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/lib/pharmacy/medicine-data";
import {
  getCurrentStock, getEarliestExpiry, getStockStatus, getStockStatusColor,
} from "@/lib/pharmacy/medicine-helpers";
import { MedicineFormDialog } from "./_components/medicine-form-dialog";
import { MedicineViewDialog } from "./_components/medicine-view-dialog";
import type { Medicine, MedicineFormData } from "@/types/pharmacy/medicine-types";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

export default function PharmacyMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(MEDICINES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; name?: string }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.generic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.medicineCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.barcode.includes(searchQuery);
    const matchesStatus = statusFilter === "All" || med.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || med.category === categoryFilter;
    const matchesStock = stockFilter === "All" || getStockStatus(med) === stockFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesStock;
  });

  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter((m) => getStockStatus(m) === "Low Stock").length;
  const outOfStockCount = medicines.filter((m) => getStockStatus(m) === "Out of Stock").length;
  const availableCount = medicines.filter((m) => getStockStatus(m) === "Available").length;

  function handleAddMedicine() {
    setEditingMedicine(null);
    setIsFormOpen(true);
  }

  function handleEditMedicine(medicine: Medicine) {
    setEditingMedicine(medicine);
    setIsFormOpen(true);
  }

  function handleViewMedicine(medicine: Medicine) {
    setViewingMedicine(medicine);
    setIsViewOpen(true);
  }

  function handleDeleteClick(medicine: Medicine) {
    setDeleteDialog({ open: true, id: medicine.id, name: medicine.medicineName });
  }

  function handleConfirmDelete() {
    if (deleteDialog.id) {
      setIsDeleting(true);
      setTimeout(() => {
        setMedicines((prev) => prev.filter((m) => m.id !== deleteDialog.id));
        setDeleteDialog({ open: false });
        setIsDeleting(false);
      }, 800);
    }
  }

  function handleDownloadBarcode(medicine: Medicine) {
    // Opens the view dialog where the barcode/QR download actions are available.
    setViewingMedicine(medicine);
    setIsViewOpen(true);
  }

  function handleSaveMedicine(data: MedicineFormData) {
    if (editingMedicine) {
      setMedicines((prev) =>
        prev.map((m) => (m.id === editingMedicine.id ? { ...m, ...data, updatedBy: "Current User" } : m))
      );
    } else {
      const newMedicine: Medicine = {
        ...data,
        id: String(medicines.length + 1),
        medicineCode: `MED-2024-${String(medicines.length + 1).padStart(3, "0")}`,
        createdBy: "Current User",
        updatedBy: "Current User",
        batches: [],
      };
      setMedicines((prev) => [...prev, newMedicine]);
    }
  }

  function getActionItems(medicine: Medicine): ActionMenuItem[] {
    return [
      { label: "View Details", icon: <Eye className="w-4 h-4" />, onClick: () => handleViewMedicine(medicine) },
      { label: "Edit Medicine", icon: <Pencil className="w-4 h-4" />, onClick: () => handleEditMedicine(medicine) },
      { label: "Download Barcode / QR", icon: <Download className="w-4 h-4" />, onClick: () => handleDownloadBarcode(medicine) },
      { label: "Delete Medicine", icon: <Trash2 className="w-4 h-4" />, onClick: () => handleDeleteClick(medicine), variant: "danger" },
    ];
  }

  const hasActiveFilters =
    !!searchQuery || statusFilter !== "All" || categoryFilter !== "All" || stockFilter !== "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Medicine Master
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage medicine catalog, stock control and safety information
              </p>
            </div>
            <Button
              onClick={handleAddMedicine}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Medicines</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{totalMedicines}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Available</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{availableCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <PackageCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Low Stock</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{outOfStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters + View Toggle */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search medicine, generic, code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={(v) => setStockFilter(v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Stock Levels</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* List / Grid Toggle */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 self-start lg:self-auto">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
                aria-label="List view"
              >
                <ListIcon className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* LIST VIEW — Table (desktop) / Cards (mobile+tablet) */}
        {viewMode === "list" && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[1300px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Medicine</th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Category</th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Brand / Mfr.</th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Location</th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Stock</th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Nearest Expiry</th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Flags</th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMedicines.map((medicine, index) => {
                      const currentStock = getCurrentStock(medicine);
                      const stockStatus = getStockStatus(medicine);
                      const flagCount = [
                        medicine.controlledDrug, medicine.narcotic, medicine.lasaMedicine,
                        medicine.highAlertMedicine, medicine.lookAlikeSoundAlike, medicine.prescriptionRequired,
                      ].filter(Boolean).length;

                      return (
                        <tr key={medicine.id} className="hover:bg-slate-50/80 transition-colors" style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                                {medicine.medicineName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 truncate max-w-[200px]">{medicine.medicineName}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{medicine.medicineCode} • {medicine.strength}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">{medicine.category}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-slate-700">{medicine.brand}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[160px]">{medicine.manufacturer}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              {medicine.rack}/{medicine.shelf}/{medicine.bin}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStockStatusColor(stockStatus)}>
                              {currentStock} • {stockStatus}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-slate-600">{getEarliestExpiry(medicine)}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {flagCount > 0 ? (
                              <Badge className="bg-orange-100 text-orange-700 flex items-center gap-1 w-fit">
                                <ShieldAlert className="w-3 h-3" />
                                {flagCount} Flag{flagCount > 1 ? "s" : ""}
                              </Badge>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={medicine.status === "Active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
                              {medicine.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <ActionMenu items={getActionItems(medicine)} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* GRID VIEW — Cards on all breakpoints */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMedicines.map((medicine, index) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                index={index}
                actionItems={getActionItems(medicine)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredMedicines.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No medicines found</h3>
            <p className="text-slate-500 mb-4">
              {hasActiveFilters ? "Try adjusting your filters" : "Get started by adding your first medicine"}
            </p>
            {!hasActiveFilters && (
              <Button onClick={handleAddMedicine} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <MedicineFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingMedicine={editingMedicine}
        onSave={handleSaveMedicine}
      />

      {/* View Modal */}
      <MedicineViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        medicine={viewingMedicine}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Medicine"
        description={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />

    </div>
  );
}

function MedicineCard({
  medicine,
  index,
  actionItems,
}: {
  medicine: Medicine;
  index: number;
  actionItems: ActionMenuItem[];
}) {
  const currentStock = getCurrentStock(medicine);
  const stockStatus = getStockStatus(medicine);
  const flagCount = [
    medicine.controlledDrug, medicine.narcotic, medicine.lasaMedicine,
    medicine.highAlertMedicine, medicine.lookAlikeSoundAlike, medicine.prescriptionRequired,
  ].filter(Boolean).length;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
            {medicine.medicineName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-base truncate">{medicine.medicineName}</h3>
            <p className="text-xs text-slate-500 truncate">{medicine.medicineCode} • {medicine.strength}</p>
          </div>
        </div>
        <ActionMenu items={actionItems} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="secondary" className="bg-slate-100 text-slate-700">{medicine.category}</Badge>
        <Badge className={medicine.status === "Active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
          {medicine.status}
        </Badge>
        {flagCount > 0 && (
          <Badge className="bg-orange-100 text-orange-700 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            {flagCount} Flag{flagCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Brand / Manufacturer</span>
          <span className="font-medium text-slate-700 truncate max-w-[160px]">{medicine.brand}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Location
          </span>
          <span className="font-medium text-slate-700">{medicine.rack}/{medicine.shelf}/{medicine.bin}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Nearest Expiry</span>
          <span className="font-medium text-slate-700">{getEarliestExpiry(medicine)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Badge className={getStockStatusColor(stockStatus)}>
          {currentStock} • {stockStatus}
        </Badge>
        <span className="text-xs text-slate-500">Min: {medicine.minimumStock}</span>
      </div>
    </div>
  );
}