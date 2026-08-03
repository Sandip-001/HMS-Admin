import { LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SectionHeader({
  icon: Icon,
  title,
  count,
  tint,
  onAddClick,
  addLabel,
}: {
  icon: LucideIcon;
  title: string;
  count: number;
  tint: "blue" | "violet";
  onAddClick: () => void;
  addLabel: string;
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[tint]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-400">{count} total</p>
        </div>
      </div>

      <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700" onClick={onAddClick}>
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}