// app/admin/pharmacy/categories-brands/page.tsx
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, LayoutGrid, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "./_components/section-header";
import { TagListItem } from "./_components/tag-list-item";
import { AddEntryDialog } from "./_components/add-entry-dialog";
import { DeleteConfirmDialog } from "./_components/delete-confirm-dialog";
import { PHARMACY_CATEGORIES, PHARMACY_BRANDS } from "@/lib/pharmacy/category-brand-data";
import type { PharmacyBrand, PharmacyCategory } from "@/types/pharmacy/category-brand-types";

export default function PharmacyCategoriesBrandsPage() {
  const [categories, setCategories] = useState<PharmacyCategory[]>(PHARMACY_CATEGORIES);
  const [brands, setBrands] = useState<PharmacyBrand[]>(PHARMACY_BRANDS);

  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addBrandOpen, setAddBrandOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<
    { type: "category" | "brand"; id: string; name: string } | null
  >(null);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(categorySearch.toLowerCase())),
    [categories, categorySearch]
  );

  const filteredBrands = useMemo(
    () => brands.filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase())),
    [brands, brandSearch]
  );

  function handleAddCategory(name: string) {
    setCategories((prev) => [
      { id: `C-${Date.now()}`, name, medicineCount: 0, createdOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
      ...prev,
    ]);
    toast.success(`Category "${name}" added`);
  }

  function handleAddBrand(name: string) {
    setBrands((prev) => [
      { id: `B-${Date.now()}`, name, medicineCount: 0, createdOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
      ...prev,
    ]);
    toast.success(`Brand "${name}" added`);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === "category") {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    } else {
      setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    }
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Categories & Brands</h1>
          <p className="mt-1 text-sm text-slate-500">Manage medicine categories and company brands used across the pharmacy module.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Categories panel */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={LayoutGrid}
              title="Medicine Categories"
              count={categories.length}
              tint="blue"
              addLabel="Add Category"
              onAddClick={() => setAddCategoryOpen(true)}
            />

            <div className="p-4 sm:p-5">
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search categories"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {filteredCategories.map((category) => (
                  <TagListItem
                    key={category.id}
                    name={category.name}
                    medicineCount={category.medicineCount}
                    createdOn={category.createdOn}
                    tint="blue"
                    onDelete={() => setDeleteTarget({ type: "category", id: category.id, name: category.name })}
                  />
                ))}
                {filteredCategories.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">No categories found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Brands panel */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={Building2}
              title="Company Brands"
              count={brands.length}
              tint="violet"
              addLabel="Add Brand"
              onAddClick={() => setAddBrandOpen(true)}
            />

            <div className="p-4 sm:p-5">
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search brands"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {filteredBrands.map((brand) => (
                  <TagListItem
                    key={brand.id}
                    name={brand.name}
                    medicineCount={brand.medicineCount}
                    createdOn={brand.createdOn}
                    tint="violet"
                    onDelete={() => setDeleteTarget({ type: "brand", id: brand.id, name: brand.name })}
                  />
                ))}
                {filteredBrands.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">No brands found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEntryDialog
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        title="Add New Category"
        fieldLabel="Category Name"
        placeholder="e.g. Antibiotics"
        onSave={handleAddCategory}
      />

      <AddEntryDialog
        open={addBrandOpen}
        onOpenChange={setAddBrandOpen}
        title="Add New Brand"
        fieldLabel="Brand Name"
        placeholder="e.g. Sun Pharma"
        onSave={handleAddBrand}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.name ?? ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}