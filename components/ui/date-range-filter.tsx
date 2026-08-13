"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange } from "@/types/pharmacy/sales-types";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

const PRESETS = [
  {
    label: "Today",
    getRange: (): DateRange => {
      const today = new Date();
      return { from: startOfDay(today), to: endOfDay(today) };
    },
  },
  {
    label: "Yesterday",
    getRange: (): DateRange => {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    },
  },
  {
    label: "This Week",
    getRange: (): DateRange => {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      return { from: startOfDay(start), to: endOfDay(today) };
    },
  },
  {
    label: "This Month",
    getRange: (): DateRange => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: startOfDay(start), to: endOfDay(today) };
    },
  },
  {
    label: "Last Month",
    getRange: (): DateRange => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: startOfDay(start), to: endOfDay(end) };
    },
  },
];

export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);

  const label =
    value.from && value.to
      ? `${value.from.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} - ${value.to.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
      : "Select date range";

  function handlePreset(range: DateRange) {
    onChange(range);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange({ from: undefined, to: undefined });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* PopoverTrigger IS the interactive button element here — do not
          nest another <Button> component inside it, or you get two real
          <button> tags nested in the DOM (invalid HTML + hydration error). */}
      <PopoverTrigger
        className={cn(
          "inline-flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-left transition-colors hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
          !value.from && "text-slate-500",
          className
        )}
      >
        <CalendarDays className="h-4 w-4 text-slate-400 flex-shrink-0" />
        <span className="truncate flex-1">{label}</span>
        {value.from && (
          <X
            className="h-3.5 w-3.5 text-slate-400 hover:text-slate-700 flex-shrink-0"
            onClick={handleClear}
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200" align="start">
        <div className="flex flex-col sm:flex-row">
          {/* Quick presets */}
          <div className="flex flex-row sm:flex-col gap-1 border-b sm:border-b-0 sm:border-r border-slate-100 p-3 overflow-x-auto sm:overflow-visible">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset.getRange())}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <Calendar
            mode="range"
            selected={{ from: value.from, to: value.to }}
            onSelect={(range) => {
              onChange({ from: range?.from, to: range?.to });
            }}
            numberOfMonths={2}
            className="p-3"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}