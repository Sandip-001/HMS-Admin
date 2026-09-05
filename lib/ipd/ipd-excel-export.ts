// lib/super-admin/ipd/ipd-excel-export.ts
// Lightweight CSV-based "Excel" export (opens natively in Excel/Google Sheets).

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
  DoctorIpdWorkload,
  NursePatientAssignment,
  IpdMedicineSalesData,
  IpdLabTestData,
  CancelledAdmission,
  PaymentSourceBreakdown,
  IPDRevenueBreakdown,
  IpdPatientMovementStats,
} from "@/types/ipd/ipd-analytics-types";

export function exportDoctorWorkloadToExcel(doctors: DoctorIpdWorkload[]) {
  const rows: (string | number)[][] = [
    ["Doctor Name", "Department", "Total Patients", "Critical", "Stable", "Discharged Today", "Revenue Generated (₹)", "Avg Stay (Days)", "Status"],
    ...doctors.map((d) => [d.name, d.department, d.totalPatients, d.criticalPatients, d.stablePatients, d.dischargedToday, d.revenueGenerated, d.avgStayDays, d.status]),
  ];
  downloadCsv(`IPD_Doctor_Workload_${timestampSuffix()}.csv`, rows);
}

export function exportNurseAssignmentsToExcel(nurses: NursePatientAssignment[]) {
  const rows: (string | number)[][] = [
    ["Nurse Name", "Shift", "Ward", "Patient Name", "UHID", "Bed", "Assigned At", "Status"],
    ...nurses.map((n) => [n.nurseName, n.shift, n.ward, n.patientName, n.patientUhid, n.bed, n.assignedAt, n.status]),
  ];
  downloadCsv(`IPD_Nurse_Assignments_${timestampSuffix()}.csv`, rows);
}

export function exportMedicineSalesToExcel(medicines: IpdMedicineSalesData[]) {
  const rows: (string | number)[][] = [
    ["Medicine Name", "Category", "Units Sold", "Revenue (₹)", "Trend", "Trend %"],
    ...medicines.map((m) => [m.medicineName, m.category, m.unitsSold, m.revenue, m.trend, m.trendPercentage]),
  ];
  downloadCsv(`IPD_Medicine_Sales_${timestampSuffix()}.csv`, rows);
}

export function exportLabTestsToExcel(tests: IpdLabTestData[]) {
  const rows: (string | number)[][] = [
    ["Test Name", "Lab Type", "Total Ordered", "Revenue (₹)", "Avg Turnaround Time", "Trend", "Trend %"],
    ...tests.map((t) => [t.testName, t.labType, t.totalOrdered, t.revenue, t.avgTurnaroundTime, t.trend, t.trendPercentage]),
  ];
  downloadCsv(`IPD_Lab_Test_Analytics_${timestampSuffix()}.csv`, rows);
}

export function exportCancelledAdmissionsToExcel(cancellations: CancelledAdmission[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Department", "Doctor", "Requested Bed", "Cancelled At", "Cancelled By", "Reason"],
    ...cancellations.map((c) => [c.patientName, c.uhid, c.department, c.doctor, c.requestedBed, c.cancelledAt, c.cancelledBy, c.reason]),
  ];
  downloadCsv(`IPD_Cancelled_Admissions_${timestampSuffix()}.csv`, rows);
}

export function exportPaymentSourcesToExcel(sources: PaymentSourceBreakdown[]) {
  const rows: (string | number)[][] = [
    ["Payment Source", "Amount (₹)", "Patients", "Percentage"],
    ...sources.map((s) => [s.source, s.amount, s.patients, `${s.percentage}%`]),
  ];
  downloadCsv(`IPD_Payment_Sources_${timestampSuffix()}.csv`, rows);
}

export function exportFullSummaryToExcel(
  revenue: IPDRevenueBreakdown,
  movement: IpdPatientMovementStats,
  rangeLabel: string,
) {
  const rows: (string | number)[][] = [
    ["IPD Super Admin Dashboard Summary"],
    ["Date Range", rangeLabel],
    ["Generated On", new Date().toLocaleString("en-IN")],
    [],
    ["REVENUE BREAKDOWN"],
    ["Source", "Amount (₹)"],
    ["Bed Charges", revenue.bedCharges],
    ["Doctor Fees", revenue.doctorFees],
    ["Pharmacy", revenue.pharmacy],
    ["Lab - Pathology", revenue.labPathology],
    ["Lab - Radiology", revenue.labRadiology],
    ["Procedure Charges", revenue.procedureCharges],
    ["OT Charges", revenue.otCharges],
    ["TOTAL REVENUE", revenue.total],
    ["Total Collected", revenue.totalCollected],
    ["Total Pending", revenue.totalPending],
    ["Change vs Previous Period (%)", revenue.changeVsPrevious],
    [],
    ["PATIENT MOVEMENT"],
    ["Metric", "Count"],
    ["Total Active Admissions", movement.totalActiveAdmissions],
    ["New Registrations Today", movement.newRegistrationsToday],
    ["Discharged Today", movement.dischargedToday],
    ["Shifted to OT", movement.shiftedToOT],
    ["Shifted to ICU", movement.shiftedToICU],
    ["Shifted from ICU", movement.shiftedFromICU],
    ["Cancelled Admissions", movement.cancelledAdmissions],
    ["Transferred from OPD", movement.transferredFromOPD],
  ];
  downloadCsv(`IPD_Dashboard_Summary_${timestampSuffix()}.csv`, rows);
}