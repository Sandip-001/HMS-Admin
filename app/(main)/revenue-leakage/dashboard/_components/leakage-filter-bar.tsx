// app/(main)/revenue-leakage/dashboard/_components/leakage-filter-bar.tsx
"use client";

import {
  CalendarRange,
  Download,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DATE_RANGE_OPTIONS,
  HOSPITAL_DEPARTMENTS,
} from "@/lib/revenue-leakage/revenue-leakage-data";
import type {
  DateRangeKey,
  RevenueLeakageFilters,
} from "@/types/revenue-leakage/revenue-leakage-types";

interface LeakageFilterBarProps {
  filters: RevenueLeakageFilters;
  onRangeChange: (range: DateRangeKey) => void;
  onDepartmentChange: (department: string) => void;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
  onReset: () => void;
  onExportSummary: () => void;
}

export function LeakageFilterBar({
  filters,
  onRangeChange,
  onDepartmentChange,
  onCustomFromChange,
  onCustomToChange,
  onReset,
  onExportSummary,
}: LeakageFilterBarProps) {
  const hasActiveFilters =
    filters.range !== "today" || filters.department !== "All Departments";

  return (
    <Card className="border-slate-200 bg-white/90 shadow-lg shadow-slate-200/50 backdrop-blur">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-amber-600" />
            Analytics Filters
          </h3>

          <div className="flex items-center gap-2">
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            ) : null}

            <Button
              size="sm"
              onClick={onExportSummary}
              className="h-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export Summary
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Date Range
            </Label>

            <Select
              value={filters.range}
              onValueChange={(value) => {
                if (value !== null) {
                  onRangeChange(value as DateRangeKey);
                }
              }}
            >
              <SelectTrigger className="h-11 w-full border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">
                <CalendarRange className="mr-1.5 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>

              <SelectContent>
                {DATE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Department
            </Label>

            <Select
              value={filters.department}
              onValueChange={(value) => {
                onDepartmentChange(value ?? "All Departments");
              }}
            >
              <SelectTrigger className="h-11 w-full border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>

              <SelectContent>
                {HOSPITAL_DEPARTMENTS.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filters.range === "custom" ? (
            <>
              <div>
                <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  From Date
                </Label>
                <Input
                  type="date"
                  value={filters.customFrom ?? ""}
                  onChange={(event) => onCustomFromChange(event.target.value)}
                  className="h-11 w-full border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  To Date
                </Label>
                <Input
                  type="date"
                  value={filters.customTo ?? ""}
                  onChange={(event) => onCustomToChange(event.target.value)}
                  className="h-11 w-full border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:block" />
              <div className="hidden md:block" />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}