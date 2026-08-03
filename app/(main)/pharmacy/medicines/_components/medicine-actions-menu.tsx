
"use client";

import { MoreVertical, Eye, Pencil, PackagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MedicineActionsMenu({
  onView,
  onEdit,
  onRestock,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onRestock: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onView} className="gap-2">
          <Eye className="h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onEdit} className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onRestock} className="gap-2">
          <PackagePlus className="h-4 w-4" />
          Restock
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="gap-2 text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}