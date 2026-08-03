
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SalesPeriodFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="w-full sm:w-[180px]">
      <Select value={value} onValueChange={(val) => onChange(val ?? "6")}>
        <SelectTrigger>
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Last 1 Month</SelectItem>
          <SelectItem value="3">Last 3 Months</SelectItem>
          <SelectItem value="6">Last 6 Months</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}