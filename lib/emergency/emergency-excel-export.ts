// lib/emergency/emergency-excel-export.ts
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
  DoctorEmergencyWorkload,
  NursePatientAssignment,
  EmergencyMedicineSalesData,
  EmergencyLabTestData,
  DischargedPatientRecord,
  TransferRecord,
  MortalityRecord,
  PendingPaymentRecord,
  PaymentSourceBreakdown,
  EmergencyRevenueBreakdown,
} from "@/types/emergency/emergency-analytics-types";

export function exportDoctorWorkloadToExcel(doctors: DoctorEmergencyWorkload[]) {
  const rows: (string | number)[][] = [
    ["Doctor Name", "Department", "Total Patients", "Critical", "Stable", "Discharged Today", "Deceased", "Revenue Generated (₹)", "Avg Treatment Time (mins)", "Status"],
    ...doctors.map((d) => [d.name, d.department, d.totalPatients, d.criticalPatients, d.stablePatients, d.dischargedToday, d.deceasedCount, d.revenueGenerated, d.avgTreatmentTimeMins, d.status]),
  ];
  downloadCsv(`Emergency_Doctor_Workload_${timestampSuffix()}.csv`, rows);
}

export function exportNurseAssignmentsToExcel(nurses: NursePatientAssignment[]) {
  const rows: (string | number)[][] = [
    ["Nurse Name", "Shift", "Bay", "Patient Name", "UHID", "Bed", "Assigned At", "Status"],
    ...nurses.map((n) => [n.nurseName, n.shift, n.bay, n.patientName, n.patientUhid, n.bed, n.assignedAt, n.status]),
  ];
  downloadCsv(`Emergency_Nurse_Assignments_${timestampSuffix()}.csv`, rows);
}

export function exportMedicineSalesToExcel(medicines: EmergencyMedicineSalesData[]) {
  const rows: (string | number)[][] = [
    ["Medicine Name", "Category", "Units Sold", "Revenue (₹)", "Trend", "Trend %"],
    ...medicines.map((m) => [m.medicineName, m.category, m.unitsSold, m.revenue, m.trend, m.trendPercentage]),
  ];
  downloadCsv(`Emergency_Medicine_Sales_${timestampSuffix()}.csv`, rows);
}

export function exportLabTestsToExcel(tests: EmergencyLabTestData[]) {
  const rows: (string | number)[][] = [
    ["Test Name", "Lab Type", "Total Ordered", "Revenue (₹)", "Avg Turnaround Time", "Trend", "Trend %"],
    ...tests.map((t) => [t.testName, t.labType, t.totalOrdered, t.revenue, t.avgTurnaroundTime, t.trend, t.trendPercentage]),
  ];
  downloadCsv(`Emergency_Lab_Test_Analytics_${timestampSuffix()}.csv`, rows);
}

export function exportDischargedPatientsToExcel(patients: DischargedPatientRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Bed", "Arrived On", "Discharged On", "Doctor", "Total Stay (Hours)", "Final Bill (₹)"],
    ...patients.map((p) => [p.patientName, p.uhid, p.bed, p.arrivedOn, p.dischargedOn, p.doctor, p.totalStayHours, p.finalBillAmount]),
  ];
  downloadCsv(`Emergency_Discharged_Patients_${timestampSuffix()}.csv`, rows);
}

export function exportTransferRecordsToExcel(records: TransferRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "From Bed", "Destination", "To Ward", "To Bed", "Transferred At", "Doctor", "Reason"],
    ...records.map((r) => [r.patientName, r.uhid, r.fromBed, r.destination, r.toWard, r.toBed, r.transferredAt, r.doctor, r.reason]),
  ];
  downloadCsv(`Emergency_Transfer_Records_${timestampSuffix()}.csv`, rows);
}

export function exportMortalityRecordsToExcel(records: MortalityRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Age", "Gender", "Bed", "Arrived On", "Time of Death", "Doctor", "Brought Dead", "Cause of Death", "Certified By"],
    ...records.map((r) => [r.patientName, r.uhid, r.age, r.gender, r.bed, r.arrivedOn, r.timeOfDeath, r.doctor, r.broughtDead ? "Yes" : "No", r.causeOfDeath, r.certifiedBy]),
  ];
  downloadCsv(`Emergency_Mortality_Records_${timestampSuffix()}.csv`, rows);
}

export function exportPendingPaymentsToExcel(records: PendingPaymentRecord[]) {
  const rows: (string | number)[][] = [
    ["Patient Name", "UHID", "Bed", "Doctor", "Total Bill (₹)", "Collected (₹)", "Pending (₹)", "Hours Admitted", "Last Payment Date"],
    ...records.map((r) => [r.patientName, r.uhid, r.bed, r.doctor, r.totalBill, r.amountCollected, r.amountPending, r.hoursAdmitted, r.lastPaymentDate]),
  ];
  downloadCsv(`Emergency_Pending_Payments_${timestampSuffix()}.csv`, rows);
}

export function exportPaymentSourcesToExcel(sources: PaymentSourceBreakdown[]) {
  const rows: (string | number)[][] = [
    ["Payment Source", "Amount (₹)", "Patients", "Percentage"],
    ...sources.map((s) => [s.source, s.amount, s.patients, `${s.percentage}%`]),
  ];
  downloadCsv(`Emergency_Payment_Sources_${timestampSuffix()}.csv`, rows);
}

export function exportFullSummaryToExcel(revenue: EmergencyRevenueBreakdown, rangeLabel: string) {
  const rows: (string | number)[][] = [
    ["Emergency Admin Dashboard Summary"],
    ["Date Range", rangeLabel],
    ["Generated On", new Date().toLocaleString("en-IN")],
    [],
    ["REVENUE BREAKDOWN"],
    ["Source", "Amount (₹)"],
    ["Bed Fees", revenue.bedFees],
    ["Doctor Fees", revenue.doctorFees],
    ["Procedure Charges", revenue.procedureCharges],
    ["Pharmacy", revenue.pharmacy],
    ["Lab - Pathology", revenue.labPathology],
    ["Lab - Radiology", revenue.labRadiology],
    ["Ambulance Fees", revenue.ambulanceFees],
    ["TOTAL REVENUE", revenue.total],
    ["Total Collected", revenue.totalCollected],
    ["Total Pending", revenue.totalPending],
    ["Change vs Previous Period (%)", revenue.changeVsPrevious],
  ];
  downloadCsv(`Emergency_Dashboard_Summary_${timestampSuffix()}.csv`, rows);
}