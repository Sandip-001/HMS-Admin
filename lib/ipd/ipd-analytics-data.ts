// lib/ipd/ipd-analytics-data.ts
import type {
  DateRangeKey,
  DateRangeOption,
  IPDDashboardData,
  DoctorIpdWorkload,
  NursePatientAssignment,
  IpdMedicineSalesData,
  IpdLabTestData,
  CancelledAdmission,
  WardWiseOccupancy,
  DailyIpdTrendPoint,
  HourlyAdmissionTrend,
  PaymentSourceBreakdown,
} from "@/types/ipd/ipd-analytics-types";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisWeek", label: "This Week" },
  { key: "lastWeek", label: "Last Week" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last6Months", label: "Last 6 Months" },
  { key: "custom", label: "Custom Range" },
];

export const IPD_DEPARTMENTS = [
  "All Departments",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Trauma Surgery",
  "Emergency Medicine",
  "Gastroenterology",
  "General Medicine",
];

export const IPD_WARDS = ["All Wards", "General Ward", "Private Rooms", "ICU-A", "ICU-B", "Deluxe Ward"];

const DOCTORS_BASE: Omit<DoctorIpdWorkload, "id">[] = [
  { name: "Dr. Amit Verma", department: "Cardiology", avatarInitial: "AV", totalPatients: 14, criticalPatients: 3, stablePatients: 11, dischargedToday: 2, revenueGenerated: 285000, avgStayDays: 5.2, status: "High Load" },
  { name: "Dr. Rahul Mehta", department: "Trauma Surgery", avatarInitial: "RM", totalPatients: 12, criticalPatients: 4, stablePatients: 8, dischargedToday: 1, revenueGenerated: 312000, avgStayDays: 6.8, status: "High Load" },
  { name: "Dr. Priya Nair", department: "Emergency Medicine", avatarInitial: "PN", totalPatients: 9, criticalPatients: 2, stablePatients: 7, dischargedToday: 2, revenueGenerated: 198000, avgStayDays: 3.5, status: "Balanced" },
  { name: "Dr. Sunita Rao", department: "Orthopedics", avatarInitial: "SR", totalPatients: 8, criticalPatients: 1, stablePatients: 7, dischargedToday: 1, revenueGenerated: 176000, avgStayDays: 4.1, status: "Balanced" },
  { name: "Dr. Vikram Singh", department: "Gastroenterology", avatarInitial: "VS", totalPatients: 4, criticalPatients: 0, stablePatients: 4, dischargedToday: 1, revenueGenerated: 84000, avgStayDays: 3.0, status: "Low Load" },
  { name: "Dr. Neha Gupta", department: "General Medicine", avatarInitial: "NG", totalPatients: 6, criticalPatients: 1, stablePatients: 5, dischargedToday: 0, revenueGenerated: 102000, avgStayDays: 4.6, status: "Balanced" },
  { name: "Dr. Arjun Kapoor", department: "Neurology", avatarInitial: "AK", totalPatients: 3, criticalPatients: 0, stablePatients: 3, dischargedToday: 0, revenueGenerated: 63000, avgStayDays: 5.0, status: "Low Load" },
];

export function getDoctorWorkload(): DoctorIpdWorkload[] {
  return DOCTORS_BASE.map((doc, idx) => ({ id: `IPDDOC${String(idx + 1).padStart(3, "0")}`, ...doc }));
}

const NURSE_BASE: Omit<NursePatientAssignment, "id">[] = [
  { nurseName: "Sr. Kavita Sharma", nurseInitial: "KS", shift: "Morning", ward: "ICU-A", patientName: "Ravi Sharma", patientUhid: "UHID12345685", bed: "ICU-A-01", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Sr. Kavita Sharma", nurseInitial: "KS", shift: "Morning", ward: "ICU-A", patientName: "Meera Joshi", patientUhid: "UHID12345750", bed: "ICU-A-02", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Rohit Ghosh", nurseInitial: "RG", shift: "Evening", ward: "ICU-A", patientName: "Ravi Sharma", patientUhid: "UHID12345685", bed: "ICU-A-01", assignedAt: "02:00 PM", status: "On Duty" },
  { nurseName: "Rohit Ghosh", nurseInitial: "RG", shift: "Evening", ward: "ICU-A", patientName: "Meera Joshi", patientUhid: "UHID12345750", bed: "ICU-A-02", assignedAt: "02:00 PM", status: "On Duty" },
  { nurseName: "Ananya Iyer", nurseInitial: "AI", shift: "Night", ward: "ICU-B", patientName: "Rahul Roy", patientUhid: "UHID12398211", bed: "ICU-B-03", assignedAt: "10:00 PM", status: "Handover Pending" },
  { nurseName: "Deepak Nair", nurseInitial: "DN", shift: "Morning", ward: "Private Rooms", patientName: "Meera Iyer", patientUhid: "UHID12398212", bed: "PR-102", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Sunita Menon", nurseInitial: "SM", shift: "Evening", ward: "Private Rooms", patientName: "Meera Iyer", patientUhid: "UHID12398212", bed: "PR-102", assignedAt: "02:00 PM", status: "On Duty" },
  { nurseName: "Pooja Reddy", nurseInitial: "PR", shift: "Night", ward: "General Ward", patientName: "Ramesh Gupta", patientUhid: "UHID12398213", bed: "GW-001-A", assignedAt: "10:00 PM", status: "On Duty" },
  { nurseName: "Deepak Nair", nurseInitial: "DN", shift: "Morning", ward: "General Ward", patientName: "Ramesh Gupta", patientUhid: "UHID12398213", bed: "GW-001-A", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Ananya Iyer", nurseInitial: "AI", shift: "Night", ward: "ICU-A", patientName: "Ravi Sharma", patientUhid: "UHID12345685", bed: "ICU-A-01", assignedAt: "10:00 PM", status: "Handover Pending" },
];

export function getNurseAssignments(): NursePatientAssignment[] {
  return NURSE_BASE.map((n, idx) => ({ id: `NUR${String(idx + 1).padStart(3, "0")}`, ...n }));
}

const MEDICINE_BASE: Omit<IpdMedicineSalesData, "id">[] = [
  { medicineName: "Inj. Piperacillin-Tazobactam 4.5g", category: "Antibiotic", unitsSold: 145, revenue: 46400, trend: "up", trendPercentage: 16 },
  { medicineName: "Noradrenaline Infusion", category: "Vasopressor", unitsSold: 38, revenue: 17100, trend: "up", trendPercentage: 22 },
  { medicineName: "Tab. Aspirin 75mg", category: "Antiplatelet", unitsSold: 320, revenue: 640, trend: "stable", trendPercentage: 2 },
  { medicineName: "Tab. Atorvastatin 40mg", category: "Statin", unitsSold: 210, revenue: 1050, trend: "up", trendPercentage: 8 },
  { medicineName: "Tab. Metoprolol 25mg", category: "Beta Blocker", unitsSold: 280, revenue: 840, trend: "up", trendPercentage: 10 },
  { medicineName: "Inj. Insulin Regular", category: "Antidiabetic", unitsSold: 165, revenue: 8250, trend: "up", trendPercentage: 14 },
  { medicineName: "Tab. Ondansetron 4mg", category: "Antiemetic", unitsSold: 190, revenue: 380, trend: "down", trendPercentage: 5 },
  { medicineName: "Inj. Pantoprazole 40mg", category: "Antacid", unitsSold: 175, revenue: 5250, trend: "stable", trendPercentage: 1 },
  { medicineName: "Inj. Furosemide 20mg", category: "Diuretic", unitsSold: 88, revenue: 2640, trend: "down", trendPercentage: 9 },
  { medicineName: "IV Fluids (NS/RL) 500ml", category: "Fluids", unitsSold: 420, revenue: 21000, trend: "up", trendPercentage: 11 },
  { medicineName: "Tab. Clopidogrel 75mg", category: "Antiplatelet", unitsSold: 62, revenue: 930, trend: "down", trendPercentage: 12 },
  { medicineName: "Inj. Tramadol 50mg", category: "Analgesic", unitsSold: 45, revenue: 2250, trend: "down", trendPercentage: 15 },
];

export function getMedicineSales(): IpdMedicineSalesData[] {
  return MEDICINE_BASE.map((m, idx) => ({ id: `IPDMED${String(idx + 1).padStart(3, "0")}`, ...m })).sort((a, b) => b.unitsSold - a.unitsSold);
}

const LAB_TEST_BASE: Omit<IpdLabTestData, "id">[] = [
  { testName: "Complete Blood Count (CBC)", labType: "Pathology", totalOrdered: 165, revenue: 57750, avgTurnaroundTime: "2 hrs", trend: "up", trendPercentage: 12 },
  { testName: "Troponin I (Cardiac Marker)", labType: "Pathology", totalOrdered: 48, revenue: 40800, avgTurnaroundTime: "1 hr", trend: "up", trendPercentage: 18 },
  { testName: "Coagulation Profile (PT/INR)", labType: "Pathology", totalOrdered: 72, revenue: 43200, avgTurnaroundTime: "3 hrs", trend: "up", trendPercentage: 9 },
  { testName: "Serum Creatinine", labType: "Pathology", totalOrdered: 95, revenue: 28500, avgTurnaroundTime: "2 hrs", trend: "stable", trendPercentage: 2 },
  { testName: "Liver Function Test (LFT)", labType: "Pathology", totalOrdered: 58, revenue: 31900, avgTurnaroundTime: "3 hrs", trend: "down", trendPercentage: 4 },
  { testName: "Blood Grouping & Cross-Match", labType: "Pathology", totalOrdered: 34, revenue: 17000, avgTurnaroundTime: "1 hr", trend: "stable", trendPercentage: 1 },
  { testName: "Arterial Blood Gas (ABG)", labType: "Pathology", totalOrdered: 41, revenue: 28700, avgTurnaroundTime: "30 mins", trend: "up", trendPercentage: 15 },
  { testName: "2D Echo with Color Doppler", labType: "Radiology", totalOrdered: 38, revenue: 83600, avgTurnaroundTime: "1 hr", trend: "up", trendPercentage: 13 },
  { testName: "Chest X-Ray Portable", labType: "Radiology", totalOrdered: 112, revenue: 61600, avgTurnaroundTime: "30 mins", trend: "up", trendPercentage: 10 },
  { testName: "CT Brain Plain", labType: "Radiology", totalOrdered: 22, revenue: 77000, avgTurnaroundTime: "1.5 hrs", trend: "down", trendPercentage: 6 },
  { testName: "Ultrasound Abdomen", labType: "Radiology", totalOrdered: 45, revenue: 63000, avgTurnaroundTime: "45 mins", trend: "up", trendPercentage: 8 },
  { testName: "CT Abdomen with Contrast", labType: "Radiology", totalOrdered: 14, revenue: 63000, avgTurnaroundTime: "2 hrs", trend: "down", trendPercentage: 10 },
];

export function getLabTests(): IpdLabTestData[] {
  return LAB_TEST_BASE.map((t, idx) => ({ id: `IPDLAB${String(idx + 1).padStart(3, "0")}`, ...t })).sort((a, b) => b.totalOrdered - a.totalOrdered);
}

const CANCELLED_BASE: Omit<CancelledAdmission, "id">[] = [
  { patientName: "Sanjay Malhotra", uhid: "UHID12398220", department: "Cardiology", doctor: "Dr. Amit Verma", requestedBed: "PR-104", cancelledAt: "30 Aug 2026, 11:20 AM", cancelledBy: "Front Desk - Anjali", reason: "Patient opted for another hospital" },
  { patientName: "Kavita Desai", uhid: "UHID12398221", department: "Orthopedics", doctor: "Dr. Sunita Rao", requestedBed: "GW-002-B", cancelledAt: "29 Aug 2026, 03:45 PM", cancelledBy: "Front Desk - Rohan", reason: "Insurance pre-authorization rejected" },
  { patientName: "Manoj Tiwari", uhid: "UHID12398222", department: "General Medicine", doctor: "Dr. Neha Gupta", requestedBed: "GW-003-A", cancelledAt: "28 Aug 2026, 09:10 AM", cancelledBy: "Admin - Priya", reason: "Patient condition stabilized, admission not required" },
  { patientName: "Rekha Iyer", uhid: "UHID12398223", department: "Neurology", doctor: "Dr. Arjun Kapoor", requestedBed: "PR-105", cancelledAt: "27 Aug 2026, 05:30 PM", cancelledBy: "Front Desk - Anjali", reason: "Duplicate registration entry" },
];

export function getCancelledAdmissions(): CancelledAdmission[] {
  return CANCELLED_BASE.map((c, idx) => ({ id: `CANC${String(idx + 1).padStart(3, "0")}`, ...c }));
}

const WARD_COLORS: Record<string, string> = {
  "General Ward": "#3b82f6",
  "Private Rooms": "#8b5cf6",
  "ICU-A": "#ef4444",
  "ICU-B": "#f97316",
  "Deluxe Ward": "#10b981",
};

export function getWardOccupancy(): WardWiseOccupancy[] {
  return [
    { ward: "General Ward", totalBeds: 20, occupied: 16, available: 3, maintenance: 1, color: WARD_COLORS["General Ward"] },
    { ward: "Private Rooms", totalBeds: 15, occupied: 11, available: 3, maintenance: 1, color: WARD_COLORS["Private Rooms"] },
    { ward: "ICU-A", totalBeds: 8, occupied: 7, available: 1, maintenance: 0, color: WARD_COLORS["ICU-A"] },
    { ward: "ICU-B", totalBeds: 8, occupied: 5, available: 2, maintenance: 1, color: WARD_COLORS["ICU-B"] },
    { ward: "Deluxe Ward", totalBeds: 10, occupied: 6, available: 4, maintenance: 0, color: WARD_COLORS["Deluxe Ward"] },
  ];
}

export function getPaymentSources(): PaymentSourceBreakdown[] {
  return [
    { source: "Self Pay", amount: 486000, patients: 28, percentage: 42, color: "#3b82f6" },
    { source: "Health Insurance", amount: 348000, patients: 19, percentage: 30, color: "#8b5cf6" },
    { source: "TPA", amount: 232000, patients: 14, percentage: 20, color: "#f59e0b" },
    { source: "Ayushman Bharat", amount: 92800, patients: 9, percentage: 8, color: "#10b981" },
  ];
}

export function getDailyTrends(days: number): DailyIpdTrendPoint[] {
  const base: DailyIpdTrendPoint[] = [
    { date: "25 Aug", revenue: 385000, admissions: 12, discharges: 9, collected: 298000, pending: 87000 },
    { date: "26 Aug", revenue: 412000, admissions: 15, discharges: 11, collected: 325000, pending: 87000 },
    { date: "27 Aug", revenue: 358000, admissions: 10, discharges: 8, collected: 271000, pending: 87000 },
    { date: "28 Aug", revenue: 445000, admissions: 17, discharges: 13, collected: 356000, pending: 89000 },
    { date: "29 Aug", revenue: 428000, admissions: 14, discharges: 12, collected: 342000, pending: 86000 },
    { date: "30 Aug", revenue: 396000, admissions: 13, discharges: 10, collected: 312000, pending: 84000 },
    { date: "31 Aug", revenue: 462000, admissions: 18, discharges: 14, collected: 371000, pending: 91000 },
    { date: "1 Sep", revenue: 405000, admissions: 12, discharges: 11, collected: 328000, pending: 77000 },
    { date: "2 Sep", revenue: 438000, admissions: 16, discharges: 13, collected: 351000, pending: 87000 },
    { date: "3 Sep", revenue: 451000, admissions: 15, discharges: 12, collected: 362000, pending: 89000 },
    { date: "4 Sep", revenue: 419000, admissions: 13, discharges: 10, collected: 336000, pending: 83000 },
    { date: "5 Sep", revenue: 236000, admissions: 7, discharges: 5, collected: 178000, pending: 58000 },
  ];
  return base.slice(-days);
}

export function getHourlyTrends(): HourlyAdmissionTrend[] {
  return [
    { hour: "6 AM", admissions: 1, discharges: 0 },
    { hour: "8 AM", admissions: 2, discharges: 3 },
    { hour: "10 AM", admissions: 3, discharges: 4 },
    { hour: "12 PM", admissions: 2, discharges: 2 },
    { hour: "2 PM", admissions: 1, discharges: 1 },
    { hour: "4 PM", admissions: 2, discharges: 0 },
    { hour: "6 PM", admissions: 1, discharges: 0 },
    { hour: "8 PM", admissions: 1, discharges: 0 },
  ];
}

const RANGE_MULTIPLIER: Record<DateRangeKey, number> = {
  today: 1,
  yesterday: 0.94,
  thisWeek: 6.4,
  lastWeek: 6.1,
  lastMonth: 27.2,
  last6Months: 162,
  custom: 1,
};

const RANGE_CHANGE: Record<DateRangeKey, number> = {
  today: 6.8,
  yesterday: -4.1,
  thisWeek: 10.5,
  lastWeek: 4.2,
  lastMonth: 13.6,
  last6Months: 19.8,
  custom: 0,
};

export function getIPDDashboardData(range: DateRangeKey): IPDDashboardData {
  const multiplier = RANGE_MULTIPLIER[range];
  const change = RANGE_CHANGE[range];

  const bedCharges = Math.round(148000 * multiplier);
  const doctorFees = Math.round(96500 * multiplier);
  const pharmacy = Math.round(73400 * multiplier);
  const labPathology = Math.round(48200 * multiplier);
  const labRadiology = Math.round(58500 * multiplier);
  const procedureCharges = Math.round(42000 * multiplier);
  const otCharges = Math.round(65000 * multiplier);
  const total = bedCharges + doctorFees + pharmacy + labPathology + labRadiology + procedureCharges + otCharges;
  const totalCollected = Math.round(total * 0.79);
  const totalPending = total - totalCollected;

  const daysMap: Record<DateRangeKey, number> = {
    today: 1, yesterday: 1, thisWeek: 7, lastWeek: 7, lastMonth: 12, last6Months: 12, custom: 7,
  };

  return {
    revenue: {
      bedCharges,
      doctorFees,
      pharmacy,
      labPathology,
      labRadiology,
      procedureCharges,
      otCharges,
      total,
      totalCollected,
      totalPending,
      changeVsPrevious: change,
    },
    paymentSources: getPaymentSources(),
    movementStats: {
      totalActiveAdmissions: Math.round(47 * multiplier),
      newRegistrationsToday: Math.round(8 * multiplier),
      dischargedToday: Math.round(6 * multiplier),
      shiftedToOT: Math.round(3 * multiplier),
      shiftedToICU: Math.round(4 * multiplier),
      shiftedFromICU: Math.round(2 * multiplier),
      cancelledAdmissions: Math.round(2 * multiplier),
      transferredFromOPD: Math.round(3 * multiplier),
      changeVsPrevious: {
        newRegistrations: 12.5,
        discharged: 8.3,
        shiftedToOT: -5.2,
        shiftedToICU: 20.1,
        cancelled: -15.0,
      },
    },
    doctorWorkload: getDoctorWorkload(),
    nurseAssignments: getNurseAssignments(),
    medicineSales: getMedicineSales(),
    labTests: getLabTests(),
    cancelledAdmissions: getCancelledAdmissions(),
    wardOccupancy: getWardOccupancy(),
    dailyTrends: getDailyTrends(daysMap[range]),
    hourlyTrends: getHourlyTrends(),
  };
}