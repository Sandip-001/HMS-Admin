// lib/revenue-leakage/revenue-leakage-excel-export.ts
function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function timestampSuffix() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

import type {
  DiscountRecord,
  ExpiredMedicineRecord,
  PendingBillRecord,
  OtherLeakageRecord,
  DepartmentLeakageSummary,
  StaffDiscountBehavior,
  RevenueLeakageSummary,
} from "@/types/revenue-leakage/revenue-leakage-types";

export function exportDiscountRecordsToExcel(records: DiscountRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Department", "Source", "Bill Number", "Total Bill (₹)", "Discount %", "Discount Amount (₹)", "Net Amount (₹)", "Reason", "Approved By", "Approver Role", "Given At"],
    ...records.map((r) => [r.patientName, r.uhid, r.department, r.sourceType, r.billNumber, r.totalBillAmount, r.discountPercentage, r.discountAmount, r.netAmount, r.reason, r.approvedBy, r.approverRole, r.givenAt]),
  ];
  downloadCsv(`Revenue_Leakage_Discounts_${timestampSuffix()}.csv`, rows);
}

export function exportExpiredMedicinesToExcel(records: ExpiredMedicineRecord[]) {
  const rows: (string | number)[][] = [
    ["Medicine Name", "Category", "Batch Number", "Expiry Date", "Expired Qty", "Unit Price (₹)", "Total Loss (₹)", "Rack", "Detected On", "Detected By", "Status"],
    ...records.map((r) => [r.medicineName, r.category, r.batchNumber, r.expiryDate, r.expiredQuantity, r.unitPrice, r.totalLossAmount, r.rackNumber, r.detectedOn, r.detectedBy, r.status]),
  ];
  downloadCsv(`Revenue_Leakage_Expired_Medicines_${timestampSuffix()}.csv`, rows);
}

export function exportPendingBillsToExcel(records: PendingBillRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Department", "Bill Number", "Doctor", "Total Bill (₹)", "Collected (₹)", "Pending (₹)", "Days Pending", "Last Payment Date", "Contact Number", "Status"],
    ...records.map((r) => [r.patientName, r.uhid, r.department, r.billNumber, r.doctor, r.totalBillAmount, r.amountCollected, r.amountPending, r.daysPending, r.lastPaymentDate, r.contactNumber, r.status]),
  ];
  downloadCsv(`Revenue_Leakage_Pending_Bills_${timestampSuffix()}.csv`, rows);
}

export function exportOtherLeakageToExcel(records: OtherLeakageRecord[]) {
  const rows: (string | number)[][] = [
    ["Category", "Department", "Patient Name", "UHID", "Description", "Estimated Loss (₹)", "Identified By", "Identified On", "Status"],
    ...records.map((r) => [r.category, r.department, r.patientName, r.uhid, r.description, r.estimatedLossAmount, r.identifiedBy, r.identifiedOn, r.status]),
  ];
  downloadCsv(`Revenue_Leakage_Other_Issues_${timestampSuffix()}.csv`, rows);
}

export function exportDepartmentSummaryToExcel(records: DepartmentLeakageSummary[]) {
  const rows: (string | number)[][] = [
    ["Department", "Discount Leakage (₹)", "Pending Leakage (₹)", "Other Leakage (₹)", "Total Leakage (₹)"],
    ...records.map((r) => [r.department, r.discountLeakage, r.pendingLeakage, r.otherLeakage, r.totalLeakage]),
  ];
  downloadCsv(`Revenue_Leakage_Department_Summary_${timestampSuffix()}.csv`, rows);
}

export function exportStaffBehaviorToExcel(records: StaffDiscountBehavior[]) {
  const rows: (string | number)[][] = [
    ["Staff Name", "Role", "Department", "Total Discounts Given", "Total Discount Amount (₹)", "Avg Discount %", "Flagged for Review"],
    ...records.map((r) => [r.staffName, r.role, r.department, r.totalDiscountsGiven, r.totalDiscountAmount, r.avgDiscountPercentage, r.flagged ? "Yes" : "No"]),
  ];
  downloadCsv(`Revenue_Leakage_Staff_Behavior_${timestampSuffix()}.csv`, rows);
}

export function exportFullSummaryToExcel(summary: RevenueLeakageSummary, rangeLabel: string) {
  const rows: (string | number)[][] = [
    ["Revenue Leakage Analytics Summary"],
    ["Date Range", rangeLabel],
    ["Generated On", new Date().toLocaleString("en-IN")],
    [],
    ["LEAKAGE BREAKDOWN"],
    ["Category", "Amount (₹)", "Record Count"],
    ["Discount Leakage", summary.totalDiscountLeakage, summary.totalDiscountRecords],
    ["Expired Medicine Loss", summary.totalExpiredMedicineLoss, summary.totalExpiredBatches],
    ["Pending Bill Amount", summary.totalPendingAmount, summary.totalPendingBills],
    ["Other Leakage Issues", summary.totalOtherLeakage, summary.totalOtherIssues],
    ["GRAND TOTAL LEAKAGE", summary.grandTotalLeakage, ""],
    ["Change vs Previous Period (%)", summary.changeVsPrevious, ""],
  ];
  downloadCsv(`Revenue_Leakage_Full_Summary_${timestampSuffix()}.csv`, rows);
}

export function notifyBillingDepartment(patientName: string, uhid: string, amountPending: number): void {
  // In production this would call an API endpoint to send a notification/task
  // to the Billing Department queue. Wired here as a client-side confirmation stub.
  console.info(
    `[Billing Notification] Follow-up requested for ${patientName} (${uhid}) — Pending amount: ₹${amountPending.toLocaleString("en-IN")}`,
  );
}