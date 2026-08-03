
"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteSupplierDialog({
  open,
  onOpenChange,
  supplierName,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierName: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[400px] rounded-2xl">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="mt-3 text-center text-base font-semibold text-slate-800">
            Delete "{supplierName}"?
          </DialogTitle>
          <p className="text-center text-sm text-slate-500">This supplier will be permanently removed. This action cannot be undone.</p>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-center sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}