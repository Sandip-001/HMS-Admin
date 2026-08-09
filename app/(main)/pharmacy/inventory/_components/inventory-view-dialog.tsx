"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/pharmacy/inventory-helpers";
import type { InventoryItem } from "@/types/pharmacy/inventory-types";
import {
  PackageCheck, Lock, Ban, AlertTriangle, Clock, ArrowDownCircle,
  ArrowUpCircle, ArrowLeftRight, MapPin,
} from "lucide-react";

interface InventoryViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

function StockBar({ label, value, total, color, icon }: { label: string; value: number; total: number; color: string; icon: React.ReactNode }) {
  const percent = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-1.5 text-sm text-slate-600">
          {icon}
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-800">{value.toLocaleString()}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function MovementStat({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

export function InventoryViewDialog({ open, onOpenChange, item }: InventoryViewDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[720px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {item.medicineName.charAt(0).toUpperCase()}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800">{item.medicineName}</DialogTitle>
              <p className="text-xs text-slate-500">{item.medicineCode} • {item.category}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {item.warehouse}
            </Badge>
          </div>

          {/* Stock Composition */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stock Composition</p>
              <p className="text-sm text-slate-600">
                Current Stock: <span className="font-bold text-slate-800">{item.currentStock.toLocaleString()} {item.unit}</span>
              </p>
            </div>
            <div className="space-y-3">
              <StockBar label="Available" value={item.available} total={item.currentStock} color="bg-green-500" icon={<PackageCheck className="w-4 h-4 text-green-500" />} />
              <StockBar label="Reserved" value={item.reserved} total={item.currentStock} color="bg-blue-500" icon={<Lock className="w-4 h-4 text-blue-500" />} />
              <StockBar label="Blocked" value={item.blocked} total={item.currentStock} color="bg-purple-500" icon={<Ban className="w-4 h-4 text-purple-500" />} />
              <StockBar label="Damaged" value={item.damaged} total={item.currentStock} color="bg-orange-500" icon={<AlertTriangle className="w-4 h-4 text-orange-500" />} />
              <StockBar label="Expired" value={item.expired} total={item.currentStock} color="bg-red-500" icon={<Clock className="w-4 h-4 text-red-500" />} />
            </div>
          </div>

          {/* Today's Movement */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Today's Movement</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MovementStat label="Issued Today" value={item.issuedToday} icon={<ArrowUpCircle className="w-4 h-4 text-red-600" />} color="bg-red-50" />
              <MovementStat label="Purchased Today" value={item.purchasedToday} icon={<ArrowDownCircle className="w-4 h-4 text-green-600" />} color="bg-green-50" />
              <MovementStat label="Transferred" value={item.transferred} icon={<ArrowLeftRight className="w-4 h-4 text-blue-600" />} color="bg-blue-50" />
            </div>
          </div>

          {/* Control Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500">Reorder Level</p>
              <p className="text-sm font-semibold text-slate-800">{item.reorderLevel.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Stock Value</p>
              <p className="text-sm font-semibold text-slate-800">₹{Number(item.stockValue).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Updated</p>
              <p className="text-sm font-semibold text-slate-800">{item.lastUpdated}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}