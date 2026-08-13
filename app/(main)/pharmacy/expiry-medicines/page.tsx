"use client";

import { useMemo, useState } from "react";
import {
  Search, AlertTriangle, XCircle, Clock, IndianRupee,
  Eye, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight,
  Download, MapPin, Package, CalendarDays, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { CATEGORY_OPTIONS, BRAND_OPTIONS } from "@/lib/pharmacy/medicine-data";
import {
  buildExpiryRecords,
  getAvailableMonths,
  getDaysLeftLabel,
  getStatusColor,
  getStockValue,
} from "@/lib/pharmacy/expiry-helpers";
import { ExpiryViewDialog } from "./_components/expiry-view-dialog";
import type { ExpiryMedicineRecord, ExpiryStatus } from "@/types/pharmacy/expiry-types";
import { cn } from "@/lib/utils";
import { exportExpiryMedicinesToExcel } from "@/lib/pharmacy/expiry-export";

type ViewMode = "list" | "grid";

export default function ExpiryMedicinesPage() {
  const [records] = useState<ExpiryMedicineRecord[]>(() => buildExpiryRecords());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [monthFilter, setMonthFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isExporting, setIsExporting] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<ExpiryMedicineRecord | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const availableMonths = useMemo(() => getAvailableMonths(records), [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.medicineCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.generic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || record.category === categoryFilter;
      const matchesBrand = brandFilter === "All" || record.brand === brandFilter;
      const matchesStatus = statusFilter === "All" || record.status === statusFilter;
      const matchesMonth = monthFilter === "All" || record.monthKey === monthFilter;
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesMonth;
    });
  }, [records, searchQuery, categoryFilter, brandFilter, statusFilter, monthFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  const expiredCount = filteredRecords.filter((r) => r.status === "Expired").length;
  const criticalCount = filteredRecords.filter((r) => r.status === "Critical").length;
  const nearExpiryCount = filteredRecords.filter((r) => r.status === "Near Expiry").length;
  const totalValueAtRisk = filteredRecords.reduce((sum, r) => sum + getStockValue(r), 0);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value);
    setCurrentPage(1);
  }

  function handleViewRecord(record: ExpiryMedicineRecord) {
    setViewingRecord(record);
    setIsViewOpen(true);
  }

  async function handleExport(scope: "filtered" | "all") {
    setIsExporting(true);
    try {
      await exportExpiryMedicinesToExcel(
        scope === "filtered" ? filteredRecords : records,
        scope === "filtered" ? "expiry-medicines-filtered" : "expiry-medicines-all"
      );
    } finally {
      setIsExporting(false);
    }
  }

  function getActionItems(record: ExpiryMedicineRecord): ActionMenuItem[] {
    return [
      { label: "View Details", icon: <Eye className="w-4 h-4" />, onClick: () => handleViewRecord(record) },
    ];
  }

  const hasActiveFilters =
    !!searchQuery || categoryFilter !== "All" || brandFilter !== "All" || statusFilter !== "All" || monthFilter !== "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Expiry Medicines
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track expired and near-expiry batches across your inventory
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport("filtered")}
                disabled={isExporting || filteredRecords.length === 0}
                className="border-slate-200"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export Filtered
              </Button>
              <Button
                onClick={() => handleExport("all")}
                disabled={isExporting}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-red-500/25"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Already Expired</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{expiredCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Critical (≤30 days)</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{criticalCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
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
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Value at Risk</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">₹{totalValueAtRisk.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters + View Toggle */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search medicine, batch, code..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <Select value={monthFilter} onValueChange={(v) => handleFilterChange(setMonthFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Expiry month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Months</SelectItem>
                  {availableMonths.map((m) => (
                    <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => handleFilterChange(setStatusFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Near Expiry">Near Expiry</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={(v) => handleFilterChange(setCategoryFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={brandFilter} onValueChange={(v) => handleFilterChange(setBrandFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Brands</SelectItem>
                  {BRAND_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
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

        {/* LIST VIEW — Table */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Medicine</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Batch No</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Category / Brand</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Stock</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">MRP</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Expiry Date</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Days Left</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Location</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRecords.map((record, index) => (
                    <tr key={record.recordId} className="hover:bg-slate-50/80 transition-colors" style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                            {record.medicineName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[180px]">{record.medicineName}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[180px]">{record.medicineCode} • {record.strength}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-slate-700">{record.batchNo}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-700">{record.category}</p>
                        <p className="text-xs text-slate-500">{record.brand}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{record.stock}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">₹{record.mrp}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {record.expiryDateLabel}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "text-sm font-medium",
                          record.status === "Expired" ? "text-red-600" : record.status === "Critical" ? "text-orange-600" : "text-amber-600"
                        )}>
                          {getDaysLeftLabel(record.daysLeft)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {record.rack}/{record.shelf}/{record.bin}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ActionMenu items={getActionItems(record)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedRecords.length === 0 && <EmptyState hasActiveFilters={hasActiveFilters} />}

            {paginatedRecords.length > 0 && (
              <PaginationBar
                startIndex={startIndex}
                endIndex={endIndex}
                total={filteredRecords.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </div>
        )}

        {/* GRID VIEW — Cards */}
        {viewMode === "grid" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedRecords.map((record, index) => (
                <div
                  key={record.recordId}
                  className={cn(
                    "bg-white rounded-2xl shadow-sm border p-5 hover:shadow-lg transition-all duration-300",
                    record.status === "Expired" ? "border-red-200" : record.status === "Critical" ? "border-orange-200" : "border-slate-200"
                  )}
                  style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                        {record.medicineName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{record.medicineName}</h3>
                        <p className="text-xs text-slate-500 truncate">{record.medicineCode} • Batch {record.batchNo}</p>
                      </div>
                    </div>
                    <ActionMenu items={getActionItems(record)} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">{record.category}</Badge>
                  </div>

                  <div
                    className={cn(
                      "rounded-xl p-3 mb-3 flex items-center gap-2",
                      record.status === "Expired" ? "bg-red-50" : record.status === "Critical" ? "bg-orange-50" : "bg-amber-50"
                    )}
                  >
                    <AlertTriangle className={cn(
                      "w-4 h-4 flex-shrink-0",
                      record.status === "Expired" ? "text-red-500" : record.status === "Critical" ? "text-orange-500" : "text-amber-500"
                    )} />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{getDaysLeftLabel(record.daysLeft)}</p>
                      <p className="text-xs text-slate-500">{record.expiryDateLabel}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Brand</span>
                      <span className="font-medium text-slate-700 truncate max-w-[140px]">{record.brand}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Location
                      </span>
                      <span className="font-medium text-slate-700">{record.rack}/{record.shelf}/{record.bin}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Stock</p>
                      <p className="font-bold text-slate-800">{record.stock}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Stock Value</p>
                      <p className="font-bold text-slate-800">₹{getStockValue(record).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {paginatedRecords.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200">
                <EmptyState hasActiveFilters={hasActiveFilters} />
              </div>
            )}

            {paginatedRecords.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 mt-4">
                <PaginationBar
                  startIndex={startIndex}
                  endIndex={endIndex}
                  total={filteredRecords.length}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* View Modal */}
      <ExpiryViewDialog open={isViewOpen} onOpenChange={setIsViewOpen} record={viewingRecord} />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function EmptyState({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <Package className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">No expiring medicines found</h3>
      <p className="text-slate-500">
        {hasActiveFilters ? "Try adjusting your filters" : "All batches are well within their expiry window"}
      </p>
    </div>
  );
}

function PaginationBar({
  startIndex,
  endIndex,
  total,
  currentPage,
  totalPages,
  onPageChange,
}: {
  startIndex: number;
  endIndex: number;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="border-t border-slate-200 px-6 py-4 bg-slate-50/50 rounded-b-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-slate-600">
          Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} batches
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "border-slate-200"}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}