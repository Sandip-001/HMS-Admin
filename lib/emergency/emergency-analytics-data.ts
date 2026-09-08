// lib/emergency/emergency-analytics-data.ts
import type {
  DateRangeKey,
  DateRangeOption,
  EmergencyDashboardData,
  DoctorEmergencyWorkload,
  NursePatientAssignment,
  EmergencyMedicineSalesData,
  EmergencyLabTestData,
  DischargedPatientRecord,
  TransferRecord,
  MortalityRecord,
  PendingPaymentRecord,
  EmergencyBayOccupancy,
  BedDetail,
  DailyEmergencyTrendPoint,
  HourlyEmergencyTrend,
  PaymentSourceBreakdown,
} from "@/types/emergency/emergency-analytics-types";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisWeek", label: "This Week" },
  { key: "lastWeek", label: "Last Week" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last6Months", label: "Last 6 Months" },
  { key: "custom", label: "Custom Range" },
];

export const EMERGENCY_DEPARTMENTS = [
  "All Departments",
  "Emergency Medicine",
  "Trauma Surgery",
  "Cardiology",
  "Neurology",
  "General Medicine",
  "Orthopedics",
];

export const EMERGENCY_BAYS = ["All Bays", "ER-Bay-1 (Trauma)", "ER-Bay-2", "ER-Bay-3", "ER-Bay-4", "Resuscitation Bay"];

const DOCTORS_BASE: Omit<DoctorEmergencyWorkload, "id">[] = [
  { name: "Dr. Rahul Mehta", department: "Trauma Surgery", avatarInitial: "RM", totalPatients: 9, criticalPatients: 5, stablePatients: 4, dischargedToday: 3, deceasedCount: 1, revenueGenerated: 218000, avgTreatmentTimeMins: 85, status: "High Load" },
  { name: "Dr. Priya Nair", department: "Emergency Medicine", avatarInitial: "PN", totalPatients: 11, criticalPatients: 3, stablePatients: 8, dischargedToday: 6, deceasedCount: 0, revenueGenerated: 156000, avgTreatmentTimeMins: 52, status: "High Load" },
  { name: "Dr. Amit Verma", department: "Cardiology", avatarInitial: "AV", totalPatients: 5, criticalPatients: 3, stablePatients: 2, dischargedToday: 1, deceasedCount: 0, revenueGenerated: 128000, avgTreatmentTimeMins: 68, status: "Balanced" },
  { name: "Dr. Arjun Kapoor", department: "Neurology", avatarInitial: "AK", totalPatients: 4, criticalPatients: 2, stablePatients: 2, dischargedToday: 1, deceasedCount: 0, revenueGenerated: 96000, avgTreatmentTimeMins: 74, status: "Balanced" },
  { name: "Dr. Neha Gupta", department: "General Medicine", avatarInitial: "NG", totalPatients: 3, criticalPatients: 0, stablePatients: 3, dischargedToday: 2, deceasedCount: 0, revenueGenerated: 42000, avgTreatmentTimeMins: 38, status: "Low Load" },
  { name: "Dr. Sunita Rao", department: "Orthopedics", avatarInitial: "SR", totalPatients: 2, criticalPatients: 0, stablePatients: 2, dischargedToday: 1, deceasedCount: 0, revenueGenerated: 34000, avgTreatmentTimeMins: 45, status: "Low Load" },
];

export function getDoctorWorkload(): DoctorEmergencyWorkload[] {
  return DOCTORS_BASE.map((doc, idx) => ({ id: `ERDOC${String(idx + 1).padStart(3, "0")}`, ...doc }));
}

const NURSE_BASE: Omit<NursePatientAssignment, "id">[] = [
  { nurseName: "Sr. Kavita Sharma", nurseInitial: "KS", shift: "Morning", bay: "ER-Bay-1 (Trauma)", patientName: "Unknown Male (RTA)", patientUhid: "UHID12398211", bed: "ER-Bay-1", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Rohit Ghosh", nurseInitial: "RG", shift: "Evening", bay: "ER-Bay-1 (Trauma)", patientName: "Unknown Male (RTA)", patientUhid: "UHID12398211", bed: "ER-Bay-1", assignedAt: "02:00 PM", status: "On Duty" },
  { nurseName: "Ananya Iyer", nurseInitial: "AI", shift: "Night", bay: "ER-Bay-2", patientName: "Ravi Sharma", patientUhid: "UHID12345685", bed: "ER-Bay-2", assignedAt: "10:00 PM", status: "Handover Pending" },
  { nurseName: "Deepak Nair", nurseInitial: "DN", shift: "Morning", bay: "ER-Bay-2", patientName: "Ravi Sharma", patientUhid: "UHID12345685", bed: "ER-Bay-2", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Sunita Menon", nurseInitial: "SM", shift: "Evening", bay: "ER-Bay-4", patientName: "Meera Joshi", patientUhid: "UHID12345750", bed: "ER-Bay-4", assignedAt: "02:00 PM", status: "On Duty" },
  { nurseName: "Pooja Reddy", nurseInitial: "PR", shift: "Night", bay: "ER-Bay-3", patientName: "Sanjay Malhotra", patientUhid: "UHID12398225", bed: "ER-Bay-3", assignedAt: "10:00 PM", status: "On Duty" },
  { nurseName: "Deepak Nair", nurseInitial: "DN", shift: "Morning", bay: "ER-Bay-3", patientName: "Sanjay Malhotra", patientUhid: "UHID12398225", bed: "ER-Bay-3", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Ritu Bhatia", nurseInitial: "RB", shift: "Morning", bay: "Resuscitation Bay", patientName: "Harish Chandra", patientUhid: "UHID12398240", bed: "Resus-01", assignedAt: "06:00 AM", status: "Completed" },
  { nurseName: "Ritu Bhatia", nurseInitial: "RB", shift: "Evening", bay: "Resuscitation Bay", patientName: "Harish Chandra", patientUhid: "UHID12398240", bed: "Resus-01", assignedAt: "02:00 PM", status: "On Duty" },
];

export function getNurseAssignments(): NursePatientAssignment[] {
  return NURSE_BASE.map((n, idx) => ({ id: `ERNUR${String(idx + 1).padStart(3, "0")}`, ...n }));
}

const MEDICINE_BASE: Omit<EmergencyMedicineSalesData, "id">[] = [
  { medicineName: "Inj. Adrenaline", category: "Emergency Drug", unitsSold: 62, revenue: 18600, trend: "up", trendPercentage: 26 },
  { medicineName: "Inj. Tranexamic Acid", category: "Hemostatic", unitsSold: 48, revenue: 14400, trend: "up", trendPercentage: 20 },
  { medicineName: "IV Fluids (NS/RL) 500ml", category: "Fluids", unitsSold: 285, revenue: 14250, trend: "up", trendPercentage: 18 },
  { medicineName: "Inj. Tramadol 50mg", category: "Analgesic", unitsSold: 156, revenue: 7800, trend: "up", trendPercentage: 15 },
  { medicineName: "Inj. Piperacillin-Tazobactam 4.5g", category: "Antibiotic", unitsSold: 92, revenue: 29440, trend: "up", trendPercentage: 12 },
  { medicineName: "Inj. Midazolam", category: "Sedative", unitsSold: 74, revenue: 11100, trend: "stable", trendPercentage: 2 },
  { medicineName: "Tab. Paracetamol 650mg", category: "Analgesic", unitsSold: 210, revenue: 4200, trend: "stable", trendPercentage: 1 },
  { medicineName: "Inj. Pantoprazole 40mg", category: "Antacid", unitsSold: 68, revenue: 2040, trend: "stable", trendPercentage: 3 },
  { medicineName: "Inj. Naloxone", category: "Antidote", unitsSold: 18, revenue: 5400, trend: "down", trendPercentage: 10 },
  { medicineName: "Inj. Atropine", category: "Emergency Drug", unitsSold: 22, revenue: 4400, trend: "down", trendPercentage: 8 },
  { medicineName: "Tab. Ondansetron 4mg", category: "Antiemetic", unitsSold: 95, revenue: 1900, trend: "down", trendPercentage: 6 },
  { medicineName: "Inj. Hydrocortisone", category: "Steroid", unitsSold: 30, revenue: 3600, trend: "down", trendPercentage: 9 },
];

export function getMedicineSales(): EmergencyMedicineSalesData[] {
  return MEDICINE_BASE.map((m, idx) => ({ id: `ERMED${String(idx + 1).padStart(3, "0")}`, ...m })).sort((a, b) => b.unitsSold - a.unitsSold);
}

const LAB_TEST_BASE: Omit<EmergencyLabTestData, "id">[] = [
  { testName: "Blood Grouping & Cross-Matching", labType: "Pathology", totalOrdered: 88, revenue: 44000, avgTurnaroundTime: "1 hr", trend: "up", trendPercentage: 20 },
  { testName: "Complete Blood Count (CBC)", labType: "Pathology", totalOrdered: 245, revenue: 85750, avgTurnaroundTime: "2 hrs", trend: "up", trendPercentage: 16 },
  { testName: "Troponin I (Stat)", labType: "Pathology", totalOrdered: 62, revenue: 52700, avgTurnaroundTime: "1 hr", trend: "up", trendPercentage: 22 },
  { testName: "Coagulation Profile (PT/INR)", labType: "Pathology", totalOrdered: 58, revenue: 34800, avgTurnaroundTime: "3 hrs", trend: "up", trendPercentage: 11 },
  { testName: "Toxicology Screen", labType: "Pathology", totalOrdered: 34, revenue: 30600, avgTurnaroundTime: "4 hrs", trend: "up", trendPercentage: 14 },
  { testName: "Electrolytes Panel (Na/K/Cl)", labType: "Pathology", totalOrdered: 142, revenue: 63900, avgTurnaroundTime: "2 hrs", trend: "stable", trendPercentage: 2 },
  { testName: "Chest X-Ray Portable", labType: "Radiology", totalOrdered: 195, revenue: 107250, avgTurnaroundTime: "30 mins", trend: "up", trendPercentage: 15 },
  { testName: "FAST Abdomen Scan (Trauma)", labType: "Radiology", totalOrdered: 45, revenue: 63000, avgTurnaroundTime: "20 mins", trend: "up", trendPercentage: 24 },
  { testName: "CT Brain Plain (Emergency)", labType: "Radiology", totalOrdered: 38, revenue: 133000, avgTurnaroundTime: "45 mins", trend: "up", trendPercentage: 17 },
  { testName: "X-Ray Limb (AP/Lateral)", labType: "Radiology", totalOrdered: 88, revenue: 57200, avgTurnaroundTime: "25 mins", trend: "stable", trendPercentage: 3 },
  { testName: "Ultrasound Abdomen", labType: "Radiology", totalOrdered: 26, revenue: 36400, avgTurnaroundTime: "40 mins", trend: "down", trendPercentage: 5 },
  { testName: "CT Cervical Spine", labType: "Radiology", totalOrdered: 14, revenue: 56000, avgTurnaroundTime: "1 hr", trend: "down", trendPercentage: 7 },
];

export function getLabTests(): EmergencyLabTestData[] {
  return LAB_TEST_BASE.map((t, idx) => ({ id: `ERLAB${String(idx + 1).padStart(3, "0")}`, ...t })).sort((a, b) => b.totalOrdered - a.totalOrdered);
}

const DISCHARGED_BASE: Omit<DischargedPatientRecord, "id">[] = [
  { patientName: "Anjali Deshmukh", uhid: "UHID12398250", bed: "ER-Bay-3", arrivedOn: "30 Aug 2026, 08:15 AM", dischargedOn: "30 Aug 2026, 11:40 AM", doctor: "Dr. Priya Nair", totalStayHours: 3.5, finalBillAmount: 8500 },
  { patientName: "Manoj Bhatt", uhid: "UHID12398251", bed: "ER-Bay-2", arrivedOn: "30 Aug 2026, 09:30 AM", dischargedOn: "30 Aug 2026, 01:15 PM", doctor: "Dr. Neha Gupta", totalStayHours: 3.75, finalBillAmount: 6200 },
  { patientName: "Farhan Sheikh", uhid: "UHID12398252", bed: "ER-Bay-4", arrivedOn: "29 Aug 2026, 07:00 PM", dischargedOn: "29 Aug 2026, 11:20 PM", doctor: "Dr. Sunita Rao", totalStayHours: 4.3, finalBillAmount: 12400 },
  { patientName: "Geetha Nambiar", uhid: "UHID12398253", bed: "ER-Bay-1 (Trauma)", arrivedOn: "29 Aug 2026, 02:10 PM", dischargedOn: "29 Aug 2026, 06:45 PM", doctor: "Dr. Rahul Mehta", totalStayHours: 4.6, finalBillAmount: 18900 },
];

export function getDischargedPatients(): DischargedPatientRecord[] {
  return DISCHARGED_BASE.map((d, idx) => ({ id: `ERDIS${String(idx + 1).padStart(3, "0")}`, ...d }));
}

const TRANSFER_BASE: Omit<TransferRecord, "id">[] = [
  { patientName: "Ravi Sharma", uhid: "UHID12345685", fromBed: "ER-Bay-2", destination: "ICU", toWard: "ICU-A", toBed: "ICU-A-01", transferredAt: "27 Aug 2026, 09:35 AM", doctor: "Dr. Amit Verma", reason: "Acute MI confirmed, requires critical monitoring post-PCI" },
  { patientName: "Unknown Male (RTA)", uhid: "UHID12398211", fromBed: "ER-Bay-1", destination: "OT", toWard: "Operation Theatre", toBed: "OT-02", transferredAt: "27 Aug 2026, 09:10 AM", doctor: "Dr. Rahul Mehta", reason: "Emergency splenectomy required for internal bleeding" },
  { patientName: "Meera Joshi", uhid: "UHID12345750", fromBed: "ER-Bay-4", destination: "ICU", toWard: "ICU-A", toBed: "ICU-A-02", transferredAt: "27 Aug 2026, 10:50 AM", doctor: "Dr. Priya Nair", reason: "Drug overdose, requires close monitoring for toxicity" },
  { patientName: "Vinod Kulkarni", uhid: "UHID12398254", fromBed: "ER-Bay-3", destination: "IPD", toWard: "General Ward", toBed: "GW-005-A", transferredAt: "29 Aug 2026, 04:20 PM", doctor: "Dr. Neha Gupta", reason: "Stable, admitted for observation of fracture management" },
];

export function getTransferRecords(): TransferRecord[] {
  return TRANSFER_BASE.map((t, idx) => ({ id: `ERTRF${String(idx + 1).padStart(3, "0")}`, ...t }));
}

const MORTALITY_BASE: Omit<MortalityRecord, "id">[] = [
  { patientName: "Unidentified Male", uhid: "UHID12398260", age: 55, gender: "Male", bed: "Resus-01", arrivedOn: "28 Aug 2026, 02:10 AM", timeOfDeath: "28 Aug 2026, 02:14 AM", doctor: "Dr. Rahul Mehta", causeOfDeath: "Brought dead - cardiac arrest, resuscitation unsuccessful", certifiedBy: "Dr. Rahul Mehta", broughtDead: true },
  { patientName: "Harish Chandra", uhid: "UHID12398240", age: 68, gender: "Male", bed: "Resus-01", arrivedOn: "29 Aug 2026, 08:30 PM", timeOfDeath: "30 Aug 2026, 01:45 AM", doctor: "Dr. Priya Nair", causeOfDeath: "Massive myocardial infarction, cardiogenic shock", certifiedBy: "Dr. Priya Nair", broughtDead: false },
];

export function getMortalityRecords(): MortalityRecord[] {
  return MORTALITY_BASE.map((m, idx) => ({ id: `ERMOR${String(idx + 1).padStart(3, "0")}`, ...m }));
}

const PENDING_PAYMENT_BASE: Omit<PendingPaymentRecord, "id">[] = [
  { patientName: "Ravi Sharma", uhid: "UHID12345685", bed: "ER-Bay-2", doctor: "Dr. Amit Verma", totalBill: 28500, amountCollected: 10000, amountPending: 18500, hoursAdmitted: 6, lastPaymentDate: "27 Aug 2026" },
  { patientName: "Unknown Male (RTA)", uhid: "UHID12398211", bed: "ER-Bay-1", doctor: "Dr. Rahul Mehta", totalBill: 45200, amountCollected: 0, amountPending: 45200, hoursAdmitted: 5, lastPaymentDate: "N/A" },
  { patientName: "Meera Joshi", uhid: "UHID12345750", bed: "ER-Bay-4", doctor: "Dr. Priya Nair", totalBill: 12800, amountCollected: 12800, amountPending: 0, hoursAdmitted: 4, lastPaymentDate: "27 Aug 2026" },
  { patientName: "Sanjay Malhotra", uhid: "UHID12398225", bed: "ER-Bay-3", doctor: "Dr. Neha Gupta", totalBill: 15600, amountCollected: 6000, amountPending: 9600, hoursAdmitted: 3, lastPaymentDate: "30 Aug 2026" },
];

export function getPendingPayments(): PendingPaymentRecord[] {
  return PENDING_PAYMENT_BASE.filter((p) => p.amountPending > 0).map((p, idx) => ({ id: `ERPEND${String(idx + 1).padStart(3, "0")}`, ...p }));
}

const BAY_COLORS: Record<string, string> = {
  "ER-Bay-1 (Trauma)": "#ef4444",
  "ER-Bay-2": "#f97316",
  "ER-Bay-3": "#8b5cf6",
  "ER-Bay-4": "#3b82f6",
  "Resuscitation Bay": "#dc2626",
};

export function getBayOccupancy(): EmergencyBayOccupancy[] {
  return [
    { bay: "ER-Bay-1 (Trauma)", totalBeds: 6, occupied: 5, available: 1, maintenance: 0, color: BAY_COLORS["ER-Bay-1 (Trauma)"] },
    { bay: "ER-Bay-2", totalBeds: 8, occupied: 6, available: 2, maintenance: 0, color: BAY_COLORS["ER-Bay-2"] },
    { bay: "ER-Bay-3", totalBeds: 8, occupied: 5, available: 2, maintenance: 1, color: BAY_COLORS["ER-Bay-3"] },
    { bay: "ER-Bay-4", totalBeds: 6, occupied: 4, available: 2, maintenance: 0, color: BAY_COLORS["ER-Bay-4"] },
    { bay: "Resuscitation Bay", totalBeds: 2, occupied: 1, available: 1, maintenance: 0, color: BAY_COLORS["Resuscitation Bay"] },
  ];
}

export function getBedDetails(): BedDetail[] {
  return [
    { bedId: "ER-Bay-1-A", bay: "ER-Bay-1 (Trauma)", status: "Occupied", patientName: "Vinod Kulkarni", uhid: "UHID12398254", arrivedOn: "30 Aug 2026, 07:20 AM", triageLevel: "Urgent" },
    { bedId: "ER-Bay-1-B", bay: "ER-Bay-1 (Trauma)", status: "Occupied", patientName: "Farida Khan", uhid: "UHID12398243", arrivedOn: "30 Aug 2026, 09:10 AM", triageLevel: "Critical" },
    { bedId: "ER-Bay-1-C", bay: "ER-Bay-1 (Trauma)", status: "Available" },
    { bedId: "ER-Bay-1-D", bay: "ER-Bay-1 (Trauma)", status: "Occupied", patientName: "Irfan Ali", uhid: "UHID12398244", arrivedOn: "30 Aug 2026, 10:30 AM", triageLevel: "Urgent" },
    { bedId: "ER-Bay-1-E", bay: "ER-Bay-1 (Trauma)", status: "Occupied", patientName: "Geeta Kapoor", uhid: "UHID12398245", arrivedOn: "30 Aug 2026, 11:00 AM", triageLevel: "Critical" },
    { bedId: "ER-Bay-1-F", bay: "ER-Bay-1 (Trauma)", status: "Occupied", patientName: "Nitin Joshi", uhid: "UHID12398246", arrivedOn: "30 Aug 2026, 11:45 AM", triageLevel: "Standard" },
    { bedId: "ER-Bay-2-A", bay: "ER-Bay-2", status: "Occupied", patientName: "Ashok Verma", uhid: "UHID12398247", arrivedOn: "30 Aug 2026, 08:00 AM", triageLevel: "Urgent" },
    { bedId: "ER-Bay-2-B", bay: "ER-Bay-2", status: "Occupied", patientName: "Padma Reddy", uhid: "UHID12398248", arrivedOn: "30 Aug 2026, 09:30 AM", triageLevel: "Standard" },
    { bedId: "ER-Bay-2-C", bay: "ER-Bay-2", status: "Available" },
    { bedId: "ER-Bay-2-D", bay: "ER-Bay-2", status: "Occupied", patientName: "Suresh Yadav", uhid: "UHID12398230", arrivedOn: "30 Aug 2026, 10:15 AM", triageLevel: "Urgent" },
    { bedId: "ER-Bay-2-E", bay: "ER-Bay-2", status: "Occupied", patientName: "Anita Rao", uhid: "UHID12398231", arrivedOn: "30 Aug 2026, 10:50 AM", triageLevel: "Standard" },
    { bedId: "ER-Bay-2-F", bay: "ER-Bay-2", status: "Available" },
    { bedId: "ER-Bay-2-G", bay: "ER-Bay-2", status: "Occupied", patientName: "Ramesh Gupta", uhid: "UHID12398232", arrivedOn: "30 Aug 2026, 11:20 AM", triageLevel: "Critical" },
    { bedId: "ER-Bay-2-H", bay: "ER-Bay-2", status: "Occupied", patientName: "Lakshmi Pillai", uhid: "UHID12398233", arrivedOn: "30 Aug 2026, 12:00 PM", triageLevel: "Standard" },
    { bedId: "ER-Bay-3-A", bay: "ER-Bay-3", status: "Occupied", patientName: "Sanjay Malhotra", uhid: "UHID12398225", arrivedOn: "30 Aug 2026, 09:00 AM", triageLevel: "Urgent" },
    { bedId: "ER-Bay-3-B", bay: "ER-Bay-3", status: "Occupied", patientName: "Kavita Desai", uhid: "UHID12398226", arrivedOn: "30 Aug 2026, 09:40 AM", triageLevel: "Standard" },
    { bedId: "ER-Bay-3-C", bay: "ER-Bay-3", status: "Available" },
    { bedId: "ER-Bay-3-D", bay: "ER-Bay-3", status: "Maintenance", maintenanceReason: "Monitor equipment replacement" },
    { bedId: "ER-Bay-3-E", bay: "ER-Bay-3", status: "Occupied", patientName: "Manoj Tiwari", uhid: "UHID12398227", arrivedOn: "30 Aug 2026, 11:10 AM", triageLevel: "Urgent" },
    { bedId: "ER-Bay-3-F", bay: "ER-Bay-3", status: "Occupied", patientName: "Sunita Verma", uhid: "UHID12398236", arrivedOn: "30 Aug 2026, 11:50 AM", triageLevel: "Standard" },
    { bedId: "ER-Bay-3-G", bay: "ER-Bay-3", status: "Available" },
    { bedId: "ER-Bay-3-H", bay: "ER-Bay-3", status: "Occupied", patientName: "Rajesh Kumar", uhid: "UHID12398235", arrivedOn: "30 Aug 2026, 12:20 PM", triageLevel: "Critical" },
    { bedId: "ER-Bay-4-A", bay: "ER-Bay-4", status: "Occupied", patientName: "Meera Joshi", uhid: "UHID12345750", arrivedOn: "27 Aug 2026, 10:45 AM", triageLevel: "Urgent" },
    { bedId: "ER-Bay-4-B", bay: "ER-Bay-4", status: "Occupied", patientName: "Deepa Nair", uhid: "UHID12398241", arrivedOn: "30 Aug 2026, 10:00 AM", triageLevel: "Standard" },
    { bedId: "ER-Bay-4-C", bay: "ER-Bay-4", status: "Available" },
    { bedId: "ER-Bay-4-D", bay: "ER-Bay-4", status: "Occupied", patientName: "Vinod Shetty", uhid: "UHID12398242", arrivedOn: "30 Aug 2026, 11:30 AM", triageLevel: "Standard" },
    { bedId: "ER-Bay-4-E", bay: "ER-Bay-4", status: "Available" },
    { bedId: "ER-Bay-4-F", bay: "ER-Bay-4", status: "Occupied", patientName: "Rekha Iyer", uhid: "UHID12398223", arrivedOn: "30 Aug 2026, 12:05 PM", triageLevel: "Urgent" },
    { bedId: "Resus-01", bay: "Resuscitation Bay", status: "Occupied", patientName: "Farhan Sheikh", uhid: "UHID12398252", arrivedOn: "30 Aug 2026, 12:30 PM", triageLevel: "Critical" },
    { bedId: "Resus-02", bay: "Resuscitation Bay", status: "Available" },
  ];
}

export function getPaymentSources(): PaymentSourceBreakdown[] {
  return [
    { source: "Self Pay", amount: 312000, patients: 22, percentage: 44, color: "#3b82f6" },
    { source: "Health Insurance", amount: 198000, patients: 12, percentage: 28, color: "#8b5cf6" },
    { source: "TPA", amount: 128000, patients: 8, percentage: 18, color: "#f59e0b" },
    { source: "Ayushman Bharat", amount: 71000, patients: 5, percentage: 10, color: "#10b981" },
  ];
}

export function getDailyTrends(days: number): DailyEmergencyTrendPoint[] {
  const base: DailyEmergencyTrendPoint[] = [
    { date: "25 Aug", revenue: 285000, arrivals: 28, discharges: 18, deaths: 0, collected: 198000, pending: 87000 },
    { date: "26 Aug", revenue: 312000, arrivals: 32, discharges: 22, deaths: 1, collected: 224000, pending: 88000 },
    { date: "27 Aug", revenue: 298000, arrivals: 30, discharges: 19, deaths: 0, collected: 212000, pending: 86000 },
    { date: "28 Aug", revenue: 342000, arrivals: 35, discharges: 24, deaths: 1, collected: 248000, pending: 94000 },
    { date: "29 Aug", revenue: 325000, arrivals: 31, discharges: 21, deaths: 0, collected: 236000, pending: 89000 },
    { date: "30 Aug", revenue: 356000, arrivals: 34, discharges: 25, deaths: 0, collected: 258000, pending: 98000 },
    { date: "31 Aug", revenue: 318000, arrivals: 29, discharges: 20, deaths: 0, collected: 230000, pending: 88000 },
    { date: "1 Sep", revenue: 305000, arrivals: 28, discharges: 19, deaths: 1, collected: 220000, pending: 85000 },
    { date: "2 Sep", revenue: 338000, arrivals: 33, discharges: 23, deaths: 0, collected: 244000, pending: 94000 },
    { date: "3 Sep", revenue: 349000, arrivals: 32, discharges: 22, deaths: 0, collected: 253000, pending: 96000 },
    { date: "4 Sep", revenue: 328000, arrivals: 30, discharges: 21, deaths: 0, collected: 238000, pending: 90000 },
    { date: "5 Sep", revenue: 178000, arrivals: 16, discharges: 11, deaths: 0, collected: 128000, pending: 50000 },
  ];
  return base.slice(-days);
}

export function getHourlyTrends(): HourlyEmergencyTrend[] {
  return [
    { hour: "6 AM", arrivals: 2, discharges: 1 },
    { hour: "8 AM", arrivals: 4, discharges: 2 },
    { hour: "10 AM", arrivals: 6, discharges: 4 },
    { hour: "12 PM", arrivals: 5, discharges: 5 },
    { hour: "2 PM", arrivals: 3, discharges: 3 },
    { hour: "4 PM", arrivals: 4, discharges: 2 },
    { hour: "6 PM", arrivals: 5, discharges: 3 },
    { hour: "8 PM", arrivals: 3, discharges: 2 },
  ];
}

const RANGE_MULTIPLIER: Record<DateRangeKey, number> = {
  today: 1,
  yesterday: 0.96,
  thisWeek: 6.4,
  lastWeek: 6.1,
  lastMonth: 27.0,
  last6Months: 161,
  custom: 1,
};

const RANGE_CHANGE: Record<DateRangeKey, number> = {
  today: 9.1,
  yesterday: -4.5,
  thisWeek: 12.8,
  lastWeek: 6.0,
  lastMonth: 15.2,
  last6Months: 20.4,
  custom: 0,
};

export function getEmergencyDashboardData(range: DateRangeKey): EmergencyDashboardData {
  const multiplier = RANGE_MULTIPLIER[range];
  const change = RANGE_CHANGE[range];

  const bedFees = Math.round(96500 * multiplier);
  const doctorFees = Math.round(148000 * multiplier);
  const procedureCharges = Math.round(85000 * multiplier);
  const pharmacy = Math.round(62400 * multiplier);
  const labPathology = Math.round(58600 * multiplier);
  const labRadiology = Math.round(74200 * multiplier);
  const ambulanceFees = Math.round(32000 * multiplier);
  const total = bedFees + doctorFees + procedureCharges + pharmacy + labPathology + labRadiology + ambulanceFees;
  const totalCollected = Math.round(total * 0.72);
  const totalPending = total - totalCollected;

  const daysMap: Record<DateRangeKey, number> = {
    today: 1, yesterday: 1, thisWeek: 7, lastWeek: 7, lastMonth: 12, last6Months: 12, custom: 7,
  };

  return {
    revenue: {
      bedFees,
      doctorFees,
      procedureCharges,
      pharmacy,
      labPathology,
      labRadiology,
      ambulanceFees,
      total,
      totalCollected,
      totalPending,
      changeVsPrevious: change,
    },
    paymentSources: getPaymentSources(),
    bedOccupancy: {
      totalBeds: 30,
      occupied: 21,
      available: 8,
      maintenance: 1,
      changeVsPrevious: { occupied: 6.5 },
    },
    patientFlow: {
      dischargedToday: Math.round(9 * multiplier),
      shiftedToIPD: Math.round(4 * multiplier),
      shiftedToICU: Math.round(2 * multiplier),
      shiftedToOT: Math.round(1 * multiplier),
      deceasedToday: Math.round(1 * multiplier),
      newArrivalsToday: Math.round(17 * multiplier),
      changeVsPrevious: {
        discharged: 11.2,
        shiftedToIPD: 8.4,
        shiftedToICU: 14.6,
        shiftedToOT: -6.0,
        deceased: -18.0,
        newArrivals: 9.8,
      },
    },
    doctorWorkload: getDoctorWorkload(),
    nurseAssignments: getNurseAssignments(),
    medicineSales: getMedicineSales(),
    labTests: getLabTests(),
    dischargedPatients: getDischargedPatients(),
    transferRecords: getTransferRecords(),
    mortalityRecords: getMortalityRecords(),
    pendingPayments: getPendingPayments(),
    bayOccupancy: getBayOccupancy(),
    bedDetails: getBedDetails(),
    dailyTrends: getDailyTrends(daysMap[range]),
    hourlyTrends: getHourlyTrends(),
  };
}