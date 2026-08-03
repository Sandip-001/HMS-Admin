
"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRAND_OPTIONS, CATEGORY_OPTIONS } from "@/lib/pharmacy/medicine-data";

export function MedicineFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  brandFilter,
  onBrandFilterChange,
  statusFilter,
  onStatusFilterChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  categoryFilter: string | null;
  onCategoryFilterChange: (v: string | null) => void;
  brandFilter: string | null;
  onBrandFilterChange: (v: string | null) => void;
  statusFilter: string | null;
  onStatusFilterChange: (v: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="relative md:col-span-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search medicine or generic"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Categories">All Categories</SelectItem>
          {CATEGORY_OPTIONS.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={brandFilter} onValueChange={onBrandFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Brands" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Brands">All Brands</SelectItem>
          {BRAND_OPTIONS.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Status">All Status</SelectItem>
          <SelectItem value="Available">Available</SelectItem>
          <SelectItem value="Low Stock">Low Stock</SelectItem>
          <SelectItem value="Out of Stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}