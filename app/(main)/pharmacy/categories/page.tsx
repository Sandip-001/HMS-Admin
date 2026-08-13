"use client";

import { useState } from "react";
import {
  Plus, Search, Filter, ChevronLeft, ChevronRight,
  Eye, Pencil, Trash2, LayoutGrid, List as ListIcon,
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
  PHARMACY_CATEGORIES,
  PARENT_CATEGORY_OPTIONS,
  CATEGORY_OPTIONS,
} from "@/lib/pharmacy/category-brand-data";
import { CategoryFormDialog } from "./_components/category-form-dialog";
import { CategoryViewDialog } from "./_components/category-view-dialog";
import { PaginationBar } from "./_components/paginationBar";
import { EmptyState } from "./_components/emptyState";
import type { CategoryFormData, PharmacyCategory } from "@/types/pharmacy/category-brand-types";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

export default function PharmacyCategoriesPage() {
  const [categories, setCategories] = useState<PharmacyCategory[]>(PHARMACY_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [parentFilter, setParentFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PharmacyCategory | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<PharmacyCategory | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; name?: string }>({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || cat.status === statusFilter;
    const matchesType = typeFilter === "All" || cat.medicineType === typeFilter;
    const matchesParent = parentFilter === "All" || cat.parentCategory === parentFilter;
    return matchesSearch && matchesStatus && matchesType && matchesParent;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }

  function handleFilterChange(setter: (v: string) => void, value: string) {
    setter(value);
    setCurrentPage(1);
  }

  function handleAddCategory() {
    setEditingCategory(null);
    setIsFormOpen(true);
  }

  function handleEditCategory(category: PharmacyCategory) {
    setEditingCategory(category);
    setIsFormOpen(true);
  }

  function handleViewCategory(category: PharmacyCategory) {
    setViewingCategory(category);
    setIsViewOpen(true);
  }

  function handleDeleteClick(category: PharmacyCategory) {
    setDeleteDialog({ open: true, id: category.categoryId, name: category.categoryName });
  }

  function handleConfirmDelete() {
    if (deleteDialog.id) {
      setIsDeleting(true);
      setTimeout(() => {
        setCategories((prev) => prev.filter((cat) => cat.categoryId !== deleteDialog.id));
        setDeleteDialog({ open: false });
        setIsDeleting(false);
      }, 800);
    }
  }

  function handleSaveCategory(data: CategoryFormData) {
    if (editingCategory && editingCategory.categoryId) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.categoryId === editingCategory.categoryId
            ? {
                ...cat,
                ...data,
                updatedDate: new Date().toISOString().split("T")[0],
              }
            : cat
        )
      );
    } else {
      // Add new category
      const newCategory: PharmacyCategory = {
        ...data,
        categoryId: String(categories.length + 1),
        medicineCount: 0,
        createdBy: "Current User",
        createdDate: new Date().toISOString().split("T")[0],
        updatedDate: new Date().toISOString().split("T")[0],
      };
      setCategories((prev) => [...prev, newCategory]);
    }
  }

  function getActionItems(category: PharmacyCategory): ActionMenuItem[] {
    return [
      { label: "View Details", icon: <Eye className="w-4 h-4" />, onClick: () => handleViewCategory(category) },
      { label: "Edit Category", icon: <Pencil className="w-4 h-4" />, onClick: () => handleEditCategory(category) },
      { label: "Delete Category", icon: <Trash2 className="w-4 h-4" />, onClick: () => handleDeleteClick(category), variant: "danger" },
    ];
  }

  const hasActiveFilters = !!searchQuery || statusFilter !== "All" || typeFilter !== "All" || parentFilter !== "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden">
      {/* Header Section */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Category Management
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage pharmacy categories and organize your inventory
              </p>
            </div>
            <Button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Categories</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {categories.filter((c) => c.status === "Active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Badge className="w-6 h-6 text-green-600" variant="secondary">✓</Badge>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Medicines</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {categories.reduce((sum, c) => sum + (c.medicineCount || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Parent Categories</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {new Set(categories.map((c) => c.parentCategory)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
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
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => handleFilterChange(setStatusFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => handleFilterChange(setTypeFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {CATEGORY_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={parentFilter} onValueChange={(v) => handleFilterChange(setParentFilter, v ?? "All")}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue placeholder="Filter by parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Parents</SelectItem>
                  {PARENT_CATEGORY_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
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
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                      Category
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 hidden lg:table-cell whitespace-nowrap">
                      Description
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                      Parent
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                      Type
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-4 whitespace-nowrap">
                      GST %
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
                  {paginatedCategories.map((category, index) => (
                    <tr
                      key={category.categoryId}
                      className="hover:bg-slate-50/80 transition-colors"
                      style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                            {category.categoryName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[180px]">
                              {category.categoryName}
                            </p>
                            <p className="text-xs text-slate-500 lg:hidden truncate max-w-[180px]">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap">
                        <p className="text-sm text-slate-600 max-w-xs truncate">
                          {category.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          {category.parentCategory}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            category.medicineType === "Tablet"
                              ? "bg-blue-100 text-blue-700"
                              : category.medicineType === "Injection"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }
                        >
                          {category.medicineType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-slate-700">
                          {category.gstPercent}%
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, ((category.medicineCount || 0) / 100) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700 min-w-[3ch]">
                            {category.medicineCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            category.status === "Active"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }
                        >
                          {category.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ActionMenu items={getActionItems(category)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedCategories.length === 0 && (
              <EmptyState hasActiveFilters={hasActiveFilters} onAdd={handleAddCategory} />
            )}

            {paginatedCategories.length > 0 && (
              <PaginationBar
                startIndex={startIndex}
                endIndex={endIndex}
                total={filteredCategories.length}
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
              {paginatedCategories.map((category, index) => (
                <div
                  key={category.categoryId}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all duration-300"
                  style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                        {category.categoryName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{category.categoryName}</h3>
                        <p className="text-xs text-slate-500 truncate">{category.parentCategory}</p>
                      </div>
                    </div>
                    <ActionMenu items={getActionItems(category)} />
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge
                      className={
                        category.medicineType === "Tablet"
                          ? "bg-blue-100 text-blue-700"
                          : category.medicineType === "Injection"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {category.medicineType}
                    </Badge>
                    <Badge
                      className={
                        category.status === "Active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }
                    >
                      {category.status}
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      GST {category.gstPercent}%
                    </Badge>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-500">Medicines</span>
                      <span className="text-sm font-bold text-slate-800">{category.medicineCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, ((category.medicineCount || 0) / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {paginatedCategories.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200">
                <EmptyState hasActiveFilters={hasActiveFilters} onAdd={handleAddCategory} />
              </div>
            )}

            {paginatedCategories.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 mt-4">
                <PaginationBar
                  startIndex={startIndex}
                  endIndex={endIndex}
                  total={filteredCategories.length}
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
      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingCategory={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* View Modal */}
      <CategoryViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        category={viewingCategory}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />

    </div>
  );
}



