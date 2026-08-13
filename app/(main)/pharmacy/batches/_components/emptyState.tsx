import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export function EmptyState({ hasActiveFilters, onAdd }: { hasActiveFilters: boolean; onAdd: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">No batches found</h3>
      <p className="text-slate-500 mb-4">
        {hasActiveFilters ? "Try adjusting your filters" : "Get started by adding your first batch"}
      </p>
      {!hasActiveFilters && (
        <Button onClick={onAdd} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Batch
        </Button>
      )}
    </div>
  );
}