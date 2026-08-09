"use client";

import { useState } from "react";
import {
  Search, Boxes, PackageCheck, Lock, ArrowUpCircle, ArrowDownCircle,
  ArrowLeftRight, AlertTriangle, Clock, Ban, Eye, SlidersHorizontal,
  ChevronLeft, ChevronRight, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { INVENTORY_ITEMS, WAREHOUSE_OPTIONS, CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/lib/pharmacy/inventory-data";
import { getStatusColor, getStockHealthPercent } from "@/lib/pharmacy/inventory-helpers";
import { InventoryViewDialog } from "./_components/inventory-view-dialog";
import { StockAdjustmentDialog } from "./_components/stock-adjustment-dialog";
import type { InventoryItem, StockAdjustmentFormData } from "@/types/pharmacy/inventory-types";

export default function PharmacyInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.medicineCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = warehouseFilter === "All" || item.warehouse === warehouseFilter;
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesWarehouse && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Aggregated dashboard stats across all inventory
  const totals = items.reduce(
    (acc, item) => ({
      currentStock: acc.currentStock + item.currentStock,
      available: acc.available + item.available,
      reserved: acc.reserved + item.reserved,
      issuedToday: acc.issuedToday + item.issuedToday,
      purchasedToday: acc.purchasedToday + item.purchasedToday,
      transferred: acc.transferred + item.transferred,
      damaged: acc.damaged + item.damaged,
      expired: acc.expired + item.expired,
      blocked: acc.blocked + item.blocked,
    }),
    { currentStock: 0, available: 0, reserved: 0, issuedToday: 0, purchasedToday: 0, transferred: 0, damaged: 0, expired: 0, blocked: 0 }
  );

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value);
    setCurrentPage(1);
  }

  function handleView(item: InventoryItem) {
    setViewingItem(item);
    setIsViewOpen(true);
  }

  function handleAdjust(item: InventoryItem) {
    setAdjustingItem(item);
    setIsAdjustOpen(true);
  }

  function handleSaveAdjustment(itemId: string, data: StockAdjustmentFormData) {
    const qty = Number(data.quantity);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, available: item.available - qty, lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " ") };
        switch (data.adjustmentType) {
          case "Damaged":
            updated.damaged += qty;
            break;
          case "Expired":
            updated.expired += qty;
            break;
          case "Blocked":
            updated.blocked += qty;
            break;
          case "Reserved":
            updated.reserved += qty;
            break;
          case "Transferred":
            updated.transferred += qty;
            updated.currentStock -= qty;
            break;
        }
        return updated;
      })
    );
  }

  function getActionItems(item: InventoryItem): ActionMenuItem[] {
    return [
      { label: "View Details", icon: <Eye className="w-4 h-4" />, onClick: () => handleView(item) },
      { label: "Stock Adjustment", icon: <SlidersHorizontal className="w-4 h-4" />, onClick: () => handleAdjust(item) },
    ];
  }

  const summaryCards = [
    { label: "Current Stock", value: totals.currentStock, icon: <Boxes className="w-6 h-6 text-white" />, gradient: "from-blue-500 to-blue-600" },
    { label: "Available", value: totals.available, icon: <PackageCheck className="w-6 h-6 text-white" />, gradient: "from-green-500 to-green-600" },
    { label: "Reserved", value: totals.reserved, icon: <Lock className="w-6 h-6 text-white" />, gradient: "from-indigo-500 to-indigo-600" },
    { label: "Issued Today", value: totals.issuedToday, icon: <ArrowUpCircle className="w-6 h-6 text-white" />, gradient: "from-red-500 to-red-600" },
    { label: "Purchased Today", value: totals.purchasedToday, icon: <ArrowDownCircle className="w-6 h-6 text-white" />, gradient: "from-teal-500 to-teal-600" },
    { label: "Transferred", value: totals.transferred, icon: <ArrowLeftRight className="w-6 h-6 text-white" />, gradient: "from-cyan-500 to-cyan-600" },
    { label: "Damaged", value: totals.damaged, icon: <AlertTriangle className="w-6 h-6 text-white" />, gradient: "from-orange-500 to-orange-600" },
    { label: "Expired", value: totals.expired, icon: <Clock className="w-6 h-6 text-white" />, gradient: "from-rose-500 to-rose-600" },
    { label: "Blocked", value: totals.blocked, icon: <Ban className="w-6 h-6 text-white" />, gradient: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Inventory Master
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time stock levels, movement and reserved quantities across warehouses
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aggregated Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{card.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search medicine or code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <Select value={warehouseFilter} onValueChange={(v) => handleFilterChange(setWarehouseFilter, v ?? "All")}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Filter by warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Warehouses</SelectItem>
                {WAREHOUSE_OPTIONS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(v) => handleFilterChange(setCategoryFilter, v ?? "All")}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
            <table className="w-full min-w-[1450px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Medicine</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Warehouse</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Current Stock</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Available</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Reserved</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Issued/Purchased Today</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Transferred</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Damaged/Expired</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Blocked</th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.map((item, index) => {
                  const healthPercent = getStockHealthPercent(item);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors" style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                            {item.medicineName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[180px]">{item.medicineName}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[180px]">{item.medicineCode} • {item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">{item.warehouse}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-slate-800">{item.currentStock.toLocaleString()} <span className="text-xs font-normal text-slate-500">{item.unit}</span></p>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${healthPercent}%` }} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-700">{item.available.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{item.reserved.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-red-600">↑ {item.issuedToday.toLocaleString()}</p>
                        <p className="text-xs text-green-600">↓ {item.purchasedToday.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{item.transferred.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-orange-600">{item.damaged.toLocaleString()}</p>
                        <p className="text-xs text-red-500">{item.expired.toLocaleString()} expired</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-purple-600 font-medium">{item.blocked.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ActionMenu items={getActionItems(item)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginatedItems.length > 0 && (
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
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
          {paginatedItems.map((item, index) => {
            const healthPercent = getStockHealthPercent(item);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                      {item.medicineName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 text-base truncate">{item.medicineName}</h3>
                      <p className="text-xs text-slate-500 truncate">{item.medicineCode} • {item.warehouse}</p>
                    </div>
                  </div>
                  <ActionMenu items={getActionItems(item)} />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  <span className="text-xs text-slate-500">{healthPercent}% available</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${healthPercent}%` }} />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div className="rounded-xl bg-slate-50 py-2">
                    <p className="text-xs text-slate-500">Current</p>
                    <p className="font-bold text-slate-800">{item.currentStock}</p>
                  </div>
                  <div className="rounded-xl bg-green-50 py-2">
                    <p className="text-xs text-slate-500">Available</p>
                    <p className="font-bold text-green-700">{item.available}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 py-2">
                    <p className="text-xs text-slate-500">Reserved</p>
                    <p className="font-bold text-blue-700">{item.reserved}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Issued Today</span>
                    <span className="font-medium text-red-600">{item.issuedToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Purchased</span>
                    <span className="font-medium text-green-600">{item.purchasedToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Transferred</span>
                    <span className="font-medium text-slate-700">{item.transferred}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Blocked</span>
                    <span className="font-medium text-purple-600">{item.blocked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Damaged</span>
                    <span className="font-medium text-orange-600">{item.damaged}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Expired</span>
                    <span className="font-medium text-red-600">{item.expired}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Mobile Pagination */}
          {paginatedItems.length > 0 && (
            <div className="md:col-span-2 flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-600">
                {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length}
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
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No inventory items found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      <InventoryViewDialog open={isViewOpen} onOpenChange={setIsViewOpen} item={viewingItem} />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentDialog
        open={isAdjustOpen}
        onOpenChange={setIsAdjustOpen}
        item={adjustingItem}
        onSave={handleSaveAdjustment}
      />
    </div>
  );
}