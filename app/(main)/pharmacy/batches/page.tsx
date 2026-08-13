"use client";

import { useState } from "react";
import {
  Plus, Search, Layers, PackageCheck, AlertTriangle, XCircle,
  MapPin, Calendar, ChevronLeft, ChevronRight, Package,
  Eye, Pencil, Trash2, LayoutGrid, List as ListIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BATCH_RECORDS, MEDICINE_DROPDOWN_OPTIONS, STATUS_OPTIONS } from "@/lib/pharmacy/batch-data";
import { getDaysToExpiry, getStatusColor } from "@/lib/pharmacy/batch-helpers";
import { BatchFormDialog } from "./_components/batch-form-dialog";
import { BatchViewDialog } from "./_components/batch-view-dialog";
import type { BatchFormData, MedicineBatchRecord } from "@/types/pharmacy/batch-types";
import { cn } from "@/lib/utils";
import { PaginationBar } from "./_components/paginationBar";
import { EmptyState } from "./_components/emptyState";

type ViewMode = "list" | "grid";

export default function PharmacyBatchesPage() {
  const [batches, setBatches] = useState<MedicineBatchRecord[]>(BATCH_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [medicineFilter, setMedicineFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<MedicineBatchRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingBatch, setViewingBatch] = useState<MedicineBatchRecord | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; batchNumber?: string }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.purchaseInvoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.grnNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || batch.status === statusFilter;
    const matchesMedicine = medicineFilter === "All" || batch.medicineId === medicineFilter;
    return matchesSearch && matchesStatus && matchesMedicine;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBatches = filteredBatches.slice(startIndex, endIndex);

  const totalBatches = batches.length;
  const activeCount = batches.filter((b) => b.status === "Active").length;
  const nearExpiryCount = batches.filter((b) => b.status === "Near Expiry").length;
  const expiredCount = batches.filter((b) => b.status === "Expired").length;

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value);
    setCurrentPage(1);
  }

  function handleAddBatch() {
    setEditingBatch(null);
    setIsFormOpen(true);
  }

  function handleEditBatch(batch: MedicineBatchRecord) {
    setEditingBatch(batch);
    setIsFormOpen(true);
  }

  function handleViewBatch(batch: MedicineBatchRecord) {
    setViewingBatch(batch);
    setIsViewOpen(true);
  }

  function handleDeleteClick(batch: MedicineBatchRecord) {
    setDeleteDialog({ open: true, id: batch.id, batchNumber: batch.batchNumber });
  }

  function handleConfirmDelete() {
    if (deleteDialog.id) {
      setIsDeleting(true);
      setTimeout(() => {
        setBatches((prev) => prev.filter((b) => b.id !== deleteDialog.id));
        setDeleteDialog({ open: false });
        setIsDeleting(false);
      }, 800);
    }
  }

  function handleSaveBatch(data: BatchFormData) {
    if (editingBatch) {
      setBatches((prev) => prev.map((b) => (b.id === editingBatch.id ? { ...b, ...data } : b)));
    } else {
      const newBatch: MedicineBatchRecord = {
        ...data,
        id: String(batches.length + 1),
      };
      setBatches((prev) => [...prev, newBatch]);
    }
  }

  function getActionItems(batch: MedicineBatchRecord): ActionMenuItem[] {
    return [
      { label: "View Details", icon: <Eye className="w-4 h-4" />, onClick: () => handleViewBatch(batch) },
      { label: "Edit Batch", icon: <Pencil className="w-4 h-4" />, onClick: () => handleEditBatch(batch) },
      { label: "Delete Batch", icon: <Trash2 className="w-4 h-4" />, onClick: () => handleDeleteClick(batch), variant: "danger" },
    ];
  }

  const hasActiveFilters = !!searchQuery || statusFilter !== "All" || medicineFilter !== "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Batch Master
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track medicine batches, expiry and stock movement
              </p>
            </div>
            <Button
              onClick={handleAddBatch}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Batch
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
                <p className="text-sm text-slate-500">Total Batches</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{totalBatches}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{activeCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <PackageCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Near Expiry</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{nearExpiryCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Expired</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{expiredCount}</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search batch, medicine, invoice..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <Select value={medicineFilter} onValueChange={(v) => handleFilterChange(setMedicineFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by medicine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Medicines</SelectItem>
                  {MEDICINE_DROPDOWN_OPTIONS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => handleFilterChange(setStatusFilter, v ?? "All")}>
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

        {/* LIST VIEW — Table on EVERY screen size (scrolls horizontally on small screens, never swaps to cards) */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[1400px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Batch / Medicine</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Mfg / Expiry</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Invoice / GRN</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Pricing</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">GST / Disc.</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Quantities</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Location</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Status</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedBatches.map((batch, index) => {
                    const daysLeft = getDaysToExpiry(batch.expiryDate);
                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors" style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                              {batch.batchNumber.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate max-w-[180px]">{batch.batchNumber}</p>
                              <p className="text-xs text-slate-500 truncate max-w-[180px]">{batch.medicineName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600">
                            <p>Mfg: {batch.manufacturingDate}</p>
                            <p className={daysLeft <= 90 && daysLeft > 0 ? "text-amber-600 font-medium" : daysLeft <= 0 ? "text-red-600 font-medium" : ""}>
                              Exp: {batch.expiryDate}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-700 truncate max-w-[160px]">{batch.purchaseInvoice}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[160px]">{batch.grnNumber}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-700">MRP ₹{batch.mrp}</p>
                          <p className="text-xs text-slate-500">Sell ₹{batch.sellingPrice} • PP ₹{batch.purchasePrice}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-700">{batch.gst}% GST</p>
                          <p className="text-xs text-slate-500">{batch.discount}% Disc.</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-slate-800">{batch.currentQuantity} <span className="text-xs text-slate-500 font-normal">/ {batch.receivedQuantity}</span></p>
                          <p className="text-xs text-slate-500">Free {batch.freeQuantity} • Rej {batch.rejectedQuantity}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate max-w-[140px]">{batch.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <ActionMenu items={getActionItems(batch)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {paginatedBatches.length === 0 && <EmptyState hasActiveFilters={hasActiveFilters} onAdd={handleAddBatch} />}

            {paginatedBatches.length > 0 && (
              <PaginationBar
                startIndex={startIndex}
                endIndex={endIndex}
                total={filteredBatches.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </div>
        )}

        {/* GRID VIEW — Cards on EVERY screen size, only shown when Grid is selected */}
        {viewMode === "grid" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedBatches.map((batch, index) => {
                const daysLeft = getDaysToExpiry(batch.expiryDate);
                return (
                  <div
                    key={batch.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {batch.batchNumber.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 text-base truncate">{batch.batchNumber}</h3>
                          <p className="text-xs text-slate-500 truncate">{batch.medicineName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                        <ActionMenu items={getActionItems(batch)} />
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>Mfg: {batch.manufacturingDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className={daysLeft <= 90 && daysLeft > 0 ? "text-amber-600 font-medium" : daysLeft <= 0 ? "text-red-600 font-medium" : ""}>
                          Exp: {batch.expiryDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{batch.purchaseInvoice} • {batch.grnNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{batch.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500">MRP / Selling</p>
                        <p className="font-bold text-slate-800">₹{batch.mrp} / ₹{batch.sellingPrice}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">GST / Discount</p>
                        <p className="font-bold text-slate-800">{batch.gst}% / {batch.discount}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Current / Received</p>
                        <p className="font-bold text-slate-800">{batch.currentQuantity} / {batch.receivedQuantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Free / Rejected</p>
                        <p className="font-bold text-slate-800">{batch.freeQuantity} / {batch.rejectedQuantity}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {paginatedBatches.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200">
                <EmptyState hasActiveFilters={hasActiveFilters} onAdd={handleAddBatch} />
              </div>
            )}

            {paginatedBatches.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 mt-4">
                <PaginationBar
                  startIndex={startIndex}
                  endIndex={endIndex}
                  total={filteredBatches.length}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      <BatchFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} editingBatch={editingBatch} onSave={handleSaveBatch} />

      {/* View Modal */}
      <BatchViewDialog open={isViewOpen} onOpenChange={setIsViewOpen} batch={viewingBatch} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Batch"
        description={`Are you sure you want to delete batch "${deleteDialog.batchNumber}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}


