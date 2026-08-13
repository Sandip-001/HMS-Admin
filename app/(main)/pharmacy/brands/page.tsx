"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Globe,
  Building2,
  Package,
  Hash,
  Eye,
  Pencil,
  Trash2,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  PHARMACY_BRANDS,
  COUNTRY_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/pharmacy/category-brand-data";
import { BrandFormDialog } from "./_components/brand-form-dialog";
import { BrandViewDialog } from "./_components/brand-view-dialog";
import type {
  BrandFormData,
  PharmacyBrand,
} from "@/types/pharmacy/category-brand-types";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

export default function PharmacyBrandsPage() {
  const [brands, setBrands] = useState<PharmacyBrand[]>(PHARMACY_BRANDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<PharmacyBrand | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingBrand, setViewingBrand] = useState<PharmacyBrand | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    brandId?: string;
    brandName?: string;
  }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter brands
  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || brand.status === statusFilter;
    const matchesCountry =
      countryFilter === "All" || brand.country === countryFilter;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  function handleAddBrand() {
    setEditingBrand(null);
    setIsFormOpen(true);
  }

  function handleEditBrand(brand: PharmacyBrand) {
    setEditingBrand(brand);
    setIsFormOpen(true);
  }

  function handleViewBrand(brand: PharmacyBrand) {
    setViewingBrand(brand);
    setIsViewOpen(true);
  }

  function handleDeleteClick(brand: PharmacyBrand) {
    setDeleteDialog({
      open: true,
      brandId: brand.brandId,
      brandName: brand.brandName,
    });
  }

  function handleConfirmDelete() {
    if (deleteDialog.brandId) {
      setIsDeleting(true);
      setTimeout(() => {
        setBrands((prev) =>
          prev.filter((b) => b.brandId !== deleteDialog.brandId),
        );
        setDeleteDialog({ open: false });
        setIsDeleting(false);
      }, 800);
    }
  }

  function handleSaveBrand(data: BrandFormData) {
    if (editingBrand && editingBrand.brandId) {
      setBrands((prev) =>
        prev.map((b) =>
          b.brandId === editingBrand.brandId
            ? {
                ...b,
                ...data,
              }
            : b,
        ),
      );
    } else {
      const newBrand: PharmacyBrand = {
        ...data,
        brandId: String(brands.length + 1),
        medicineCount: 0,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setBrands((prev) => [...prev, newBrand]);
    }
  }

  function getActionItems(brand: PharmacyBrand): ActionMenuItem[] {
    return [
      {
        label: "View Details",
        icon: <Eye className="w-4 h-4" />,
        onClick: () => handleViewBrand(brand),
      },
      {
        label: "Edit Brand",
        icon: <Pencil className="w-4 h-4" />,
        onClick: () => handleEditBrand(brand),
      },
      {
        label: "Delete Brand",
        icon: <Trash2 className="w-4 h-4" />,
        onClick: () => handleDeleteClick(brand),
        variant: "danger",
      },
    ];
  }

  const hasActiveFilters =
    !!searchQuery || statusFilter !== "All" || countryFilter !== "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Brand Management
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage pharmaceutical brands and manufacturers
              </p>
            </div>
            <Button
              onClick={handleAddBrand}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
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
                <p className="text-sm text-slate-500">Total Brands</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {brands.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Brands</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {brands.filter((b) => b.status === "Active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Medicines</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {brands.reduce((sum, b) => sum + (b.medicineCount || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Hash className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Countries</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {new Set(brands.map((b) => b.country)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
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
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v ?? "All")}
              >
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={countryFilter}
                onValueChange={(v) => setCountryFilter(v ?? "All")}
              >
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Countries</SelectItem>
                  {COUNTRY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
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
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
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
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* LIST VIEW — Table (desktop) / Cards (mobile) */}
        {viewMode === "list" && (
          <>
            <div className=" bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        Brand
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        Manufacturer
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        Country
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        Website
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        License
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        GST
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        Medicines
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        Status
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBrands.map((brand, index) => (
                      <tr
                        key={brand.brandId}
                        className="hover:bg-slate-50/80 transition-colors"
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                              {brand.brandName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate max-w-[160px]">
                                {brand.brandName}
                              </p>
                              <p className="text-xs text-slate-500 truncate max-w-[160px]">
                                {brand.brandId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-700 truncate max-w-[160px]">
                              {brand.manufacturer}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-700">
                              {brand.country}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-3 h-3" />
                            Visit
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-700 font-mono truncate max-w-[140px]">
                              {brand.licenseNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-700">
                            {brand.gst}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(100, ((brand.medicineCount || 0) / 300) * 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-700 min-w-[3ch]">
                              {brand.medicineCount}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={
                              brand.status === "Active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }
                          >
                            {brand.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <ActionMenu items={getActionItems(brand)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* GRID VIEW — Cards on all breakpoints */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((brand, index) => (
              <BrandCard
                key={brand.brandId}
                brand={brand}
                index={index}
                actionItems={getActionItems(brand)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No brands found
            </h3>
            <p className="text-slate-500 mb-4">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Get started by adding your first brand"}
            </p>
            {!hasActiveFilters && (
              <Button
                onClick={handleAddBrand}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Brand
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <BrandFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingBrand={editingBrand}
        onSave={handleSaveBrand}
      />

      {/* View Modal */}
      <BrandViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        brand={viewingBrand}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Brand"
        description={`Are you sure you want to delete "${deleteDialog.brandName}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}

function BrandCard({
  brand,
  index,
  actionItems,
}: {
  brand: PharmacyBrand;
  index: number;
  actionItems: ActionMenuItem[];
}) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
            {brand.brandName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-lg truncate">
              {brand.brandName}
            </h3>
            <p className="text-xs text-slate-500 truncate">{brand.brandId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge
            className={
              brand.status === "Active"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }
          >
            {brand.status}
          </Badge>
          <ActionMenu items={actionItems} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="truncate">{brand.manufacturer}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="truncate">{brand.country}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-mono truncate">{brand.licenseNumber}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-500">Medicines</p>
              <p className="font-bold text-slate-800">{brand.medicineCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">GST</p>
              <p className="font-bold text-slate-800">{brand.gst}%</p>
            </div>
          </div>
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            Visit
          </a>
        </div>
      </div>
    </div>
  );
}
