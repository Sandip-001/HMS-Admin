// app/(main)/icu/dashboard/_components/icu-detail-drawer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
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
  DischargedPatientRecord,
  DoctorICUWorkload,
  ICUDashboardData,
  ICUDrawerContentType,
  IcuLabTestData,
  IcuMedicineSalesData,
  MortalityRecord,
  NursePatientAssignment,
  OxygenVentilationRecord,
  PaymentSourceBreakdown,
  PendingPaymentRecord,
  ShiftedToIpdRecord,
} from "@/types/icu/icu-analytics-types";
import {
  exportDischargedPatientsToExcel,
  exportDoctorWorkloadToExcel,
  exportLabTestsToExcel,
  exportMedicineSalesToExcel,
  exportMortalityRecordsToExcel,
  exportNurseAssignmentsToExcel,
  exportOxygenVentilationToExcel,
  exportPaymentSourcesToExcel,
  exportPendingPaymentsToExcel,
  exportShiftedToIpdToExcel,
} from "@/lib/icu/icu-excel-export";

interface RevenueBreakdownRow {
  source: string;
  amount: number;
}

type DrawerRow =
  | DoctorICUWorkload
  | NursePatientAssignment
  | IcuMedicineSalesData
  | IcuLabTestData
  | DischargedPatientRecord
  | ShiftedToIpdRecord
  | MortalityRecord
  | PendingPaymentRecord
  | OxygenVentilationRecord
  | PaymentSourceBreakdown
  | RevenueBreakdownRow;

interface DrawerColumn {
  key: string;
  label: string;
  render: (row: DrawerRow) => React.ReactNode;
  defaultVisible: boolean;
}

interface DrawerConfig {
  title: string;
  subtitle: string;
  columns: DrawerColumn[];
  rows: DrawerRow[];
  onExport?: () => void;
}

const PAGE_SIZE = 8;

function isDoctorWorkload(row: DrawerRow): row is DoctorICUWorkload {
  return "totalPatients" in row && "criticalPatients" in row;
}

function isNurseAssignment(row: DrawerRow): row is NursePatientAssignment {
  return "nurseName" in row && "patientUhid" in row && "shift" in row;
}

function isMedicineSale(row: DrawerRow): row is IcuMedicineSalesData {
  return "medicineName" in row && "unitsSold" in row;
}

function isLabTest(row: DrawerRow): row is IcuLabTestData {
  return "testName" in row && "labType" in row && "totalOrdered" in row;
}

function isDischargedPatient(row: DrawerRow): row is DischargedPatientRecord {
  return "dischargedOn" in row && "totalStayDays" in row;
}

function isShiftedToIpd(row: DrawerRow): row is ShiftedToIpdRecord {
  return "toWard" in row && "fromBed" in row;
}

function isMortalityRecord(row: DrawerRow): row is MortalityRecord {
  return "timeOfDeath" in row && "causeOfDeath" in row;
}

function isPendingPayment(row: DrawerRow): row is PendingPaymentRecord {
  return "amountPending" in row && "totalBill" in row;
}

function isOxygenVentilation(row: DrawerRow): row is OxygenVentilationRecord {
  return "ratePerHour" in row && "durationHours" in row;
}

function isPaymentSource(row: DrawerRow): row is PaymentSourceBreakdown {
  return "patients" in row && "percentage" in row && "color" in row;
}

function isRevenueBreakdownRow(row: DrawerRow): row is RevenueBreakdownRow {
  return "source" in row && "amount" in row && !("patients" in row);
}

function getRowKey(row: DrawerRow, index: number): string {
  if ("id" in row && typeof row.id === "string") {
    return row.id;
  }

  if (isRevenueBreakdownRow(row)) {
    return `${row.source}-${index}`;
  }

  return String(index);
}

function useDrawerConfig(
  type: ICUDrawerContentType,
  data: ICUDashboardData,
): DrawerConfig | null {
  return useMemo(() => {
    if (!type) {
      return null;
    }

    switch (type) {
      case "doctorWorkload":
        return {
          title: "Doctor-wise ICU Patient Workload",
          subtitle: "Complete critical care workload distribution across all doctors",
          rows: data.doctorWorkload,
          onExport: () => exportDoctorWorkloadToExcel(data.doctorWorkload),
          columns: [
            {
              key: "name",
              label: "Doctor",
              defaultVisible: true,
              render: (row) => {
                if (!isDoctorWorkload(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.name}</p>
                    <p className="text-xs text-slate-400">{row.department}</p>
                  </div>
                );
              },
            },
            {
              key: "totalPatients",
              label: "Total Patients",
              defaultVisible: true,
              render: (row) => (isDoctorWorkload(row) ? <span className="font-bold text-slate-700">{row.totalPatients}</span> : "-"),
            },
            {
              key: "criticalPatients",
              label: "Critical",
              defaultVisible: true,
              render: (row) => (isDoctorWorkload(row) ? <span className="font-semibold text-red-600">{row.criticalPatients}</span> : "-"),
            },
            {
              key: "stablePatients",
              label: "Stable",
              defaultVisible: true,
              render: (row) => (isDoctorWorkload(row) ? <span className="font-semibold text-emerald-600">{row.stablePatients}</span> : "-"),
            },
            {
              key: "dischargedToday",
              label: "Discharged Today",
              defaultVisible: true,
              render: (row) => (isDoctorWorkload(row) ? row.dischargedToday : "-"),
            },
            {
              key: "deceasedCount",
              label: "Deceased",
              defaultVisible: false,
              render: (row) => (isDoctorWorkload(row) ? row.deceasedCount : "-"),
            },
            {
              key: "revenueGenerated",
              label: "Revenue",
              defaultVisible: true,
              render: (row) => (isDoctorWorkload(row) ? <span className="font-bold text-slate-800">₹{row.revenueGenerated.toLocaleString("en-IN")}</span> : "-"),
            },
            {
              key: "avgStayDays",
              label: "Avg Stay",
              defaultVisible: false,
              render: (row) => (isDoctorWorkload(row) ? `${row.avgStayDays} days` : "-"),
            },
            {
              key: "status",
              label: "Status",
              defaultVisible: true,
              render: (row) => {
                if (!isDoctorWorkload(row)) return "-";
                const className =
                  row.status === "High Load"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : row.status === "Low Load"
                      ? "border-slate-200 bg-slate-50 text-slate-600"
                      : "border-blue-200 bg-blue-50 text-blue-700";
                return <Badge variant="outline" className={className}>{row.status}</Badge>;
              },
            },
          ],
        };

      case "nurseAssignments":
        return {
          title: "Nurse-wise Patient Assignments",
          subtitle: "Shift-based patient allocation across ICU bays",
          rows: data.nurseAssignments,
          onExport: () => exportNurseAssignmentsToExcel(data.nurseAssignments),
          columns: [
            {
              key: "nurseName",
              label: "Nurse",
              defaultVisible: true,
              render: (row) => {
                if (!isNurseAssignment(row)) return "-";
                return (
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-xs font-bold text-white">
                      {row.nurseInitial}
                    </div>
                    <span className="font-semibold text-slate-800">{row.nurseName}</span>
                  </div>
                );
              },
            },
            {
              key: "shift",
              label: "Shift",
              defaultVisible: true,
              render: (row) => {
                if (!isNurseAssignment(row)) return "-";
                const className =
                  row.shift === "Morning"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : row.shift === "Evening"
                      ? "border-orange-200 bg-orange-50 text-orange-700"
                      : "border-indigo-200 bg-indigo-50 text-indigo-700";
                return <Badge variant="outline" className={className}>{row.shift}</Badge>;
              },
            },
            {
              key: "bay",
              label: "Bay",
              defaultVisible: true,
              render: (row) => (isNurseAssignment(row) ? row.bay : "-"),
            },
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isNurseAssignment(row)) return "-";
                return (
                  <div>
                    <p className="font-medium text-slate-700">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.patientUhid}</p>
                  </div>
                );
              },
            },
            {
              key: "bed",
              label: "Bed",
              defaultVisible: true,
              render: (row) => (isNurseAssignment(row) ? row.bed : "-"),
            },
            {
              key: "assignedAt",
              label: "Assigned At",
              defaultVisible: false,
              render: (row) => (isNurseAssignment(row) ? row.assignedAt : "-"),
            },
            {
              key: "status",
              label: "Status",
              defaultVisible: true,
              render: (row) => {
                if (!isNurseAssignment(row)) return "-";
                const className =
                  row.status === "On Duty"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : row.status === "Handover Pending"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-slate-50 text-slate-600";
                return <Badge variant="outline" className={className}>{row.status}</Badge>;
              },
            },
          ],
        };

      case "medicineSales":
        return {
          title: "Pharmacy Medicine Sales — ICU",
          subtitle: "Complete medicine sales breakdown for critical care patients",
          rows: data.medicineSales,
          onExport: () => exportMedicineSalesToExcel(data.medicineSales),
          columns: [
            {
              key: "medicineName",
              label: "Medicine",
              defaultVisible: true,
              render: (row) => (isMedicineSale(row) ? <span className="font-semibold text-slate-800">{row.medicineName}</span> : "-"),
            },
            {
              key: "category",
              label: "Category",
              defaultVisible: true,
              render: (row) => (isMedicineSale(row) ? row.category : "-"),
            },
            {
              key: "unitsSold",
              label: "Units Sold",
              defaultVisible: true,
              render: (row) => (isMedicineSale(row) ? <span className="font-bold text-slate-700">{row.unitsSold}</span> : "-"),
            },
            {
              key: "revenue",
              label: "Revenue",
              defaultVisible: true,
              render: (row) => (isMedicineSale(row) ? <span className="font-bold text-slate-800">₹{row.revenue.toLocaleString("en-IN")}</span> : "-"),
            },
            {
              key: "trend",
              label: "Trend",
              defaultVisible: true,
              render: (row) => {
                if (!isMedicineSale(row)) return "-";
                const className =
                  row.trend === "up"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : row.trend === "down"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-slate-200 bg-slate-50 text-slate-600";
                const symbol = row.trend === "up" ? "↑" : row.trend === "down" ? "↓" : "→";
                return <Badge variant="outline" className={className}>{symbol} {row.trendPercentage}%</Badge>;
              },
            },
          ],
        };

      case "labTests":
        return {
          title: "Lab Test Analytics — ICU",
          subtitle: "Pathology and Radiology test orders for critical care patients",
          rows: data.labTests,
          onExport: () => exportLabTestsToExcel(data.labTests),
          columns: [
            {
              key: "testName",
              label: "Test Name",
              defaultVisible: true,
              render: (row) => (isLabTest(row) ? <span className="font-semibold text-slate-800">{row.testName}</span> : "-"),
            },
            {
              key: "labType",
              label: "Type",
              defaultVisible: true,
              render: (row) => {
                if (!isLabTest(row)) return "-";
                return (
                  <Badge
                    variant="outline"
                    className={row.labType === "Pathology" ? "border-violet-200 bg-violet-50 text-violet-700" : "border-sky-200 bg-sky-50 text-sky-700"}
                  >
                    {row.labType}
                  </Badge>
                );
              },
            },
            {
              key: "totalOrdered",
              label: "Ordered",
              defaultVisible: true,
              render: (row) => (isLabTest(row) ? <span className="font-bold text-slate-700">{row.totalOrdered}</span> : "-"),
            },
            {
              key: "avgTurnaroundTime",
              label: "TAT",
              defaultVisible: true,
              render: (row) => (isLabTest(row) ? row.avgTurnaroundTime : "-"),
            },
            {
              key: "revenue",
              label: "Revenue",
              defaultVisible: true,
              render: (row) => (isLabTest(row) ? <span className="font-bold text-slate-800">₹{row.revenue.toLocaleString("en-IN")}</span> : "-"),
            },
            {
              key: "trend",
              label: "Trend",
              defaultVisible: true,
              render: (row) => {
                if (!isLabTest(row)) return "-";
                const className =
                  row.trend === "up"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : row.trend === "down"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-slate-200 bg-slate-50 text-slate-600";
                const symbol = row.trend === "up" ? "↑" : row.trend === "down" ? "↓" : "→";
                return <Badge variant="outline" className={className}>{symbol} {row.trendPercentage}%</Badge>;
              },
            },
          ],
        };

      case "dischargedPatients":
        return {
          title: "Discharged ICU Patients",
          subtitle: "Complete discharge records with final billing",
          rows: data.dischargedPatients,
          onExport: () => exportDischargedPatientsToExcel(data.dischargedPatients),
          columns: [
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isDischargedPatient(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.uhid}</p>
                  </div>
                );
              },
            },
            { key: "bed", label: "Bed", defaultVisible: true, render: (row) => (isDischargedPatient(row) ? row.bed : "-") },
            { key: "admittedOn", label: "Admitted On", defaultVisible: true, render: (row) => (isDischargedPatient(row) ? row.admittedOn : "-") },
            { key: "dischargedOn", label: "Discharged On", defaultVisible: true, render: (row) => (isDischargedPatient(row) ? row.dischargedOn : "-") },
            { key: "doctor", label: "Doctor", defaultVisible: true, render: (row) => (isDischargedPatient(row) ? row.doctor : "-") },
            { key: "totalStayDays", label: "Stay (Days)", defaultVisible: false, render: (row) => (isDischargedPatient(row) ? row.totalStayDays : "-") },
            {
              key: "finalBillAmount",
              label: "Final Bill",
              defaultVisible: true,
              render: (row) => (isDischargedPatient(row) ? <span className="font-bold text-slate-800">₹{row.finalBillAmount.toLocaleString("en-IN")}</span> : "-"),
            },
          ],
        };

      case "shiftedToIpd":
        return {
          title: "Patients Shifted to IPD",
          subtitle: "ICU-to-IPD transfer records",
          rows: data.shiftedToIpd,
          onExport: () => exportShiftedToIpdToExcel(data.shiftedToIpd),
          columns: [
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isShiftedToIpd(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.uhid}</p>
                  </div>
                );
              },
            },
            { key: "fromBed", label: "From Bed", defaultVisible: true, render: (row) => (isShiftedToIpd(row) ? row.fromBed : "-") },
            { key: "toWard", label: "To Ward", defaultVisible: true, render: (row) => (isShiftedToIpd(row) ? row.toWard : "-") },
            { key: "toBed", label: "To Bed", defaultVisible: true, render: (row) => (isShiftedToIpd(row) ? row.toBed : "-") },
            { key: "doctor", label: "Doctor", defaultVisible: false, render: (row) => (isShiftedToIpd(row) ? row.doctor : "-") },
            { key: "shiftedAt", label: "Shifted At", defaultVisible: true, render: (row) => (isShiftedToIpd(row) ? row.shiftedAt : "-") },
            {
              key: "reason",
              label: "Reason",
              defaultVisible: true,
              render: (row) => (isShiftedToIpd(row) ? <span className="text-slate-600">{row.reason}</span> : "-"),
            },
          ],
        };

      case "mortalityRecords":
        return {
          title: "Mortality Records",
          subtitle: "Complete records of patients who passed away in ICU",
          rows: data.mortalityRecords,
          onExport: () => exportMortalityRecordsToExcel(data.mortalityRecords),
          columns: [
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isMortalityRecord(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.uhid} · {row.age}y · {row.gender}</p>
                  </div>
                );
              },
            },
            { key: "bed", label: "Bed", defaultVisible: true, render: (row) => (isMortalityRecord(row) ? row.bed : "-") },
            { key: "admittedOn", label: "Admitted On", defaultVisible: false, render: (row) => (isMortalityRecord(row) ? row.admittedOn : "-") },
            { key: "timeOfDeath", label: "Time of Death", defaultVisible: true, render: (row) => (isMortalityRecord(row) ? row.timeOfDeath : "-") },
            { key: "doctor", label: "Doctor", defaultVisible: true, render: (row) => (isMortalityRecord(row) ? row.doctor : "-") },
            {
              key: "causeOfDeath",
              label: "Cause of Death",
              defaultVisible: true,
              render: (row) => (isMortalityRecord(row) ? <span className="text-slate-600">{row.causeOfDeath}</span> : "-"),
            },
            { key: "certifiedBy", label: "Certified By", defaultVisible: false, render: (row) => (isMortalityRecord(row) ? row.certifiedBy : "-") },
          ],
        };

      case "pending":
        return {
          title: "Pending Payment Details",
          subtitle: "Patients with outstanding ICU bill amounts",
          rows: data.pendingPayments,
          onExport: () => exportPendingPaymentsToExcel(data.pendingPayments),
          columns: [
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isPendingPayment(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.uhid}</p>
                  </div>
                );
              },
            },
            { key: "bed", label: "Bed", defaultVisible: true, render: (row) => (isPendingPayment(row) ? row.bed : "-") },
            { key: "doctor", label: "Doctor", defaultVisible: false, render: (row) => (isPendingPayment(row) ? row.doctor : "-") },
            {
              key: "totalBill",
              label: "Total Bill",
              defaultVisible: true,
              render: (row) => (isPendingPayment(row) ? `₹${row.totalBill.toLocaleString("en-IN")}` : "-"),
            },
            {
              key: "amountCollected",
              label: "Collected",
              defaultVisible: true,
              render: (row) => (isPendingPayment(row) ? <span className="font-semibold text-emerald-600">₹{row.amountCollected.toLocaleString("en-IN")}</span> : "-"),
            },
            {
              key: "amountPending",
              label: "Pending",
              defaultVisible: true,
              render: (row) => (isPendingPayment(row) ? <span className="font-bold text-red-600">₹{row.amountPending.toLocaleString("en-IN")}</span> : "-"),
            },
            { key: "daysAdmitted", label: "Days Admitted", defaultVisible: false, render: (row) => (isPendingPayment(row) ? row.daysAdmitted : "-") },
          ],
        };

      case "oxygenVentilation":
        return {
          title: "Oxygen &amp; Ventilation Cost Details",
          subtitle: "All active and past oxygen/ventilator usage with billing",
          rows: data.oxygenVentilationRecords,
          onExport: () => exportOxygenVentilationToExcel(data.oxygenVentilationRecords),
          columns: [
            {
              key: "patientName",
              label: "Patient",
              defaultVisible: true,
              render: (row) => {
                if (!isOxygenVentilation(row)) return "-";
                return (
                  <div>
                    <p className="font-semibold text-slate-800">{row.patientName}</p>
                    <p className="text-xs text-slate-400">{row.uhid}</p>
                  </div>
                );
              },
            },
            { key: "bed", label: "Bed", defaultVisible: true, render: (row) => (isOxygenVentilation(row) ? row.bed : "-") },
            { key: "type", label: "Support Type", defaultVisible: true, render: (row) => (isOxygenVentilation(row) ? row.type : "-") },
            { key: "startedAt", label: "Started At", defaultVisible: false, render: (row) => (isOxygenVentilation(row) ? row.startedAt : "-") },
            { key: "durationHours", label: "Duration (hrs)", defaultVisible: true, render: (row) => (isOxygenVentilation(row) ? row.durationHours : "-") },
            {
              key: "totalCost",
              label: "Total Cost",
              defaultVisible: true,
              render: (row) => (isOxygenVentilation(row) ? <span className="font-bold text-slate-800">₹{row.totalCost.toLocaleString("en-IN")}</span> : "-"),
            },
            {
              key: "status",
              label: "Status",
              defaultVisible: true,
              render: (row) => {
                if (!isOxygenVentilation(row)) return "-";
                return (
                  <Badge variant="outline" className={row.status === "Active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}>
                    {row.status}
                  </Badge>
                );
              },
            },
          ],
        };

      case "paymentSources":
        return {
          title: "Revenue by Payment Source",
          subtitle: "Self Pay, Insurance, TPA and Ayushman Bharat breakdown",
          rows: data.paymentSources,
          onExport: () => exportPaymentSourcesToExcel(data.paymentSources),
          columns: [
            {
              key: "source",
              label: "Payment Source",
              defaultVisible: true,
              render: (row) => {
                if (!isPaymentSource(row)) return "-";
                return (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                    <span className="font-semibold text-slate-800">{row.source}</span>
                  </div>
                );
              },
            },
            {
              key: "amount",
              label: "Amount",
              defaultVisible: true,
              render: (row) => (isPaymentSource(row) ? <span className="font-bold text-slate-800">₹{row.amount.toLocaleString("en-IN")}</span> : "-"),
            },
            { key: "patients", label: "Patients", defaultVisible: true, render: (row) => (isPaymentSource(row) ? row.patients : "-") },
            {
              key: "percentage",
              label: "% of Total",
              defaultVisible: true,
              render: (row) => (isPaymentSource(row) ? <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{row.percentage}%</Badge> : "-"),
            },
          ],
        };

      case "revenue":
      case "labIncome":
      case "pharmacyIncome":
        return {
          title:
            type === "revenue"
              ? "Total ICU Revenue Breakdown"
              : type === "labIncome"
                ? "Lab Income Breakdown (Pathology + Radiology)"
                : "Pharmacy Income Breakdown",
          subtitle: "Detailed source-wise financial breakdown",
          rows: [
            { source: "Bed Fees", amount: data.revenue.bedFees },
            { source: "Doctor Fees", amount: data.revenue.doctorFees },
            { source: "Oxygen Fees", amount: data.revenue.oxygenFees },
            { source: "Ventilation Fees", amount: data.revenue.ventilationFees },
            { source: "Pharmacy", amount: data.revenue.pharmacy },
            { source: "Lab - Pathology", amount: data.revenue.labPathology },
            { source: "Lab - Radiology", amount: data.revenue.labRadiology },
            { source: "Procedure Charges", amount: data.revenue.procedureCharges },
          ],
          columns: [
            {
              key: "source",
              label: "Revenue Source",
              defaultVisible: true,
              render: (row) => (isRevenueBreakdownRow(row) ? <span className="font-semibold text-slate-800">{row.source}</span> : "-"),
            },
            {
              key: "amount",
              label: "Amount",
              defaultVisible: true,
              render: (row) => (isRevenueBreakdownRow(row) ? <span className="font-bold text-slate-800">₹{row.amount.toLocaleString("en-IN")}</span> : "-"),
            },
          ],
        };

      case "collected":
        return {
          title: "Total Collected Amount Breakdown",
          subtitle: "Revenue successfully collected across all sources",
          rows: [
            { source: "Total Revenue", amount: data.revenue.total },
            { source: "Amount Collected", amount: data.revenue.totalCollected },
            { source: "Amount Pending", amount: data.revenue.totalPending },
          ],
          columns: [
            {
              key: "source",
              label: "Metric",
              defaultVisible: true,
              render: (row) => (isRevenueBreakdownRow(row) ? <span className="font-semibold text-slate-800">{row.source}</span> : "-"),
            },
            {
              key: "amount",
              label: "Amount",
              defaultVisible: true,
              render: (row) => (isRevenueBreakdownRow(row) ? <span className="font-bold text-slate-800">₹{row.amount.toLocaleString("en-IN")}</span> : "-"),
            },
          ],
        };

      case "newAdmissions":
        return {
          title: "New Admissions Today",
          subtitle: "Patients newly admitted to ICU today",
          rows: data.bedDetails
            .filter((b) => b.status === "Occupied")
            .slice(0, 5)
            .map((b) => ({ source: b.patientName ?? "Unknown", amount: 0 })),
          columns: [
            {
              key: "source",
              label: "Patient",
              defaultVisible: true,
              render: (row) => (isRevenueBreakdownRow(row) ? <span className="font-semibold text-slate-800">{row.source}</span> : "-"),
            },
          ],
        };

      case "bedOccupancy":
        return {
          title: "Bed Occupancy Details",
          subtitle: "Complete bed status across all ICU bays",
          rows: data.bayOccupancy.map((b) => ({ source: b.bay, amount: b.occupied })),
          columns: [
            {
              key: "source",
              label: "Bay",
              defaultVisible: true,
              render: (row) => (isRevenueBreakdownRow(row) ? <span className="font-semibold text-slate-800">{row.source}</span> : "-"),
            },
            {
              key: "amount",
              label: "Occupied Beds",
              defaultVisible: true,
              render: (row) => (isRevenueBreakdownRow(row) ? <span className="font-bold text-slate-800">{row.amount}</span> : "-"),
            },
          ],
        };

      default:
        return null;
    }
  }, [type, data]);
}

export function ICUDetailDrawer({
  type,
  onClose,
  data,
}: {
  type: ICUDrawerContentType;
  onClose: () => void;
  data: ICUDashboardData;
}) {
  const config = useDrawerConfig(type, data);
  const [page, setPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({});

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
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-4xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
        aria-label={config.title}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
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
                        {column.render(row)}
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