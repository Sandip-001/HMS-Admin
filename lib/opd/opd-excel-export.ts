// lib/super-admin/opd/opd-excel-export.ts
// Lightweight CSV-based "Excel" export (opens natively in Excel/Google Sheets).
// No external dependency required — works in any browser environment.

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
  DoctorPerformance,
  MedicineSalesData,
  LabTestData,
  DepartmentWiseRevenue,
  RevenueBreakdown,
  ConsultationStats,
} from "@/types/opd/opd-analytics-types";

export function exportDoctorPerformanceToExcel(doctors: DoctorPerformance[]) {
  const rows: (string | number)[][] = [
    ["Doctor Name", "Department", "Total Consultations", "Completed", "Cancelled", "Rescheduled", "Follow-Up", "New", "Revenue Generated (₹)", "Avg Consultation Time (mins)", "Patient Satisfaction (%)", "Status"],
    ...doctors.map((d) => [
      d.name, d.department, d.totalConsultations, d.completedConsultations, d.cancelledConsultations,
      d.rescheduledConsultations, d.followUpConsultations, d.newConsultations, d.revenueGenerated,
      d.avgConsultationTimeMins, d.patientSatisfactionPct, d.status,
    ]),
  ];
  downloadCsv(`Doctor_Performance_${timestampSuffix()}.csv`, rows);
}

export function exportMedicineSalesToExcel(medicines: MedicineSalesData[]) {
  const rows: (string | number)[][] = [
    ["Medicine Name", "Category", "Units Sold", "Revenue (₹)", "Trend", "Trend %"],
    ...medicines.map((m) => [m.medicineName, m.category, m.unitsSold, m.revenue, m.trend, m.trendPercentage]),
  ];
  downloadCsv(`OPD_Medicine_Sales_${timestampSuffix()}.csv`, rows);
}

export function exportLabTestsToExcel(tests: LabTestData[]) {
  const rows: (string | number)[][] = [
    ["Test Name", "Lab Type", "Total Ordered", "Revenue (₹)", "Avg Turnaround Time", "Trend", "Trend %"],
    ...tests.map((t) => [t.testName, t.labType, t.totalOrdered, t.revenue, t.avgTurnaroundTime, t.trend, t.trendPercentage]),
  ];
  downloadCsv(`OPD_Lab_Test_Analytics_${timestampSuffix()}.csv`, rows);
}

export function exportDepartmentRevenueToExcel(departments: DepartmentWiseRevenue[]) {
  const rows: (string | number)[][] = [
    ["Department", "Revenue (₹)", "Consultations Completed"],
    ...departments.map((d) => [d.department, d.revenue, d.consultations]),
  ];
  downloadCsv(`OPD_Department_Revenue_${timestampSuffix()}.csv`, rows);
}

export function exportFullSummaryToExcel(
  revenue: RevenueBreakdown,
  stats: ConsultationStats,
  rangeLabel: string,
) {
  const rows: (string | number)[][] = [
    ["OPD Super Admin Dashboard Summary"],
    ["Date Range", rangeLabel],
    ["Generated On", new Date().toLocaleString("en-IN")],
    [],
    ["REVENUE BREAKDOWN"],
    ["Source", "Amount (₹)"],
    ["OPD Consultation Fees", revenue.opdConsultation],
    ["Doctor Fees", revenue.doctorFees],
    ["Pharmacy", revenue.pharmacy],
    ["Lab - Pathology", revenue.labPathology],
    ["Lab - Radiology", revenue.labRadiology],
    ["TOTAL REVENUE", revenue.total],
    ["Change vs Previous Period (%)", revenue.changeVsPrevious],
    [],
    ["CONSULTATION STATISTICS"],
    ["Metric", "Count"],
    ["Total Consultations", stats.totalToday],
    ["New Consultations", stats.newConsultations],
    ["Follow-Up Consultations", stats.followUpConsultations],
    ["Completed", stats.completed],
    ["Waiting", stats.waiting],
    ["Checked In", stats.checkedIn],
    ["Rescheduled", stats.rescheduled],
    ["Cancelled", stats.cancelled],
    ["No Show", stats.noShow],
    ["OPD to IPD Transfers", stats.opdToIpdTransfers],
  ];
  downloadCsv(`OPD_Dashboard_Summary_${timestampSuffix()}.csv`, rows);
}
