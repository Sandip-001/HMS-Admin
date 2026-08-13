"use client";

import { useMemo, useState } from "react";
import {
  Search, Receipt, IndianRupee, CreditCard, TrendingUp,
  Eye, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight,
  User, Stethoscope, Pill, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import {
  PHARMACY_SALES,
  PATIENT_TYPE_OPTIONS,
  BILL_TYPE_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/pharmacy/sales-data";
import {
  getBillTypeColor,
  getMedicineSummary,
  getPatientTypeColor,
  getPaymentStatusColor,
  isWithinRange,
} from "@/lib/pharmacy/sales-helpers";
import { SaleViewDialog } from "./_components/sale-view-dialog";
import type { DateRange, PharmacySale } from "@/types/pharmacy/sales-types";
import { cn } from "@/lib/utils";
import { EmptyState } from "./_components/emptyState";
import { PaginationBar } from "./_components/paginationBar";

type ViewMode = "list" | "grid";

export default function PharmacySalesPage() {
  const [sales] = useState<PharmacySale[]>(PHARMACY_SALES);
  const [searchQuery, setSearchQuery] = useState("");
  const [patientTypeFilter, setPatientTypeFilter] = useState("All");
  const [billTypeFilter, setBillTypeFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingSale, setViewingSale] = useState<PharmacySale | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.uhid.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPatientType = patientTypeFilter === "All" || sale.patientType === patientTypeFilter;
      const matchesBillType = billTypeFilter === "All" || sale.billType === billTypeFilter;
      const matchesPaymentStatus = paymentStatusFilter === "All" || sale.paymentStatus === paymentStatusFilter;
      const matchesDate = isWithinRange(sale.billDate, dateRange);
      return matchesSearch && matchesPatientType && matchesBillType && matchesPaymentStatus && matchesDate;
    });
  }, [sales, searchQuery, patientTypeFilter, billTypeFilter, paymentStatusFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, endIndex);

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const cashSales = filteredSales.filter((s) => s.billType === "Cash");
  const creditSales = filteredSales.filter((s) => s.billType === "Credit");
  const totalGst = filteredSales.reduce((sum, s) => sum + s.gstAmount, 0);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value);
    setCurrentPage(1);
  }

  function handleDateRangeChange(range: DateRange) {
    setDateRange(range);
    setCurrentPage(1);
  }

  function handleViewSale(sale: PharmacySale) {
    setViewingSale(sale);
    setIsViewOpen(true);
  }

  function getActionItems(sale: PharmacySale): ActionMenuItem[] {
    return [
      { label: "View Bill Details", icon: <Eye className="w-4 h-4" />, onClick: () => handleViewSale(sale) },
    ];
  }

  const hasActiveFilters =
    !!searchQuery ||
    patientTypeFilter !== "All" ||
    billTypeFilter !== "All" ||
    paymentStatusFilter !== "All" ||
    !!dateRange.from;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Pharmacy Sales
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View and filter pharmacy billing across IPD, OPD, ICU and Emergency
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Sales</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{filteredSales.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600 mt-1">₹{totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Cash vs Credit</p>
                <p className="text-lg font-bold text-slate-800 mt-1">
                  {cashSales.length} <span className="text-slate-400 text-sm font-normal">/</span> {creditSales.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total GST Collected</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">₹{totalGst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
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
                  placeholder="Search bill, patient, doctor..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
              <Select value={patientTypeFilter} onValueChange={(v) => handleFilterChange(setPatientTypeFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Patient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Patient Types</SelectItem>
                  {PATIENT_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={billTypeFilter} onValueChange={(v) => handleFilterChange(setBillTypeFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Cash / Credit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Bill Types</SelectItem>
                  {BILL_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={paymentStatusFilter} onValueChange={(v) => handleFilterChange(setPaymentStatusFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Payment Status</SelectItem>
                  {PAYMENT_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
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
              <table className="w-full min-w-[1300px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Bill Number</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Patient</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Doctor</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Prescription</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Cash/Credit</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Discount</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">GST</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Payment</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Medicine List</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSales.map((sale, index) => (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors" style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800 font-mono">{sale.billNumber}</p>
                        <p className="text-xs text-slate-500">{sale.billDate} • {sale.billTime}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {sale.patientName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate max-w-[150px]">{sale.patientName}</p>
                            <Badge className={cn(getPatientTypeColor(sale.patientType), "mt-0.5")}>{sale.patientType}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-700 truncate max-w-[150px]">{sale.doctorName}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{sale.department}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-slate-600">{sale.prescriptionNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getBillTypeColor(sale.billType)}>{sale.billType}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-red-600">{sale.discountPercent}% (₹{sale.discountAmount.toFixed(0)})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{sale.gstPercent}% (₹{sale.gstAmount.toFixed(0)})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getPaymentStatusColor(sale.paymentStatus)}>{sale.paymentStatus}</Badge>
                        <p className="text-xs text-slate-500 mt-0.5">{sale.paymentMode}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-600 truncate max-w-[200px]">{getMedicineSummary(sale)}</p>
                        <p className="text-xs text-slate-400">{sale.medicines.length} item(s)</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <p className="text-sm font-bold text-slate-800">₹{sale.totalAmount.toFixed(0)}</p>
                          <ActionMenu items={getActionItems(sale)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedSales.length === 0 && <EmptyState hasActiveFilters={hasActiveFilters} />}

            {paginatedSales.length > 0 && (
              <PaginationBar
                startIndex={startIndex}
                endIndex={endIndex}
                total={filteredSales.length}
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
              {paginatedSales.map((sale, index) => (
                <div
                  key={sale.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all duration-300"
                  style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 font-mono text-sm truncate">{sale.billNumber}</h3>
                        <p className="text-xs text-slate-500">{sale.billDate} • {sale.billTime}</p>
                      </div>
                    </div>
                    <ActionMenu items={getActionItems(sale)} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge className={getPatientTypeColor(sale.patientType)}>{sale.patientType}</Badge>
                    <Badge className={getBillTypeColor(sale.billType)}>{sale.billType}</Badge>
                    <Badge className={getPaymentStatusColor(sale.paymentStatus)}>{sale.paymentStatus}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{sale.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Stethoscope className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{sale.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="font-mono truncate">{sale.prescriptionNumber}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <Pill className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{getMedicineSummary(sale)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Discount</p>
                      <p className="font-semibold text-red-600">{sale.discountPercent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">GST</p>
                      <p className="font-semibold text-slate-700">{sale.gstPercent}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Total Amount</span>
                    <span className="text-lg font-bold text-blue-700">₹{sale.totalAmount.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>

            {paginatedSales.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200">
                <EmptyState hasActiveFilters={hasActiveFilters} />
              </div>
            )}

            {paginatedSales.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 mt-4">
                <PaginationBar
                  startIndex={startIndex}
                  endIndex={endIndex}
                  total={filteredSales.length}
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
      <SaleViewDialog open={isViewOpen} onOpenChange={setIsViewOpen} sale={viewingSale} />
    </div>
  );
}



