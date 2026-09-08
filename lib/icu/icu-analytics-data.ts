import type {
  DateRangeKey,
  DateRangeOption,
  ICUDashboardData,
  DoctorICUWorkload,
  NursePatientAssignment,
  IcuMedicineSalesData,
  IcuLabTestData,
  DischargedPatientRecord,
  ShiftedToIpdRecord,
  MortalityRecord,
  PendingPaymentRecord,
  OxygenVentilationRecord,
  ICUBayOccupancy,
  BedDetail,
  DailyIcuTrendPoint,
  HourlyIcuTrend,
  PaymentSourceBreakdown,
} from "@/types/icu/icu-analytics-types";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisWeek", label: "This Week" },
  { key: "lastWeek", label: "Last Week" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last6Months", label: "Last 6 Months" },
  { key: "custom", label: "Custom Range" },
];

export const ICU_DEPARTMENTS = [
  "All Departments",
  "Cardiology",
  "Trauma Surgery",
  "Emergency Medicine",
  "Neurology",
  "Pulmonology",
  "General Medicine",
];

export const ICU_BAYS = ["All Bays", "ICU-A", "ICU-B", "ICU-C", "Neuro ICU"];

const DOCTORS_BASE: Omit<DoctorICUWorkload, "id">[] = [
  { name: "Dr. Amit Verma", department: "Cardiology", avatarInitial: "AV", totalPatients: 7, criticalPatients: 5, stablePatients: 2, dischargedToday: 1, deceasedCount: 0, revenueGenerated: 385000, avgStayDays: 4.8, status: "High Load" },
  { name: "Dr. Rahul Mehta", department: "Trauma Surgery", avatarInitial: "RM", totalPatients: 6, criticalPatients: 4, stablePatients: 2, dischargedToday: 0, deceasedCount: 1, revenueGenerated: 412000, avgStayDays: 6.2, status: "High Load" },
  { name: "Dr. Priya Nair", department: "Emergency Medicine", avatarInitial: "PN", totalPatients: 4, criticalPatients: 2, stablePatients: 2, dischargedToday: 1, deceasedCount: 0, revenueGenerated: 198000, avgStayDays: 3.1, status: "Balanced" },
  { name: "Dr. Arjun Kapoor", department: "Neurology", avatarInitial: "AK", totalPatients: 3, criticalPatients: 2, stablePatients: 1, dischargedToday: 0, deceasedCount: 0, revenueGenerated: 156000, avgStayDays: 5.5, status: "Balanced" },
  { name: "Dr. Vikram Singh", department: "Pulmonology", avatarInitial: "VS", totalPatients: 2, criticalPatients: 1, stablePatients: 1, dischargedToday: 0, deceasedCount: 0, revenueGenerated: 98000, avgStayDays: 4.0, status: "Low Load" },
  { name: "Dr. Neha Gupta", department: "General Medicine", avatarInitial: "NG", totalPatients: 1, criticalPatients: 0, stablePatients: 1, dischargedToday: 0, deceasedCount: 0, revenueGenerated: 42000, avgStayDays: 2.5, status: "Low Load" },
];

export function getDoctorWorkload(): DoctorICUWorkload[] {
  return DOCTORS_BASE.map((doc, idx) => ({ id: `ICUDOC${String(idx + 1).padStart(3, "0")}`, ...doc }));
}

const NURSE_BASE: Omit<NursePatientAssignment, "id">[] = [
  { nurseName: "Sr. Kavita Sharma", nurseInitial: "KS", shift: "Morning", bay: "ICU-A", patientName: "Ravi Sharma", patientUhid: "UHID12345685", bed: "ICU-A-01", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Sr. Kavita Sharma", nurseInitial: "KS", shift: "Morning", bay: "ICU-A", patientName: "Meera Joshi", patientUhid: "UHID12345750", bed: "ICU-A-02", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Rohit Ghosh", nurseInitial: "RG", shift: "Evening", bay: "ICU-A", patientName: "Ravi Sharma", patientUhid: "UHID12345685", bed: "ICU-A-01", assignedAt: "02:00 PM", status: "On Duty" },
  { nurseName: "Rohit Ghosh", nurseInitial: "RG", shift: "Evening", bay: "ICU-A", patientName: "Meera Joshi", patientUhid: "UHID12345750", bed: "ICU-A-02", assignedAt: "02:00 PM", status: "On Duty" },
  { nurseName: "Ananya Iyer", nurseInitial: "AI", shift: "Night", bay: "ICU-B", patientName: "Rahul Roy", patientUhid: "UHID12398211", bed: "ICU-B-03", assignedAt: "10:00 PM", status: "Handover Pending" },
  { nurseName: "Deepak Nair", nurseInitial: "DN", shift: "Morning", bay: "ICU-B", patientName: "Sanjay Malhotra", patientUhid: "UHID12398225", bed: "ICU-B-04", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Sunita Menon", nurseInitial: "SM", shift: "Evening", bay: "ICU-B", patientName: "Sanjay Malhotra", patientUhid: "UHID12398225", bed: "ICU-B-04", assignedAt: "02:00 PM", status: "On Duty" },
  { nurseName: "Pooja Reddy", nurseInitial: "PR", shift: "Night", bay: "ICU-C", patientName: "Kavita Desai", patientUhid: "UHID12398226", bed: "ICU-C-01", assignedAt: "10:00 PM", status: "On Duty" },
  { nurseName: "Deepak Nair", nurseInitial: "DN", shift: "Morning", bay: "ICU-C", patientName: "Kavita Desai", patientUhid: "UHID12398226", bed: "ICU-C-01", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Ananya Iyer", nurseInitial: "AI", shift: "Night", bay: "ICU-A", patientName: "Ravi Sharma", patientUhid: "UHID12345685", bed: "ICU-A-01", assignedAt: "10:00 PM", status: "Handover Pending" },
  { nurseName: "Ritu Bhatia", nurseInitial: "RB", shift: "Morning", bay: "Neuro ICU", patientName: "Manoj Tiwari", patientUhid: "UHID12398227", bed: "NICU-01", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Ritu Bhatia", nurseInitial: "RB", shift: "Evening", bay: "Neuro ICU", patientName: "Manoj Tiwari", patientUhid: "UHID12398227", bed: "NICU-01", assignedAt: "02:00 PM", status: "On Duty" },
];

export function getNurseAssignments(): NursePatientAssignment[] {
  return NURSE_BASE.map((n, idx) => ({ id: `ICUNUR${String(idx + 1).padStart(3, "0")}`, ...n }));
}

const MEDICINE_BASE: Omit<IcuMedicineSalesData, "id">[] = [
  { medicineName: "Noradrenaline Infusion", category: "Vasopressor", unitsSold: 68, revenue: 30600, trend: "up", trendPercentage: 24 },
  { medicineName: "Inj. Piperacillin-Tazobactam 4.5g", category: "Antibiotic", unitsSold: 185, revenue: 59200, trend: "up", trendPercentage: 18 },
  { medicineName: "Inj. Midazolam", category: "Sedative", unitsSold: 92, revenue: 13800, trend: "up", trendPercentage: 15 },
  { medicineName: "Inj. Fentanyl", category: "Analgesic", unitsSold: 78, revenue: 15600, trend: "up", trendPercentage: 12 },
  { medicineName: "Inj. Insulin Regular", category: "Antidiabetic", unitsSold: 145, revenue: 7250, trend: "up", trendPercentage: 10 },
  { medicineName: "IV Fluids (NS/RL) 500ml", category: "Fluids", unitsSold: 320, revenue: 16000, trend: "up", trendPercentage: 14 },
  { medicineName: "Inj. Pantoprazole 40mg", category: "Antacid", unitsSold: 130, revenue: 3900, trend: "stable", trendPercentage: 2 },
  { medicineName: "Inj. Furosemide 20mg", category: "Diuretic", unitsSold: 95, revenue: 2850, trend: "stable", trendPercentage: 1 },
  { medicineName: "Tab. Aspirin 75mg", category: "Antiplatelet", unitsSold: 210, revenue: 420, trend: "stable", trendPercentage: 3 },
  { medicineName: "Inj. Vecuronium", category: "Muscle Relaxant", unitsSold: 34, revenue: 10200, trend: "down", trendPercentage: 8 },
  { medicineName: "Inj. Adrenaline", category: "Emergency Drug", unitsSold: 28, revenue: 8400, trend: "down", trendPercentage: 11 },
  { medicineName: "Tab. Clopidogrel 75mg", category: "Antiplatelet", unitsSold: 42, revenue: 630, trend: "down", trendPercentage: 9 },
];

export function getMedicineSales(): IcuMedicineSalesData[] {
  return MEDICINE_BASE.map((m, idx) => ({ id: `ICUMED${String(idx + 1).padStart(3, "0")}`, ...m })).sort((a, b) => b.unitsSold - a.unitsSold);
}

const LAB_TEST_BASE: Omit<IcuLabTestData, "id">[] = [
  { testName: "Arterial Blood Gas (ABG)", labType: "Pathology", totalOrdered: 210, revenue: 147000, avgTurnaroundTime: "30 mins", trend: "up", trendPercentage: 22 },
  { testName: "Complete Blood Count (CBC)", labType: "Pathology", totalOrdered: 165, revenue: 57750, avgTurnaroundTime: "2 hrs", trend: "up", trendPercentage: 14 },
  { testName: "Troponin I (Cardiac Marker)", labType: "Pathology", totalOrdered: 88, revenue: 74800, avgTurnaroundTime: "1 hr", trend: "up", trendPercentage: 18 },
  { testName: "Coagulation Profile (PT/INR)", labType: "Pathology", totalOrdered: 102, revenue: 61200, avgTurnaroundTime: "3 hrs", trend: "up", trendPercentage: 9 },
  { testName: "Serum Lactate", labType: "Pathology", totalOrdered: 95, revenue: 33250, avgTurnaroundTime: "1 hr", trend: "up", trendPercentage: 16 },
  { testName: "Serum Creatinine", labType: "Pathology", totalOrdered: 78, revenue: 23400, avgTurnaroundTime: "2 hrs", trend: "stable", trendPercentage: 2 },
  { testName: "Blood Culture & Sensitivity", labType: "Pathology", totalOrdered: 45, revenue: 40500, avgTurnaroundTime: "48 hrs", trend: "down", trendPercentage: 5 },
  { testName: "Chest X-Ray Portable", labType: "Radiology", totalOrdered: 145, revenue: 79750, avgTurnaroundTime: "30 mins", trend: "up", trendPercentage: 13 },
  { testName: "2D Echo with Color Doppler", labType: "Radiology", totalOrdered: 52, revenue: 114400, avgTurnaroundTime: "1 hr", trend: "up", trendPercentage: 11 },
  { testName: "CT Brain Plain", labType: "Radiology", totalOrdered: 28, revenue: 98000, avgTurnaroundTime: "1.5 hrs", trend: "down", trendPercentage: 6 },
  { testName: "Ultrasound Abdomen", labType: "Radiology", totalOrdered: 22, revenue: 30800, avgTurnaroundTime: "45 mins", trend: "stable", trendPercentage: 1 },
  { testName: "CT Chest with Contrast", labType: "Radiology", totalOrdered: 12, revenue: 60000, avgTurnaroundTime: "2 hrs", trend: "down", trendPercentage: 9 },
];

export function getLabTests(): IcuLabTestData[] {
  return LAB_TEST_BASE.map((t, idx) => ({ id: `ICULAB${String(idx + 1).padStart(3, "0")}`, ...t })).sort((a, b) => b.totalOrdered - a.totalOrdered);
}

const DISCHARGED_BASE: Omit<DischargedPatientRecord, "id">[] = [
  { patientName: "Suresh Yadav", uhid: "UHID12398230", bed: "ICU-A-03", admittedOn: "24 Aug 2026", dischargedOn: "30 Aug 2026", doctor: "Dr. Amit Verma", totalStayDays: 6, finalBillAmount: 285000 },
  { patientName: "Anita Rao", uhid: "UHID12398231", bed: "ICU-B-01", admittedOn: "26 Aug 2026", dischargedOn: "30 Aug 2026", doctor: "Dr. Priya Nair", totalStayDays: 4, finalBillAmount: 168000 },
  { patientName: "Ramesh Gupta", uhid: "UHID12398232", bed: "ICU-C-02", admittedOn: "22 Aug 2026", dischargedOn: "29 Aug 2026", doctor: "Dr. Rahul Mehta", totalStayDays: 7, finalBillAmount: 342000 },
  { patientName: "Lakshmi Pillai", uhid: "UHID12398233", bed: "ICU-A-04", admittedOn: "27 Aug 2026", dischargedOn: "31 Aug 2026", doctor: "Dr. Arjun Kapoor", totalStayDays: 4, finalBillAmount: 195000 },
];

export function getDischargedPatients(): DischargedPatientRecord[] {
  return DISCHARGED_BASE.map((d, idx) => ({ id: `DIS${String(idx + 1).padStart(3, "0")}`, ...d }));
}

const SHIFTED_IPD_BASE: Omit<ShiftedToIpdRecord, "id">[] = [
  { patientName: "Meera Iyer", uhid: "UHID12398234", fromBed: "ICU-B-02", toWard: "Private Rooms", toBed: "PR-105", shiftedAt: "30 Aug 2026, 09:15 AM", doctor: "Dr. Vikram Singh", reason: "Condition stabilized, no longer requires critical monitoring" },
  { patientName: "Rajesh Kumar", uhid: "UHID12398235", fromBed: "ICU-A-05", toWard: "General Ward", toBed: "GW-004-B", shiftedAt: "29 Aug 2026, 03:40 PM", doctor: "Dr. Neha Gupta", reason: "Weaned off ventilator, vitals stable for 48 hours" },
  { patientName: "Sunita Verma", uhid: "UHID12398236", fromBed: "ICU-C-03", toWard: "Deluxe Ward", toBed: "DW-002", shiftedAt: "28 Aug 2026, 11:20 AM", doctor: "Dr. Amit Verma", reason: "Post-cardiac monitoring complete, stable rhythm" },
];

export function getShiftedToIpd(): ShiftedToIpdRecord[] {
  return SHIFTED_IPD_BASE.map((s, idx) => ({ id: `SFT${String(idx + 1).padStart(3, "0")}`, ...s }));
}

const MORTALITY_BASE: Omit<MortalityRecord, "id">[] = [
  { patientName: "Harish Chandra", uhid: "UHID12398240", age: 68, gender: "Male", bed: "ICU-B-05", admittedOn: "25 Aug 2026", timeOfDeath: "29 Aug 2026, 04:20 AM", doctor: "Dr. Rahul Mehta", causeOfDeath: "Multi-organ failure secondary to septic shock", certifiedBy: "Dr. Rahul Mehta" },
];

export function getMortalityRecords(): MortalityRecord[] {
  return MORTALITY_BASE.map((m, idx) => ({ id: `MOR${String(idx + 1).padStart(3, "0")}`, ...m }));
}

const PENDING_PAYMENT_BASE: Omit<PendingPaymentRecord, "id">[] = [
  { patientName: "Ravi Sharma", uhid: "UHID12345685", bed: "ICU-A-01", doctor: "Dr. Amit Verma", totalBill: 425000, amountCollected: 250000, amountPending: 175000, daysAdmitted: 4, lastPaymentDate: "28 Aug 2026" },
  { patientName: "Rahul Roy", uhid: "UHID12398211", bed: "ICU-B-03", doctor: "Dr. Rahul Mehta", totalBill: 512000, amountCollected: 300000, amountPending: 212000, daysAdmitted: 4, lastPaymentDate: "27 Aug 2026" },
  { patientName: "Meera Joshi", uhid: "UHID12345750", bed: "ICU-A-02", doctor: "Dr. Priya Nair", totalBill: 186000, amountCollected: 186000, amountPending: 0, daysAdmitted: 4, lastPaymentDate: "30 Aug 2026" },
  { patientName: "Sanjay Malhotra", uhid: "UHID12398225", bed: "ICU-B-04", doctor: "Dr. Arjun Kapoor", totalBill: 298000, amountCollected: 150000, amountPending: 148000, daysAdmitted: 3, lastPaymentDate: "29 Aug 2026" },
  { patientName: "Kavita Desai", uhid: "UHID12398226", bed: "ICU-C-01", doctor: "Dr. Vikram Singh", totalBill: 176000, amountCollected: 80000, amountPending: 96000, daysAdmitted: 2, lastPaymentDate: "30 Aug 2026" },
];

export function getPendingPayments(): PendingPaymentRecord[] {
  return PENDING_PAYMENT_BASE.filter((p) => p.amountPending > 0).map((p, idx) => ({ id: `PEND${String(idx + 1).padStart(3, "0")}`, ...p }));
}

const OXYGEN_VENT_BASE: Omit<OxygenVentilationRecord, "id">[] = [
  { patientName: "Ravi Sharma", uhid: "UHID12345685", bed: "ICU-A-01", type: "Oxygen Support", startedAt: "27 Aug 2026, 09:40 AM", durationHours: 96, ratePerHour: 150, totalCost: 14400, status: "Active" },
  { patientName: "Rahul Roy", uhid: "UHID12398211", bed: "ICU-B-03", type: "Ventilator (Invasive)", startedAt: "27 Aug 2026, 11:30 AM", durationHours: 94, ratePerHour: 800, totalCost: 75200, status: "Active" },
  { patientName: "Meera Joshi", uhid: "UHID12345750", bed: "ICU-A-02", type: "High Flow Nasal Cannula", startedAt: "27 Aug 2026, 10:55 AM", durationHours: 48, ratePerHour: 300, totalCost: 14400, status: "Discontinued" },
  { patientName: "Sanjay Malhotra", uhid: "UHID12398225", bed: "ICU-B-04", type: "Ventilator (Non-Invasive)", startedAt: "28 Aug 2026, 02:15 PM", durationHours: 66, ratePerHour: 500, totalCost: 33000, status: "Active" },
  { patientName: "Kavita Desai", uhid: "UHID12398226", bed: "ICU-C-01", type: "Oxygen Support", startedAt: "29 Aug 2026, 08:00 AM", durationHours: 38, ratePerHour: 150, totalCost: 5700, status: "Active" },
  { patientName: "Harish Chandra", uhid: "UHID12398240", bed: "ICU-B-05", type: "Ventilator (Invasive)", startedAt: "25 Aug 2026, 06:00 PM", durationHours: 82, ratePerHour: 800, totalCost: 65600, status: "Discontinued" },
];

export function getOxygenVentilationRecords(): OxygenVentilationRecord[] {
  return OXYGEN_VENT_BASE.map((o, idx) => ({ id: `OXV${String(idx + 1).padStart(3, "0")}`, ...o }));
}

const BAY_COLORS: Record<string, string> = {
  "ICU-A": "#ef4444",
  "ICU-B": "#f97316",
  "ICU-C": "#8b5cf6",
  "Neuro ICU": "#3b82f6",
};

export function getBayOccupancy(): ICUBayOccupancy[] {
  return [
    { bay: "ICU-A", totalBeds: 8, occupied: 7, available: 1, maintenance: 0, color: BAY_COLORS["ICU-A"] },
    { bay: "ICU-B", totalBeds: 8, occupied: 6, available: 1, maintenance: 1, color: BAY_COLORS["ICU-B"] },
    { bay: "ICU-C", totalBeds: 6, occupied: 4, available: 2, maintenance: 0, color: BAY_COLORS["ICU-C"] },
    { bay: "Neuro ICU", totalBeds: 4, occupied: 3, available: 1, maintenance: 0, color: BAY_COLORS["Neuro ICU"] },
  ];
}

export function getBedDetails(): BedDetail[] {
  return [
    { bedId: "ICU-A-01", bay: "ICU-A", status: "Occupied", patientName: "Ravi Sharma", uhid: "UHID12345685", admittedOn: "27 Aug 2026" },
    { bedId: "ICU-A-02", bay: "ICU-A", status: "Occupied", patientName: "Meera Joshi", uhid: "UHID12345750", admittedOn: "27 Aug 2026" },
    { bedId: "ICU-A-03", bay: "ICU-A", status: "Available" },
    { bedId: "ICU-A-04", bay: "ICU-A", status: "Occupied", patientName: "Lakshmi Pillai", uhid: "UHID12398233", admittedOn: "27 Aug 2026" },
    { bedId: "ICU-A-05", bay: "ICU-A", status: "Occupied", patientName: "Rajesh Kumar", uhid: "UHID12398235", admittedOn: "26 Aug 2026" },
    { bedId: "ICU-A-06", bay: "ICU-A", status: "Occupied", patientName: "Deepa Nair", uhid: "UHID12398241", admittedOn: "28 Aug 2026" },
    { bedId: "ICU-A-07", bay: "ICU-A", status: "Occupied", patientName: "Vinod Shetty", uhid: "UHID12398242", admittedOn: "29 Aug 2026" },
    { bedId: "ICU-A-08", bay: "ICU-A", status: "Occupied", patientName: "Farida Khan", uhid: "UHID12398243", admittedOn: "30 Aug 2026" },
    { bedId: "ICU-B-01", bay: "ICU-B", status: "Occupied", patientName: "Anita Rao", uhid: "UHID12398231", admittedOn: "26 Aug 2026" },
    { bedId: "ICU-B-02", bay: "ICU-B", status: "Occupied", patientName: "Meera Iyer", uhid: "UHID12398234", admittedOn: "25 Aug 2026" },
    { bedId: "ICU-B-03", bay: "ICU-B", status: "Occupied", patientName: "Rahul Roy", uhid: "UHID12398211", admittedOn: "27 Aug 2026" },
    { bedId: "ICU-B-04", bay: "ICU-B", status: "Occupied", patientName: "Sanjay Malhotra", uhid: "UHID12398225", admittedOn: "28 Aug 2026" },
    { bedId: "ICU-B-05", bay: "ICU-B", status: "Maintenance", maintenanceReason: "Ventilator unit servicing" },
    { bedId: "ICU-B-06", bay: "ICU-B", status: "Occupied", patientName: "Irfan Ali", uhid: "UHID12398244", admittedOn: "29 Aug 2026" },
    { bedId: "ICU-B-07", bay: "ICU-B", status: "Occupied", patientName: "Geeta Kapoor", uhid: "UHID12398245", admittedOn: "30 Aug 2026" },
    { bedId: "ICU-B-08", bay: "ICU-B", status: "Available" },
    { bedId: "ICU-C-01", bay: "ICU-C", status: "Occupied", patientName: "Kavita Desai", uhid: "UHID12398226", admittedOn: "29 Aug 2026" },
    { bedId: "ICU-C-02", bay: "ICU-C", status: "Occupied", patientName: "Ramesh Gupta", uhid: "UHID12398232", admittedOn: "22 Aug 2026" },
    { bedId: "ICU-C-03", bay: "ICU-C", status: "Available" },
    { bedId: "ICU-C-04", bay: "ICU-C", status: "Occupied", patientName: "Nitin Joshi", uhid: "UHID12398246", admittedOn: "30 Aug 2026" },
    { bedId: "ICU-C-05", bay: "ICU-C", status: "Available" },
    { bedId: "ICU-C-06", bay: "ICU-C", status: "Occupied", patientName: "Sunita Verma", uhid: "UHID12398236", admittedOn: "28 Aug 2026" },
    { bedId: "NICU-01", bay: "Neuro ICU", status: "Occupied", patientName: "Manoj Tiwari", uhid: "UHID12398227", admittedOn: "30 Aug 2026" },
    { bedId: "NICU-02", bay: "Neuro ICU", status: "Occupied", patientName: "Ashok Verma", uhid: "UHID12398247", admittedOn: "29 Aug 2026" },
    { bedId: "NICU-03", bay: "Neuro ICU", status: "Occupied", patientName: "Padma Reddy", uhid: "UHID12398248", admittedOn: "28 Aug 2026" },
    { bedId: "NICU-04", bay: "Neuro ICU", status: "Available" },
  ];
}

export function getPaymentSources(): PaymentSourceBreakdown[] {
  return [
    { source: "Self Pay", amount: 542000, patients: 8, percentage: 36, color: "#3b82f6" },
    { source: "Health Insurance", amount: 468000, patients: 6, percentage: 31, color: "#8b5cf6" },
    { source: "TPA", amount: 348000, patients: 4, percentage: 23, color: "#f59e0b" },
    { source: "Ayushman Bharat", amount: 151000, patients: 2, percentage: 10, color: "#10b981" },
  ];
}

export function getDailyTrends(days: number): DailyIcuTrendPoint[] {
  const base: DailyIcuTrendPoint[] = [
    { date: "25 Aug", revenue: 685000, admissions: 4, discharges: 2, deaths: 0, collected: 512000, pending: 173000 },
    { date: "26 Aug", revenue: 742000, admissions: 5, discharges: 3, deaths: 0, collected: 568000, pending: 174000 },
    { date: "27 Aug", revenue: 698000, admissions: 6, discharges: 2, deaths: 0, collected: 534000, pending: 164000 },
    { date: "28 Aug", revenue: 815000, admissions: 5, discharges: 3, deaths: 1, collected: 625000, pending: 190000 },
    { date: "29 Aug", revenue: 772000, admissions: 4, discharges: 4, deaths: 1, collected: 598000, pending: 174000 },
    { date: "30 Aug", revenue: 758000, admissions: 5, discharges: 4, deaths: 0, collected: 578000, pending: 180000 },
    { date: "31 Aug", revenue: 826000, admissions: 6, discharges: 3, deaths: 0, collected: 642000, pending: 184000 },
    { date: "1 Sep", revenue: 745000, admissions: 4, discharges: 3, deaths: 0, collected: 570000, pending: 175000 },
    { date: "2 Sep", revenue: 792000, admissions: 5, discharges: 4, deaths: 1, collected: 612000, pending: 180000 },
    { date: "3 Sep", revenue: 808000, admissions: 6, discharges: 3, deaths: 0, collected: 628000, pending: 180000 },
    { date: "4 Sep", revenue: 765000, admissions: 4, discharges: 4, deaths: 0, collected: 588000, pending: 177000 },
    { date: "5 Sep", revenue: 412000, admissions: 2, discharges: 2, deaths: 0, collected: 312000, pending: 100000 },
  ];
  return base.slice(-days);
}

export function getHourlyTrends(): HourlyIcuTrend[] {
  return [
    { hour: "6 AM", admissions: 1, discharges: 0 },
    { hour: "8 AM", admissions: 1, discharges: 1 },
    { hour: "10 AM", admissions: 2, discharges: 2 },
    { hour: "12 PM", admissions: 1, discharges: 1 },
    { hour: "2 PM", admissions: 0, discharges: 1 },
    { hour: "4 PM", admissions: 1, discharges: 0 },
    { hour: "6 PM", admissions: 0, discharges: 0 },
    { hour: "8 PM", admissions: 1, discharges: 0 },
  ];
}

const RANGE_MULTIPLIER: Record<DateRangeKey, number> = {
  today: 1,
  yesterday: 0.95,
  thisWeek: 6.3,
  lastWeek: 6.0,
  lastMonth: 26.8,
  last6Months: 160,
  custom: 1,
};

const RANGE_CHANGE: Record<DateRangeKey, number> = {
  today: 7.6,
  yesterday: -3.8,
  thisWeek: 11.2,
  lastWeek: 5.1,
  lastMonth: 14.4,
  last6Months: 21.0,
  custom: 0,
};

export function getICUDashboardData(range: DateRangeKey): ICUDashboardData {
  const multiplier = RANGE_MULTIPLIER[range];
  const change = RANGE_CHANGE[range];

  const bedFees = Math.round(285000 * multiplier);
  const doctorFees = Math.round(198000 * multiplier);
  const oxygenFees = Math.round(48600 * multiplier);
  const ventilationFees = Math.round(173800 * multiplier);
  const pharmacy = Math.round(96500 * multiplier);
  const labPathology = Math.round(72400 * multiplier);
  const labRadiology = Math.round(89200 * multiplier);
  const procedureCharges = Math.round(58000 * multiplier);
  const total = bedFees + doctorFees + oxygenFees + ventilationFees + pharmacy + labPathology + labRadiology + procedureCharges;
  const totalCollected = Math.round(total * 0.76);
  const totalPending = total - totalCollected;

  const daysMap: Record<DateRangeKey, number> = {
    today: 1, yesterday: 1, thisWeek: 7, lastWeek: 7, lastMonth: 12, last6Months: 12, custom: 7,
  };

  return {
    revenue: {
      bedFees,
      doctorFees,
      oxygenFees,
      ventilationFees,
      pharmacy,
      labPathology,
      labRadiology,
      procedureCharges,
      total,
      totalCollected,
      totalPending,
      changeVsPrevious: change,
    },
    paymentSources: getPaymentSources(),
    bedOccupancy: {
      totalBeds: 26,
      occupied: 20,
      available: 5,
      maintenance: 1,
      changeVsPrevious: { occupied: 8.3 },
    },
    patientFlow: {
      dischargedToday: Math.round(4 * multiplier),
      shiftedToIPD: Math.round(3 * multiplier),
      deceasedToday: Math.round(1 * multiplier),
      newAdmissionsToday: Math.round(5 * multiplier),
      changeVsPrevious: {
        discharged: 9.5,
        shiftedToIPD: 12.0,
        deceased: -20.0,
        newAdmissions: 6.8,
      },
    },
    doctorWorkload: getDoctorWorkload(),
    nurseAssignments: getNurseAssignments(),
    medicineSales: getMedicineSales(),
    labTests: getLabTests(),
    dischargedPatients: getDischargedPatients(),
    shiftedToIpd: getShiftedToIpd(),
    mortalityRecords: getMortalityRecords(),
    pendingPayments: getPendingPayments(),
    oxygenVentilationRecords: getOxygenVentilationRecords(),
    bayOccupancy: getBayOccupancy(),
    bedDetails: getBedDetails(),
    dailyTrends: getDailyTrends(daysMap[range]),
    hourlyTrends: getHourlyTrends(),
  };
}