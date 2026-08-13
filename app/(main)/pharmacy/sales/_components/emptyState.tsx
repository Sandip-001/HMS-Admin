import { Search } from "lucide-react";

export function EmptyState({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">No sales found</h3>
      <p className="text-slate-500">
        {hasActiveFilters ? "Try adjusting your filters or date range" : "No pharmacy sales recorded yet"}
      </p>
    </div>
  );
}