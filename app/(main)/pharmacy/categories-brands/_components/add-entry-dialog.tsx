// app/admin/pharmacy/categories-brands/_components/add-entry-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddEntryDialog({
  open,
  onOpenChange,
  title,
  fieldLabel,
  placeholder,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fieldLabel: string;
  placeholder: string;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSave() {
    if (!value.trim()) return;
    onSave(value.trim());
    setValue("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[92vw] !max-w-[420px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-800">{title}</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <Label className="mb-1.5 block text-xs font-medium text-slate-500">{fieldLabel}</Label>
          <Input
            autoFocus
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={!value.trim()} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}