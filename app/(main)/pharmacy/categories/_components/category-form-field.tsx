"use client";

import { cn } from "@/lib/utils";

interface CategoryFormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function CategoryFormField({ label, error, children, className }: CategoryFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}