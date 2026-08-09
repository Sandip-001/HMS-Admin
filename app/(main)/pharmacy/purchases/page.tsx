"use client";

import { useState } from "react";
import {
  Plus, Search, ShoppingCart, PackageCheck, Clock, XCircle,
  Pencil, Trash2, Eye, MapPin, Calendar, ChevronLeft, ChevronRight, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PURCHASE_ORDERS, SUPPLIER_DROPDOWN_OPTIONS, STATUS_OPTIONS } from "@/lib/pharmacy/purchase-data";
import { calculatePurchaseTotal, getStatusColor } from "@/lib/pharmacy/purchase-helpers";
import { PurchaseFormDialog } from "./_components/purchase-form-dialog";
import type { PurchaseFormData, PurchaseOrder } from "@/types/pharmacy/purchase-types";

export default function PharmacyPurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(PURCHASE_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseOrder | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; poNumber?: string }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredPurchases = purchases.filter((po) => {
    const matchesSearch =
      po.poNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || po.status === statusFilter;
    const matchesSupplier = supplierFilter === "All" || po.supplierId === supplierFilter;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);

  const totalPOs = purchases.length;
  const completedCount = purchases.filter((p) => p.status === "Completed").length;
  const pendingCount = purchases.filter((p) => p.status === "Pending" || p.status === "Draft").length;
  const cancelledCount = purchases.filter((p) => p.status === "Cancelled").length;
  const totalValue = purchases.reduce((sum, p) => sum + calculatePurchaseTotal(p.items), 0);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value);
    setCurrentPage(1);
  }

  function handleAddPurchase() {
    setEditingPurchase(null);
    setIsFormOpen(true);
  }

  function handleEditPurchase(po: PurchaseOrder) {
    setEditingPurchase(po);
    setIsFormOpen(true);
  }

  function handleDeleteClick(po: PurchaseOrder) {
    setDeleteDialog({ open: true, id: po.id, poNumber: po.poNumber });
  }

  function handleConfirmDelete() {
    if (deleteDialog.id) {
      setIsDeleting(true);
      setTimeout(() => {
        setPurchases((prev) => prev.filter((p) => p.id !== deleteDialog.id));
        setDeleteDialog({ open: false });
        setIsDeleting(false);
      }, 800);
    }
  }

  function handleSavePurchase(data: PurchaseFormData) {
    if (editingPurchase) {
      setPurchases((prev) => prev.map((p) => (p.id === editingPurchase.id ? { ...p, ...data } : p)));
    } else {
      const newPurchase: PurchaseOrder = {
        ...data,
        id: String(purchases.length + 1),
        poNumber: `PO-2024-${String(purchases.length + 1).padStart(3, "0")}`,
      };
      setPurchases((prev) => [...prev, newPurchase]);
    }
  }

  function getActionItems(po: PurchaseOrder): ActionMenuItem[] {
    return [
      { label: "Edit Purchase", icon: <Pencil className="w-4 h-4" />, onClick: () => handleEditPurchase(po) },
      { label: "Delete Purchase", icon: <Trash2 className="w-4 h-4" />, onClick: () => handleDeleteClick(po), variant: "danger" },
    ];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Purchase Master
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Record and track incoming stock purchases from suppliers
              </p>
            </div>
            <Button
              onClick={handleAddPurchase}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Purchase Entry
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
                <p className="text-sm text-slate-500">Total Purchase Orders</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{totalPOs}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <PackageCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending / Draft</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Purchase Value</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">₹{(totalValue / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search PO, GRN, invoice, supplier..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <Select value={supplierFilter} onValueChange={(v) => handleFilterChange(setSupplierFilter, v ?? "All")}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Suppliers</SelectItem>
                {SUPPLIER_DROPDOWN_OPTIONS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => handleFilterChange(setStatusFilter, v ?? "All")}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden xl:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1300px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">PO / Supplier</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">GRN / Invoice</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Purchase / Received</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Payment Mode</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Warehouse</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Items</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Total Value</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPurchases.map((po, index) => {
                  const total = calculatePurchaseTotal(po.items);
                  return (
                    <tr key={po.id} className="hover:bg-slate-50/80 transition-colors" style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                            {po.supplierName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[160px]">{po.poNumber}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[160px]">{po.supplierName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-700 truncate max-w-[160px]">{po.grnNumber || "—"}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[160px]">{po.invoice || "—"}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {po.purchaseDate || "—"}
                        </div>
                        <p className="text-xs text-slate-500 pl-4.5">Recv: {po.receivedDate || "Pending"}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">{po.paymentMode || "—"}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">{po.warehouse}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{po.items.length} item{po.items.length !== 1 ? "s" : ""}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-800">₹{total.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(po.status)}>{po.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ActionMenu items={getActionItems(po)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginatedPurchases.length > 0 && (
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredPurchases.length)} of {filteredPurchases.length} purchases
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="border-slate-200">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "border-slate-200"}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="border-slate-200">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile / Tablet Cards */}
        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedPurchases.map((po, index) => {
            const total = calculatePurchaseTotal(po.items);
            return (
              <div
                key={po.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                      {po.supplierName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 text-base truncate">{po.poNumber}</h3>
                      <p className="text-xs text-slate-500 truncate">{po.supplierName}</p>
                    </div>
                  </div>
                  <ActionMenu items={getActionItems(po)} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge className={getStatusColor(po.status)}>{po.status}</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">{po.paymentMode || "—"}</Badge>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">GRN / Invoice</span>
                    <span className="font-medium text-slate-700 truncate max-w-[160px]">{po.grnNumber || "—"} / {po.invoice || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Purchase Date
                    </span>
                    <span className="font-medium text-slate-700">{po.purchaseDate || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Warehouse
                    </span>
                    <span className="font-medium text-slate-700 truncate max-w-[140px]">{po.warehouse}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Items</p>
                    <p className="font-bold text-slate-800">{po.items.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total Value</p>
                    <p className="font-bold text-blue-700">₹{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Mobile Pagination */}
          {paginatedPurchases.length > 0 && (
            <div className="md:col-span-2 flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-600">
                {startIndex + 1}-{Math.min(endIndex, filteredPurchases.length)} of {filteredPurchases.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="border-slate-200">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-700 px-2">{currentPage} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="border-slate-200">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredPurchases.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No purchase entries found</h3>
            <p className="text-slate-500 mb-4">
              {searchQuery || statusFilter !== "All" || supplierFilter !== "All"
                ? "Try adjusting your filters"
                : "Get started by creating your first purchase entry"}
            </p>
            {!searchQuery && statusFilter === "All" && supplierFilter === "All" && (
              <Button onClick={handleAddPurchase} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                New Purchase Entry
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <PurchaseFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} editingPurchase={editingPurchase} onSave={handleSavePurchase} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Purchase Entry"
        description={`Are you sure you want to delete purchase "${deleteDialog.poNumber}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />

    </div>
  );
}