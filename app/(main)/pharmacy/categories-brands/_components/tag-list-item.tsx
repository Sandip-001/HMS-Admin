
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TagListItem({
  name,
  medicineCount,
  createdOn,
  onDelete,
  tint,
}: {
  name: string;
  medicineCount: number;
  createdOn: string;
  onDelete: () => void;
  tint: "blue" | "violet";
}) {
  const dot = { blue: "bg-blue-500", violet: "bg-violet-500" };

  return (
    <div className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:border-slate-200 hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${dot[tint]}`} />
        <div>
          <p className="text-sm font-medium text-slate-800">{name}</p>
          <p className="text-xs text-slate-400">{medicineCount} medicines · Added {createdOn}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}