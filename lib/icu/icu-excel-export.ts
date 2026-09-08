// lib/icu/icu-excel-export.ts
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
  DoctorICUWorkload,
  NursePatientAssignment,
  IcuMedicineSalesData,
  IcuLabTestData,
  DischargedPatientRecord,
  ShiftedToIpdRecord,
  MortalityRecord,
  PendingPaymentRecord,
  OxygenVentilationRecord,
  PaymentSourceBreakdown,
  ICURevenueBreakdown,
} from "@/types/icu/icu-analytics-types";

export function exportDoctorWorkloadToExcel(doctors: DoctorICUWorkload[]) {
  const rows: (string | number)[][] = [
    ["Doctor Name", "Department", "Total Patients", "Critical", "Stable", "Discharged Today", "Deceased", "Revenue Generated (₹)", "Avg Stay (Days)", "Status"],
    ...doctors.map((d) => [d.name, d.department, d.totalPatients, d.criticalPatients, d.stablePatients, d.dischargedToday, d.deceasedCount, d.revenueGenerated, d.avgStayDays, d.status]),
  ];
  downloadCsv(`ICU_Doctor_Workload_${timestampSuffix()}.csv`, rows);
}

export function exportNurseAssignmentsToExcel(nurses: NursePatientAssignment[]) {
  const rows: (string | number)[][] = [
    ["Nurse Name", "Shift", "Bay", "Patient Name", "UHID", "Bed", "Assigned At", "Status"],
    ...nurses.map((n) => [n.nurseName, n.shift, n.bay, n.patientName, n.patientUhid, n.bed, n.assignedAt, n.status]),
  ];
  downloadCsv(`ICU_Nurse_Assignments_${timestampSuffix()}.csv`, rows);
}

export function exportMedicineSalesToExcel(medicines: IcuMedicineSalesData[]) {
  const rows: (string | number)[][] = [
    ["Medicine Name", "Category", "Units Sold", "Revenue (₹)", "Trend", "Trend %"],
    ...medicines.map((m) => [m.medicineName, m.category, m.unitsSold, m.revenue, m.trend, m.trendPercentage]),
  ];
  downloadCsv(`ICU_Medicine_Sales_${timestampSuffix()}.csv`, rows);
}

export function exportLabTestsToExcel(tests: IcuLabTestData[]) {
  const rows: (string | number)[][] = [
    ["Test Name", "Lab Type", "Total Ordered", "Revenue (₹)", "Avg Turnaround Time", "Trend", "Trend %"],
    ...tests.map((t) => [t.testName, t.labType, t.totalOrdered, t.revenue, t.avgTurnaroundTime, t.trend, t.trendPercentage]),
  ];
  downloadCsv(`ICU_Lab_Test_Analytics_${timestampSuffix()}.csv`, rows);
}

export function exportDischargedPatientsToExcel(patients: DischargedPatientRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Bed", "Admitted On", "Discharged On", "Doctor", "Total Stay (Days)", "Final Bill (₹)"],
    ...patients.map((p) => [p.patientName, p.uhid, p.bed, p.admittedOn, p.dischargedOn, p.doctor, p.totalStayDays, p.finalBillAmount]),
  ];
  downloadCsv(`ICU_Discharged_Patients_${timestampSuffix()}.csv`, rows);
}

export function exportShiftedToIpdToExcel(records: ShiftedToIpdRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "From Bed", "To Ward", "To Bed", "Shifted At", "Doctor", "Reason"],
    ...records.map((r) => [r.patientName, r.uhid, r.fromBed, r.toWard, r.toBed, r.shiftedAt, r.doctor, r.reason]),
  ];
  downloadCsv(`ICU_Shifted_To_IPD_${timestampSuffix()}.csv`, rows);
}

export function exportMortalityRecordsToExcel(records: MortalityRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Age", "Gender", "Bed", "Admitted On", "Time of Death", "Doctor", "Cause of Death", "Certified By"],
    ...records.map((r) => [r.patientName, r.uhid, r.age, r.gender, r.bed, r.admittedOn, r.timeOfDeath, r.doctor, r.causeOfDeath, r.certifiedBy]),
  ];
  downloadCsv(`ICU_Mortality_Records_${timestampSuffix()}.csv`, rows);
}

export function exportPendingPaymentsToExcel(records: PendingPaymentRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Bed", "Doctor", "Total Bill (₹)", "Collected (₹)", "Pending (₹)", "Days Admitted", "Last Payment Date"],
    ...records.map((r) => [r.patientName, r.uhid, r.bed, r.doctor, r.totalBill, r.amountCollected, r.amountPending, r.daysAdmitted, r.lastPaymentDate]),
  ];
  downloadCsv(`ICU_Pending_Payments_${timestampSuffix()}.csv`, rows);
}

export function exportOxygenVentilationToExcel(records: OxygenVentilationRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Bed", "Type", "Started At", "Duration (Hours)", "Rate/Hour (₹)", "Total Cost (₹)", "Status"],
    ...records.map((r) => [r.patientName, r.uhid, r.bed, r.type, r.startedAt, r.durationHours, r.ratePerHour, r.totalCost, r.status]),
  ];
  downloadCsv(`ICU_Oxygen_Ventilation_${timestampSuffix()}.csv`, rows);
}

export function exportPaymentSourcesToExcel(sources: PaymentSourceBreakdown[]) {
  const rows: (string | number)[][] = [
    ["Payment Source", "Amount (₹)", "Patients", "Percentage"],
    ...sources.map((s) => [s.source, s.amount, s.patients, `${s.percentage}%`]),
  ];
  downloadCsv(`ICU_Payment_Sources_${timestampSuffix()}.csv`, rows);
}

export function exportFullSummaryToExcel(revenue: ICURevenueBreakdown, rangeLabel: string) {
  const rows: (string | number)[][] = [
    ["ICU Admin Dashboard Summary"],
    ["Date Range", rangeLabel],
    ["Generated On", new Date().toLocaleString("en-IN")],
    [],
    ["REVENUE BREAKDOWN"],
    ["Source", "Amount (₹)"],
    ["Bed Fees", revenue.bedFees],
    ["Doctor Fees", revenue.doctorFees],
    ["Oxygen Fees", revenue.oxygenFees],
    ["Ventilation Fees", revenue.ventilationFees],
    ["Pharmacy", revenue.pharmacy],
    ["Lab - Pathology", revenue.labPathology],
    ["Lab - Radiology", revenue.labRadiology],
    ["Procedure Charges", revenue.procedureCharges],
    ["TOTAL REVENUE", revenue.total],
    ["Total Collected", revenue.totalCollected],
    ["Total Pending", revenue.totalPending],
    ["Change vs Previous Period (%)", revenue.changeVsPrevious],
  ];
  downloadCsv(`ICU_Dashboard_Summary_${timestampSuffix()}.csv`, rows);
}