// app/(main)/revenue-leakage/dashboard/_components/leakage-detail-drawer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  DepartmentLeakageSummary,
  DiscountRecord,
  ExpiredMedicineRecord,
  LeakageDrawerContentType,
  OtherLeakageRecord,
  PendingBillRecord,
  RevenueLeakageDashboardData,
  StaffDiscountBehavior,
} from "@/types/revenue-leakage/revenue-leakage-types";
import {
  exportDepartmentSummaryToExcel,
  exportDiscountRecordsToExcel,
  exportExpiredMedicinesToExcel,
  exportOtherLeakageToExcel,
  exportPendingBillsToExcel,
  exportStaffBehaviorToExcel,
  notifyBillingDepartment,
} from "@/lib/revenue-leakage/revenue-leakage-excel-export";

type DrawerRow =
  | DiscountRecord
  | ExpiredMedicineRecord
  | PendingBillRecord
  | OtherLeakageRecord
  | DepartmentLeakageSummary
  | StaffDiscountBehavior;

interface DrawerColumn {
  key: string;
  label: string;
  render: (row: DrawerRow, actions: DrawerActions) => React.ReactNode;
  defaultVisible: boolean;
}

interface DrawerActions {
  notifiedIds: Set<string>;
  onNotify: (row: PendingBillRecord) => void;
}

interface DrawerConfig {
  title: string;
  subtitle: string;
  columns: DrawerColumn[];
  rows: DrawerRow[];
  onExport?: () => void;
}

const PAGE_SIZE = 8;

function isDiscountRecord(row: DrawerRow): row is DiscountRecord {
  return "discountPercentage" in row && "netAmount" in row;
}

function isExpiredMedicine(row: DrawerRow): row is ExpiredMedicineRecord {
  return "batchNumber" in row && "expiredQuantity" in row;
}

function isPendingBill(row: DrawerRow): row is PendingBillRecord {
  return "amountPending" in row && "daysPending" in row;
}

function isOtherLeakage(row: DrawerRow): row is OtherLeakageRecord {
  return "category" in row && "estimatedLossAmount" in row;
}

function isDepartmentSummary(row: DrawerRow): row is DepartmentLeakageSummary {
  return "discountLeakage" in row && "totalLeakage" in row;
}

function isStaffBehavior(row: DrawerRow): row is StaffDiscountBehavior {
  return "totalDiscountsGiven" in row && "flagged" in row;
}

function getRowKey(row: DrawerRow, index: number): string {
  if ("id" in row && typeof row.id === "string") {
    return row.id;
  }
  if (isDepartmentSummary(row)) {
    return row.department;
  }
  if (isStaffBehavior(row)) {
    return row.staffName;
  }
  return String(index);
}

function useDrawerConfig(
  type: LeakageDrawerContentType,
  data: RevenueLeakageDashboardData,
): DrawerConfig | null {
  return useMemo(() => {
    if (!type) {
      return null;
    }

    switch (type) {
      case "totalDiscount":
        return {
          title: "All Discount Records",
          subtitle: "Every discount given by Billing, Pharmacy, and Lab departments",
          rows: data.discountRecords,
          onExport: () => exportDiscountRecordsToExcel(data.discountRecords),
          columns: [
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isDiscountRecord(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.uhid} · {row.department}</p>
                  </div>
                );
              },
            },
            {
              key: "sourceType",
              label: "Source",
              defaultVisible: true,
              render: (row) => (isDiscountRecord(row) ? <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{row.sourceType}</Badge> : "-"),
            },
            { key: "billNumber", label: "Bill No.", defaultVisible: false, render: (row) => (isDiscountRecord(row) ? row.billNumber : "-") },
            {
              key: "totalBillAmount",
              label: "Total Bill",
              defaultVisible: true,
              render: (row) => (isDiscountRecord(row) ? `₹${row.totalBillAmount.toLocaleString("en-IN")}` : "-"),
            },
            {
              key: "discountPercentage",
              label: "Discount %",
              defaultVisible: true,
              render: (row) => (isDiscountRecord(row) ? <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">{row.discountPercentage}%</Badge> : "-"),
            },
            {
              key: "discountAmount",
              label: "Discount Amount",
              defaultVisible: true,
              render: (row) => (isDiscountRecord(row) ? <span className="font-bold text-red-600">₹{row.discountAmount.toLocaleString("en-IN")}</span> : "-"),
            },
            {
              key: "netAmount",
              label: "Net Amount",
              defaultVisible: false,
              render: (row) => (isDiscountRecord(row) ? `₹${row.netAmount.toLocaleString("en-IN")}` : "-"),
            },
            {
              key: "reason",
              label: "Reason",
              defaultVisible: true,
              render: (row) => (isDiscountRecord(row) ? <span className="text-slate-600">{row.reason}</span> : "-"),
            },
            {
              key: "approvedBy",
              label: "Approved By",
              defaultVisible: true,
              render: (row) => {
                if (!isDiscountRecord(row)) return "-";
                return (
                  <div>
                    <p className="font-medium text-slate-700">{row.approvedBy}</p>
                    <p className="text-xs text-slate-400">{row.approverRole}</p>
                  </div>
                );
              },
            },
            { key: "givenAt", label: "Given At", defaultVisible: true, render: (row) => (isDiscountRecord(row) ? row.givenAt : "-") },
          ],
        };

      case "expiredMedicine":
        return {
          title: "Expired Medicine Stock Loss",
          subtitle: "All expired batches with quantity and financial loss",
          rows: data.expiredMedicines,
          onExport: () => exportExpiredMedicinesToExcel(data.expiredMedicines),
          columns: [
            {
              key: "medicineName",
              label: "Medicine",
              defaultVisible: true,
              render: (row) => (isExpiredMedicine(row) ? <span className="font-semibold text-slate-800">{row.medicineName}</span> : "-"),
            },
            { key: "category", label: "Category", defaultVisible: true, render: (row) => (isExpiredMedicine(row) ? row.category : "-") },
            { key: "batchNumber", label: "Batch No.", defaultVisible: true, render: (row) => (isExpiredMedicine(row) ? <span className="font-mono text-xs">{row.batchNumber}</span> : "-") },
            { key: "expiryDate", label: "Expiry Date", defaultVisible: true, render: (row) => (isExpiredMedicine(row) ? row.expiryDate : "-") },
            {
              key: "expiredQuantity",
              label: "Qty",
              defaultVisible: true,
              render: (row) => (isExpiredMedicine(row) ? <span className="font-bold text-slate-700">{row.expiredQuantity}</span> : "-"),
            },
            { key: "unitPrice", label: "Unit Price", defaultVisible: false, render: (row) => (isExpiredMedicine(row) ? `₹${row.unitPrice}` : "-") },
            {
              key: "totalLossAmount",
              label: "Total Loss",
              defaultVisible: true,
              render: (row) => (isExpiredMedicine(row) ? <span className="font-bold text-red-600">₹{row.totalLossAmount.toLocaleString("en-IN")}</span> : "-"),
            },
            { key: "rackNumber", label: "Rack", defaultVisible: false, render: (row) => (isExpiredMedicine(row) ? row.rackNumber : "-") },
            { key: "detectedOn", label: "Detected On", defaultVisible: true, render: (row) => (isExpiredMedicine(row) ? row.detectedOn : "-") },
            { key: "detectedBy", label: "Detected By", defaultVisible: false, render: (row) => (isExpiredMedicine(row) ? row.detectedBy : "-") },
            {
              key: "status",
              label: "Status",
              defaultVisible: true,
              render: (row) => {
                if (!isExpiredMedicine(row)) return "-";
                const className =
                  row.status === "Pending Write-off"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : row.status === "Written Off"
                      ? "border-slate-200 bg-slate-100 text-slate-600"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700";
                return <Badge variant="outline" className={className}>{row.status}</Badge>;
              },
            },
          ],
        };

      case "pendingAmount":
        return {
          title: "Pending Bill Amounts",
          subtitle: "All patients with outstanding balances across departments",
          rows: data.pendingBills,
          onExport: () => exportPendingBillsToExcel(data.pendingBills),
          columns: [
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isPendingBill(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.uhid} · {row.department}</p>
                  </div>
                );
              },
            },
            { key: "doctor", label: "Doctor", defaultVisible: false, render: (row) => (isPendingBill(row) ? row.doctor : "-") },
            {
              key: "totalBillAmount",
              label: "Total Bill",
              defaultVisible: true,
              render: (row) => (isPendingBill(row) ? `₹${row.totalBillAmount.toLocaleString("en-IN")}` : "-"),
            },
            {
              key: "amountCollected",
              label: "Collected",
              defaultVisible: true,
              render: (row) => (isPendingBill(row) ? <span className="font-semibold text-emerald-600">₹{row.amountCollected.toLocaleString("en-IN")}</span> : "-"),
            },
            {
              key: "amountPending",
              label: "Pending",
              defaultVisible: true,
              render: (row) => (isPendingBill(row) ? <span className="font-bold text-red-600">₹{row.amountPending.toLocaleString("en-IN")}</span> : "-"),
            },
            { key: "daysPending", label: "Days Pending", defaultVisible: true, render: (row) => (isPendingBill(row) ? row.daysPending : "-") },
            { key: "contactNumber", label: "Contact", defaultVisible: false, render: (row) => (isPendingBill(row) ? row.contactNumber : "-") },
            {
              key: "status",
              label: "Status",
              defaultVisible: true,
              render: (row) => {
                if (!isPendingBill(row)) return "-";
                const className =
                  row.status === "Escalated"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : row.status === "Promised to Pay"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : row.status === "Follow-up Sent"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-600";
                return <Badge variant="outline" className={className}>{row.status}</Badge>;
              },
            },
            {
              key: "action",
              label: "Action",
              defaultVisible: true,
              render: (row, actions) => {
                if (!isPendingBill(row)) return "-";
                const isNotified = actions.notifiedIds.has(row.id);
                if (row.contactNumber === "N/A") {
                  return <span className="text-xs text-slate-400">No contact</span>;
                }
                return (
                  <Button
                    size="sm"
                    variant={isNotified ? "outline" : "default"}
                    onClick={() => actions.onNotify(row)}
                    disabled={isNotified}
                    className={
                      isNotified
                        ? "h-7 border-emerald-200 bg-emerald-50 text-xs text-emerald-700"
                        : "h-7 bg-gradient-to-r from-red-600 to-rose-600 text-xs text-white hover:from-red-700 hover:to-rose-700"
                    }
                  >
                    {isNotified ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Notified
                      </>
                    ) : (
                      <>
                        <BellRing className="mr-1 h-3 w-3" /> Notify
                      </>
                    )}
                  </Button>
                );
              },
            },
          ],
        };

      case "otherLeakage":
        return {
          title: "Other Revenue Leakage Issues",
          subtitle: "Unbilled consumables, waived charges, rejected claims, and more",
          rows: data.otherLeakageRecords,
          onExport: () => exportOtherLeakageToExcel(data.otherLeakageRecords),
          columns: [
            { key: "category", label: "Category", defaultVisible: true, render: (row) => (isOtherLeakage(row) ? <Badge variant="outline" className="border-slate-300 bg-slate-100 text-slate-700">{row.category}</Badge> : "-") },
            { key: "department", label: "Department", defaultVisible: true, render: (row) => (isOtherLeakage(row) ? row.department : "-") },
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isOtherLeakage(row)) return "-";
                return (
                  <div>
                    <p className="font-medium text-slate-700">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.uhid}</p>
                  </div>
                );
              },
            },
            {
              key: "description",
              label: "Description",
              defaultVisible: true,
              render: (row) => (isOtherLeakage(row) ? <span className="text-slate-600">{row.description}</span> : "-"),
            },
            {
              key: "estimatedLossAmount",
              label: "Est. Loss",
              defaultVisible: true,
              render: (row) => (isOtherLeakage(row) ? <span className="font-bold text-red-600">₹{row.estimatedLossAmount.toLocaleString("en-IN")}</span> : "-"),
            },
            { key: "identifiedBy", label: "Identified By", defaultVisible: false, render: (row) => (isOtherLeakage(row) ? row.identifiedBy : "-") },
            { key: "identifiedOn", label: "Identified On", defaultVisible: false, render: (row) => (isOtherLeakage(row) ? row.identifiedOn : "-") },
            {
              key: "status",
              label: "Status",
              defaultVisible: true,
              render: (row) => {
                if (!isOtherLeakage(row)) return "-";
                const className =
                  row.status === "Open"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : row.status === "Under Review"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : row.status === "Resolved"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700";
                return <Badge variant="outline" className={className}>{row.status}</Badge>;
              },
            },
          ],
        };

      case "departmentBreakdown":
        return {
          title: "Department-wise Leakage Breakdown",
          subtitle: "Complete leakage summary across all hospital departments",
          rows: data.departmentSummary,
          onExport: () => exportDepartmentSummaryToExcel(data.departmentSummary),
          columns: [
            {
              key: "department",
              label: "Department",
              defaultVisible: true,
              render: (row) => {
                if (!isDepartmentSummary(row)) return "-";
                return (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                    <span className="font-semibold text-slate-800">{row.department}</span>
                  </div>
                );
              },
            },
            {
              key: "discountLeakage",
              label: "Discounts",
              defaultVisible: true,
              render: (row) => (isDepartmentSummary(row) ? `₹${row.discountLeakage.toLocaleString("en-IN")}` : "-"),
            },
            {
              key: "pendingLeakage",
              label: "Pending",
              defaultVisible: true,
              render: (row) => (isDepartmentSummary(row) ? `₹${row.pendingLeakage.toLocaleString("en-IN")}` : "-"),
            },
            {
              key: "otherLeakage",
              label: "Other",
              defaultVisible: true,
              render: (row) => (isDepartmentSummary(row) ? `₹${row.otherLeakage.toLocaleString("en-IN")}` : "-"),
            },
            {
              key: "totalLeakage",
              label: "Total Leakage",
              defaultVisible: true,
              render: (row) => (isDepartmentSummary(row) ? <span className="font-bold text-red-600">₹{row.totalLeakage.toLocaleString("en-IN")}</span> : "-"),
            },
          ],
        };

      case "staffBehavior":
        return {
          title: "Staff Discount Behavior",
          subtitle: "Monitor which staff members give discounts most frequently",
          rows: data.staffDiscountBehavior,
          onExport: () => exportStaffBehaviorToExcel(data.staffDiscountBehavior),
          columns: [
            {
              key: "staffName",
              label: "Staff",
              defaultVisible: true,
              render: (row) => {
                if (!isStaffBehavior(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.staffName}</p>
                    <p className="text-xs text-slate-400">{row.role} · {row.department}</p>
                  </div>
                );
              },
            },
            {
              key: "totalDiscountsGiven",
              label: "Discounts Given",
              defaultVisible: true,
              render: (row) => (isStaffBehavior(row) ? <span className="font-bold text-slate-700">{row.totalDiscountsGiven}</span> : "-"),
            },
            {
              key: "totalDiscountAmount",
              label: "Total Amount",
              defaultVisible: true,
              render: (row) => (isStaffBehavior(row) ? `₹${row.totalDiscountAmount.toLocaleString("en-IN")}` : "-"),
            },
            {
              key: "avgDiscountPercentage",
              label: "Avg %",
              defaultVisible: true,
              render: (row) => (isStaffBehavior(row) ? `${row.avgDiscountPercentage}%` : "-"),
            },
            {
              key: "flagged",
              label: "Flag",
              defaultVisible: true,
              render: (row) => {
                if (!isStaffBehavior(row)) return "-";
                return row.flagged ? (
                  <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Review</Badge>
                ) : (
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Normal</Badge>
                );
              },
            },
          ],
        };

      case "grandTotal":
        return {
          title: "Grand Total Leakage Breakdown",
          subtitle: "Combined view of every leakage category",
          rows: [
            { category: "Discounts", department: "All", patientName: "-", uhid: "-", description: "Total discounts given across all departments", estimatedLossAmount: data.summary.totalDiscountLeakage, identifiedBy: "-", identifiedOn: "-", status: "Open" as const },
            { category: "Expired Medicines", department: "Pharmacy", patientName: "-", uhid: "-", description: "Total stock loss from expired medicine batches", estimatedLossAmount: data.summary.totalExpiredMedicineLoss, identifiedBy: "-", identifiedOn: "-", status: "Open" as const },
            { category: "Free Service / Waived Charges", department: "All", patientName: "-", uhid: "-", description: "Total pending amount not yet collected from patients", estimatedLossAmount: data.summary.totalPendingAmount, identifiedBy: "-", identifiedOn: "-", status: "Open" as const },
            { category: "Unbilled Consumables", department: "All", patientName: "-", uhid: "-", description: "Total from other identified leakage issues", estimatedLossAmount: data.summary.totalOtherLeakage, identifiedBy: "-", identifiedOn: "-", status: "Open" as const },
          ],
          onExport: () => exportOtherLeakageToExcel(data.otherLeakageRecords),
          columns: [
            { key: "category", label: "Leakage Category", defaultVisible: true, render: (row) => (isOtherLeakage(row) ? <span className="font-semibold text-slate-800">{row.category}</span> : "-") },
            {
              key: "estimatedLossAmount",
              label: "Amount",
              defaultVisible: true,
              render: (row) => (isOtherLeakage(row) ? <span className="font-bold text-red-600">₹{row.estimatedLossAmount.toLocaleString("en-IN")}</span> : "-"),
            },
          ],
        };

      default:
        return null;
    }
  }, [type, data]);
}

export function LeakageDetailDrawer({
  type,
  onClose,
  data,
}: {
  type: LeakageDrawerContentType;
  onClose: () => void;
  data: RevenueLeakageDashboardData;
}) {
  const config = useDrawerConfig(type, data);
  const [page, setPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({});
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  const columns = config?.columns ?? [];

  useEffect(() => {
    setPage(1);
    setVisibleCols({});
  }, [type]);

  const effectiveVisibility = useMemo(() => {
    return columns.reduce<Record<string, boolean>>((result, column) => {
      result[column.key] = visibleCols[column.key] ?? column.defaultVisible;
      return result;
    }, {});
  }, [columns, visibleCols]);

  const visibleColumns = columns.filter((column) => effectiveVisibility[column.key]);
  const totalRows = config?.rows.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const paginatedRows = config?.rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];

  function toggleColumn(key: string) {
    const column = columns.find((item) => item.key === key);
    if (!column) return;

    setVisibleCols((previous) => ({
      ...previous,
      [key]: !(previous[key] ?? column.defaultVisible),
    }));
  }

  function handleNotify(row: PendingBillRecord) {
    notifyBillingDepartment(row.patientName, row.uhid, row.amountPending);
    setNotifiedIds((prev) => new Set(prev).add(row.id));
  }

  const drawerActions: DrawerActions = { notifiedIds, onNotify: handleNotify };

  if (!type || !config) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Close details drawer"
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter") {
            onClose();
          }
        }}
      />

      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-5xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
        aria-label={config.title}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-amber-50 to-red-50 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{config.title}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{config.subtitle}</p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 rounded-full hover:bg-white/60" aria-label="Close drawer">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-3">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">{totalRows}</span> record{totalRows !== 1 ? "s" : ""} found
          </p>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <Columns3 className="mr-1.5 h-3.5 w-3.5" />
                Columns
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={effectiveVisibility[column.key]}
                    onCheckedChange={() => toggleColumn(column.key)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {config.onExport ? (
              <Button
                size="sm"
                onClick={config.onExport}
                className="h-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export Excel
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-max">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  {visibleColumns.map((column) => (
                    <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedRows.map((row, index) => (
                  <tr key={getRowKey(row, index)} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm">
                        {column.render(row, drawerActions)}
                      </td>
                    ))}
                  </tr>
                ))}

                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={Math.max(visibleColumns.length, 1)} className="py-12 text-center text-sm text-slate-400">
                      No records found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {totalRows > PAGE_SIZE ? (
          <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
            <p className="text-xs text-slate-500">
              Page <span className="font-semibold text-slate-700">{page}</span> of <span className="font-semibold text-slate-700">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="h-8 border-slate-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="h-8 border-slate-200"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}