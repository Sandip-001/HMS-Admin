"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter, Phone, Mail, MapPin, Building2, UserCheck, Star, Calendar, IndianRupee, FileText, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PHARMACY_SUPPLIERS, SUPPLIER_TYPE_OPTIONS, STATUS_OPTIONS, PAYMENT_TERMS_OPTIONS } from "@/lib/pharmacy/supplier-data";
import { SupplierFormDialog } from "./_components/supplier-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { SupplierFormData, PharmacySupplier } from "@/types/pharmacy/supplier-types";

export default function PharmacySuppliersPage() {
  const [suppliers, setSuppliers] = useState<PharmacySupplier[]>(PHARMACY_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<PharmacySupplier | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; supplierId?: string; supplierName?: string }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.supplierCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "All" || supplier.activeStatus === statusFilter;
    const matchesType = typeFilter === "All" || supplier.supplierType === typeFilter;
    const matchesPayment = paymentFilter === "All" || supplier.paymentTerms === paymentFilter;
    return matchesSearch && matchesStatus && matchesType && matchesPayment;
  });

  function handleAddSupplier() {
    setEditingSupplier(null);
    setIsModalOpen(true);
  }

  function handleEditSupplier(supplier: PharmacySupplier) {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  }

  function handleDeleteClick(supplier: PharmacySupplier) {
    setDeleteDialog({ open: true, supplierId: supplier.supplierId, supplierName: supplier.supplierName });
  }

  function handleConfirmDelete() {
    if (deleteDialog.supplierId) {
      setIsDeleting(true);
      setTimeout(() => {
        setSuppliers((prev) => prev.filter((s) => s.supplierId !== deleteDialog.supplierId));
        setDeleteDialog({ open: false });
        setIsDeleting(false);
      }, 800);
    }
  }

  function handleSaveSupplier(data: SupplierFormData) {
    if (editingSupplier && editingSupplier.supplierId) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.supplierId === editingSupplier.supplierId
            ? { ...s, ...data }
            : s
        )
      );
    } else {
      const newSupplier: PharmacySupplier = {
        ...data,
        supplierId: String(suppliers.length + 1),
        supplierCode: `SUP-2024-${String(suppliers.length + 1).padStart(3, "0")}`,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setSuppliers((prev) => [...prev, newSupplier]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Supplier Management
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage pharmaceutical suppliers and vendors
              </p>
            </div>
            <Button
              onClick={handleAddSupplier}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Suppliers</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{suppliers.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Suppliers</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {suppliers.filter((s) => s.activeStatus === "Active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Outstanding</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  ₹{(suppliers.reduce((sum, s) => sum + Number(s.outstandingAmount || 0), 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Rating</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {(suppliers.reduce((sum, s) => sum + Number(s.performanceRating || 0), 0) / suppliers.length).toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "All")}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "All")}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                {SUPPLIER_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v ?? "All")}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Filter by payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Terms</SelectItem>
                {PAYMENT_TERMS_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop Table - Scrollable Container */}
        <div className="hidden xl:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1400px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Supplier</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Code</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Contact</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">GST/PAN</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Credit Limit</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Terms</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Outstanding</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Rating</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.map((supplier, index) => (
                  <tr key={supplier.supplierId} className="hover:bg-slate-50/80 transition-colors" style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                          {supplier.supplierName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate max-w-[200px]">{supplier.supplierName}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{supplier.phone}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-slate-600">{supplier.supplierCode}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-blue-100 text-blue-700">{supplier.supplierType}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{supplier.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs">
                        <p className="font-mono text-slate-600 truncate max-w-[140px]">{supplier.gst}</p>
                        <p className="font-mono text-slate-500 truncate max-w-[140px]">{supplier.pan}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-slate-700">₹{Number(supplier.creditLimit).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-700">{supplier.paymentTerms}</p>
                      <p className="text-xs text-slate-500">{supplier.creditDays} days</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-orange-600">₹{Number(supplier.outstandingAmount).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-700">{supplier.performanceRating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={supplier.activeStatus === "Active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
                        {supplier.activeStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditSupplier(supplier)} className="hover:bg-blue-50 hover:text-blue-600 flex-shrink-0">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(supplier)} className="hover:bg-red-50 hover:text-red-600 flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuppliers.map((supplier, index) => (
            <div
              key={supplier.supplierId}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                    {supplier.supplierName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-base truncate">{supplier.supplierName}</h3>
                    <p className="text-xs text-slate-500 font-mono truncate">{supplier.supplierCode}</p>
                  </div>
                </div>
                <Badge className={supplier.activeStatus === "Active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200 flex-shrink-0"}>
                  {supplier.activeStatus}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Truck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{supplier.supplierType}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href={`tel:${supplier.phone}`} className="text-blue-600 hover:underline truncate">{supplier.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href={`mailto:${supplier.email}`} className="truncate">{supplier.email}</a>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{supplier.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Credit Limit</p>
                  <p className="font-bold text-slate-800">₹{Number(supplier.creditLimit).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Outstanding</p>
                  <p className="font-bold text-orange-600">₹{Number(supplier.outstandingAmount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Payment Terms</p>
                  <p className="font-semibold text-slate-700">{supplier.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800">{supplier.performanceRating}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => handleEditSupplier(supplier)} className="flex-1 hover:bg-blue-50 hover:text-blue-600">
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(supplier)} className="flex-1 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No suppliers found</h3>
            <p className="text-slate-500 mb-4">
              {searchQuery || statusFilter !== "All" || typeFilter !== "All" || paymentFilter !== "All" ? "Try adjusting your filters" : "Get started by adding your first supplier"}
            </p>
            {!searchQuery && statusFilter === "All" && typeFilter === "All" && paymentFilter === "All" && (
              <Button onClick={handleAddSupplier} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <SupplierFormDialog open={isModalOpen} onOpenChange={setIsModalOpen} editingSupplier={editingSupplier} onSave={handleSaveSupplier} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Supplier"
        description={`Are you sure you want to delete "${deleteDialog.supplierName}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}