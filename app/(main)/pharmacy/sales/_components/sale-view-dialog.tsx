"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PharmacySale } from "@/types/pharmacy/sales-types";
import { getBillTypeColor, getPatientTypeColor, getPaymentStatusColor } from "@/lib/pharmacy/sales-helpers";
import {
  CalendarDays, FileText, Stethoscope, User, CreditCard, Receipt, MapPin,
} from "lucide-react";

interface SaleViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: PharmacySale | null;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate">{value ?? "—"}</p>
    </div>
  );
}

export function SaleViewDialog({ open, onOpenChange, sale }: SaleViewDialogProps) {
  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[760px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-slate-800 truncate">
                {sale.billNumber}
              </DialogTitle>
              <p className="text-xs text-slate-500">
                {sale.billDate} • {sale.billTime}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getPaymentStatusColor(sale.paymentStatus)}>{sale.paymentStatus}</Badge>
            <Badge className={getBillTypeColor(sale.billType)}>{sale.billType}</Badge>
            <Badge className={getPatientTypeColor(sale.patientType)}>{sale.patientType}</Badge>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {sale.paymentMode}
            </Badge>
          </div>

          {/* Patient info */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Patient Information</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Patient Name" value={sale.patientName} />
              <DetailItem label="UHID" value={sale.uhid} />
              <DetailItem label="Age / Gender" value={`${sale.age} yrs / ${sale.gender}`} />
              <DetailItem label="Patient Type" value={sale.patientType} />
              {sale.ward && <DetailItem label="Ward" value={sale.ward} />}
              {sale.bed && <DetailItem label="Bed" value={sale.bed} />}
            </div>
          </div>

          {/* Prescription info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prescription Details</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Doctor" value={sale.doctorName} />
              <DetailItem label="Department" value={sale.department} />
              <DetailItem
                label="Prescription No."
                value={
                  <span className="flex items-center gap-1 font-mono">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {sale.prescriptionNumber}
                  </span>
                }
              />
            </div>
          </div>

          {/* Medicine list */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Medicine List ({sale.medicines.length})
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="py-2 pr-4">Medicine</th>
                    <th className="py-2 pr-4">Strength</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Unit Price</th>
                    <th className="py-2 pr-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sale.medicines.map((med) => (
                    <tr key={med.id}>
                      <td className="py-2 pr-4 font-medium text-slate-700 whitespace-nowrap">{med.medicineName}</td>
                      <td className="py-2 pr-4 whitespace-nowrap text-slate-600">{med.strength}</td>
                      <td className="py-2 pr-4 whitespace-nowrap text-slate-600">{med.quantity}</td>
                      <td className="py-2 pr-4 whitespace-nowrap text-slate-600">₹{med.unitPrice.toFixed(2)}</td>
                      <td className="py-2 pr-4 whitespace-nowrap text-right font-medium text-slate-800">₹{med.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing summary */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Billing Summary</p>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sub Total</span>
                <span className="font-medium text-slate-800">₹{sale.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Discount ({sale.discountPercent}%)</span>
                <span className="font-medium text-red-600">- ₹{sale.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">GST ({sale.gstPercent}%)</span>
                <span className="font-medium text-slate-800">+ ₹{sale.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-100 mt-2">
                <span className="font-semibold text-slate-800">Total Amount</span>
                <span className="text-lg font-bold text-blue-700">₹{sale.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}