// lib/super-admin/opd/opd-analytics-data.ts
import type {
  DateRangeKey,
  DateRangeOption,
  OPDDashboardData,
  DoctorPerformance,
  MedicineSalesData,
  LabTestData,
  DepartmentWiseRevenue,
  HourlyTrend,
  DailyTrendPoint,
  PaymentModeBreakdown,
} from "@/types/opd/opd-analytics-types";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisWeek", label: "This Week" },
  { key: "lastWeek", label: "Last Week" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last6Months", label: "Last 6 Months" },
  { key: "custom", label: "Custom Range" },
];

export const OPD_DEPARTMENTS = [
  "All Departments",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Gastroenterology",
  "Dermatology",
  "Pediatrics",
  "General Medicine",
  "ENT",
  "Gynecology",
];

const DOCTORS_BASE: Omit<DoctorPerformance, "id">[] = [
  { name: "Dr. Amit Verma", department: "Cardiology", avatarInitial: "AV", totalConsultations: 42, completedConsultations: 38, cancelledConsultations: 2, rescheduledConsultations: 2, followUpConsultations: 15, newConsultations: 27, revenueGenerated: 63000, avgConsultationTimeMins: 22, patientSatisfactionPct: 96, status: "Top Performer" },
  { name: "Dr. Priya Nair", department: "Neurology", avatarInitial: "PN", totalConsultations: 35, completedConsultations: 32, cancelledConsultations: 1, rescheduledConsultations: 2, followUpConsultations: 12, newConsultations: 23, revenueGenerated: 42000, avgConsultationTimeMins: 25, patientSatisfactionPct: 93, status: "Top Performer" },
  { name: "Dr. Sunita Rao", department: "Orthopedics", avatarInitial: "SR", totalConsultations: 30, completedConsultations: 26, cancelledConsultations: 2, rescheduledConsultations: 2, followUpConsultations: 10, newConsultations: 20, revenueGenerated: 30000, avgConsultationTimeMins: 18, patientSatisfactionPct: 89, status: "Average" },
  { name: "Dr. Vikram Singh", department: "Gastroenterology", avatarInitial: "VS", totalConsultations: 18, completedConsultations: 13, cancelledConsultations: 3, rescheduledConsultations: 2, followUpConsultations: 6, newConsultations: 12, revenueGenerated: 25200, avgConsultationTimeMins: 20, patientSatisfactionPct: 78, status: "Needs Attention" },
  { name: "Dr. Kavita Menon", department: "Dermatology", avatarInitial: "KM", totalConsultations: 27, completedConsultations: 25, cancelledConsultations: 1, rescheduledConsultations: 1, followUpConsultations: 9, newConsultations: 18, revenueGenerated: 21600, avgConsultationTimeMins: 15, patientSatisfactionPct: 91, status: "Average" },
  { name: "Dr. Arjun Kapoor", department: "Pediatrics", avatarInitial: "AK", totalConsultations: 33, completedConsultations: 30, cancelledConsultations: 1, rescheduledConsultations: 2, followUpConsultations: 11, newConsultations: 22, revenueGenerated: 24000, avgConsultationTimeMins: 17, patientSatisfactionPct: 95, status: "Top Performer" },
  { name: "Dr. Neha Gupta", department: "General Medicine", avatarInitial: "NG", totalConsultations: 45, completedConsultations: 40, cancelledConsultations: 3, rescheduledConsultations: 2, followUpConsultations: 16, newConsultations: 29, revenueGenerated: 36000, avgConsultationTimeMins: 14, patientSatisfactionPct: 88, status: "Average" },
  { name: "Dr. Rohan Das", department: "ENT", avatarInitial: "RD", totalConsultations: 15, completedConsultations: 10, cancelledConsultations: 3, rescheduledConsultations: 2, followUpConsultations: 4, newConsultations: 11, revenueGenerated: 15000, avgConsultationTimeMins: 16, patientSatisfactionPct: 74, status: "Needs Attention" },
  { name: "Dr. Ananya Iyer", department: "Gynecology", avatarInitial: "AI", totalConsultations: 24, completedConsultations: 22, cancelledConsultations: 1, rescheduledConsultations: 1, followUpConsultations: 8, newConsultations: 16, revenueGenerated: 26400, avgConsultationTimeMins: 21, patientSatisfactionPct: 92, status: "Average" },
];

export function getDoctorPerformance(): DoctorPerformance[] {
  return DOCTORS_BASE.map((doc, idx) => ({ id: `DOC${String(idx + 1).padStart(3, "0")}`, ...doc }));
}

const MEDICINE_BASE: Omit<MedicineSalesData, "id">[] = [
  { medicineName: "Paracetamol 500mg", category: "Analgesic", unitsSold: 1240, revenue: 24800, trend: "up", trendPercentage: 18 },
  { medicineName: "Amoxicillin 500mg", category: "Antibiotic", unitsSold: 860, revenue: 34400, trend: "up", trendPercentage: 12 },
  { medicineName: "Cetirizine 10mg", category: "Antihistamine", unitsSold: 720, revenue: 7200, trend: "up", trendPercentage: 9 },
  { medicineName: "Metformin 500mg", category: "Antidiabetic", unitsSold: 690, revenue: 20700, trend: "stable", trendPercentage: 2 },
  { medicineName: "Omeprazole 20mg", category: "Antacid", unitsSold: 615, revenue: 18450, trend: "up", trendPercentage: 15 },
  { medicineName: "Atorvastatin 10mg", category: "Statin", unitsSold: 540, revenue: 27000, trend: "down", trendPercentage: 6 },
  { medicineName: "Azithromycin 500mg", category: "Antibiotic", unitsSold: 410, revenue: 24600, trend: "up", trendPercentage: 11 },
  { medicineName: "Pantoprazole 40mg", category: "Antacid", unitsSold: 380, revenue: 15200, trend: "stable", trendPercentage: 1 },
  { medicineName: "Losartan 50mg", category: "Antihypertensive", unitsSold: 305, revenue: 18300, trend: "down", trendPercentage: 4 },
  { medicineName: "Vitamin D3 60K", category: "Supplement", unitsSold: 260, revenue: 13000, trend: "up", trendPercentage: 22 },
  { medicineName: "Diclofenac Gel", category: "Analgesic", unitsSold: 190, revenue: 9500, trend: "down", trendPercentage: 8 },
  { medicineName: "Montelukast 10mg", category: "Antiallergic", unitsSold: 95, revenue: 5700, trend: "down", trendPercentage: 14 },
];

export function getMedicineSales(): MedicineSalesData[] {
  return MEDICINE_BASE.map((m, idx) => ({ id: `MED${String(idx + 1).padStart(3, "0")}`, ...m })).sort((a, b) => b.unitsSold - a.unitsSold);
}

const LAB_TEST_BASE: Omit<LabTestData, "id">[] = [
  { testName: "Complete Blood Count (CBC)", labType: "Pathology", totalOrdered: 385, revenue: 134750, avgTurnaroundTime: "2 hrs", trend: "up", trendPercentage: 14 },
  { testName: "Lipid Profile", labType: "Pathology", totalOrdered: 290, revenue: 145000, avgTurnaroundTime: "4 hrs", trend: "up", trendPercentage: 9 },
  { testName: "Liver Function Test (LFT)", labType: "Pathology", totalOrdered: 245, revenue: 134750, avgTurnaroundTime: "3 hrs", trend: "stable", trendPercentage: 2 },
  { testName: "Thyroid Profile (T3/T4/TSH)", labType: "Pathology", totalOrdered: 210, revenue: 126000, avgTurnaroundTime: "6 hrs", trend: "up", trendPercentage: 11 },
  { testName: "Blood Sugar (Fasting/PP)", labType: "Pathology", totalOrdered: 460, revenue: 92000, avgTurnaroundTime: "1 hr", trend: "up", trendPercentage: 20 },
  { testName: "Urine Routine Examination", labType: "Pathology", totalOrdered: 175, revenue: 43750, avgTurnaroundTime: "2 hrs", trend: "down", trendPercentage: 5 },
  { testName: "HbA1c", labType: "Pathology", totalOrdered: 140, revenue: 70000, avgTurnaroundTime: "4 hrs", trend: "up", trendPercentage: 16 },
  { testName: "Chest X-Ray (PA View)", labType: "Radiology", totalOrdered: 220, revenue: 99000, avgTurnaroundTime: "30 mins", trend: "up", trendPercentage: 10 },
  { testName: "Ultrasound Abdomen", labType: "Radiology", totalOrdered: 165, revenue: 165000, avgTurnaroundTime: "45 mins", trend: "up", trendPercentage: 13 },
  { testName: "2D Echo", labType: "Radiology", totalOrdered: 95, revenue: 209000, avgTurnaroundTime: "1 hr", trend: "stable", trendPercentage: 3 },
  { testName: "CT Scan Brain", labType: "Radiology", totalOrdered: 42, revenue: 147000, avgTurnaroundTime: "1.5 hrs", trend: "down", trendPercentage: 7 },
  { testName: "MRI Spine", labType: "Radiology", totalOrdered: 28, revenue: 168000, avgTurnaroundTime: "2 hrs", trend: "down", trendPercentage: 9 },
];

export function getLabTests(): LabTestData[] {
  return LAB_TEST_BASE.map((t, idx) => ({ id: `LAB${String(idx + 1).padStart(3, "0")}`, ...t })).sort((a, b) => b.totalOrdered - a.totalOrdered);
}

const DEPT_COLORS: Record<string, string> = {
  Cardiology: "#3b82f6",
  Neurology: "#8b5cf6",
  Orthopedics: "#f59e0b",
  Gastroenterology: "#10b981",
  Dermatology: "#ec4899",
  Pediatrics: "#06b6d4",
  "General Medicine": "#6366f1",
  ENT: "#f43f5e",
  Gynecology: "#84cc16",
};

export function getDepartmentRevenue(): DepartmentWiseRevenue[] {
  const doctors = getDoctorPerformance();
  const map = new Map<string, { revenue: number; consultations: number }>();
  doctors.forEach((doc) => {
    const existing = map.get(doc.department) ?? { revenue: 0, consultations: 0 };
    map.set(doc.department, {
      revenue: existing.revenue + doc.revenueGenerated,
      consultations: existing.consultations + doc.completedConsultations,
    });
  });
  return Array.from(map.entries()).map(([department, val]) => ({
    department,
    revenue: val.revenue,
    consultations: val.consultations,
    color: DEPT_COLORS[department] ?? "#64748b",
  })).sort((a, b) => b.revenue - a.revenue);
}

export function getHourlyTrends(): HourlyTrend[] {
  return [
    { hour: "9 AM", consultations: 8, revenue: 12000 },
    { hour: "10 AM", consultations: 14, revenue: 21000 },
    { hour: "11 AM", consultations: 18, revenue: 27000 },
    { hour: "12 PM", consultations: 15, revenue: 22500 },
    { hour: "1 PM", consultations: 6, revenue: 9000 },
    { hour: "2 PM", consultations: 10, revenue: 15000 },
    { hour: "3 PM", consultations: 17, revenue: 25500 },
    { hour: "4 PM", consultations: 20, revenue: 30000 },
    { hour: "5 PM", consultations: 16, revenue: 24000 },
    { hour: "6 PM", consultations: 9, revenue: 13500 },
  ];
}

export function getDailyTrends(days: number): DailyTrendPoint[] {
  const base: DailyTrendPoint[] = [
    { date: "25 Aug", revenue: 142000, consultations: 118, newPatients: 72, followUps: 46 },
    { date: "26 Aug", revenue: 158000, consultations: 132, newPatients: 80, followUps: 52 },
    { date: "27 Aug", revenue: 136500, consultations: 109, newPatients: 65, followUps: 44 },
    { date: "28 Aug", revenue: 171000, consultations: 145, newPatients: 88, followUps: 57 },
    { date: "29 Aug", revenue: 164200, consultations: 138, newPatients: 84, followUps: 54 },
    { date: "30 Aug", revenue: 149800, consultations: 121, newPatients: 74, followUps: 47 },
    { date: "31 Aug", revenue: 178300, consultations: 152, newPatients: 92, followUps: 60 },
    { date: "1 Sep", revenue: 155600, consultations: 128, newPatients: 78, followUps: 50 },
    { date: "2 Sep", revenue: 168900, consultations: 141, newPatients: 86, followUps: 55 },
    { date: "3 Sep", revenue: 173400, consultations: 147, newPatients: 89, followUps: 58 },
    { date: "4 Sep", revenue: 162000, consultations: 135, newPatients: 82, followUps: 53 },
    { date: "5 Sep", revenue: 91500, consultations: 76, newPatients: 46, followUps: 30 },
  ];
  return base.slice(-days);
}

export function getPaymentBreakdown(): PaymentModeBreakdown[] {
  return [
    { method: "Cash", amount: 285600, percentage: 38, color: "#10b981" },
    { method: "UPI", amount: 236400, percentage: 31, color: "#3b82f6" },
    { method: "Card", amount: 151800, percentage: 20, color: "#8b5cf6" },
    { method: "Insurance/TPA", amount: 83200, percentage: 11, color: "#f59e0b" },
  ];
}

const RANGE_MULTIPLIER: Record<DateRangeKey, number> = {
  today: 1,
  yesterday: 0.94,
  thisWeek: 6.2,
  lastWeek: 5.9,
  lastMonth: 26.5,
  last6Months: 158,
  custom: 1,
};

const RANGE_CHANGE: Record<DateRangeKey, number> = {
  today: 8.4,
  yesterday: -3.2,
  thisWeek: 12.1,
  lastWeek: 5.6,
  lastMonth: 15.8,
  last6Months: 22.3,
  custom: 0,
};

export function getOPDDashboardData(range: DateRangeKey): OPDDashboardData {
  const multiplier = RANGE_MULTIPLIER[range];
  const change = RANGE_CHANGE[range];

  const opdConsultation = Math.round(76500 * multiplier);
  const doctorFees = Math.round(285600 * multiplier);
  const pharmacy = Math.round(196550 * multiplier);
  const labPathology = Math.round(198750 * multiplier / 1.4);
  const labRadiology = Math.round(198750 * multiplier / 1.15);
  const total = opdConsultation + doctorFees + pharmacy + labPathology + labRadiology;

  const daysMap: Record<DateRangeKey, number> = {
    today: 1, yesterday: 1, thisWeek: 7, lastWeek: 7, lastMonth: 12, last6Months: 12, custom: 7,
  };

  return {
    revenue: {
      opdConsultation,
      doctorFees,
      pharmacy,
      labPathology,
      labRadiology,
      total,
      changeVsPrevious: change,
    },
    consultationStats: {
      totalToday: Math.round(147 * multiplier),
      newConsultations: Math.round(89 * multiplier),
      followUpConsultations: Math.round(58 * multiplier),
      rescheduled: Math.round(9 * multiplier),
      cancelled: Math.round(6 * multiplier),
      completed: Math.round(118 * multiplier),
      waiting: Math.round(14 * multiplier),
      checkedIn: Math.round(15 * multiplier),
      opdToIpdTransfers: Math.round(4 * multiplier),
      noShow: Math.round(5 * multiplier),
      changeVsPrevious: {
        total: 9.2,
        newConsultations: 11.4,
        followUp: 6.1,
        rescheduled: -4.5,
        cancelled: -12.3,
        completed: 10.8,
        transfers: 15.0,
      },
    },
    doctorPerformance: getDoctorPerformance(),
    medicineSales: getMedicineSales(),
    labTests: getLabTests(),
    departmentRevenue: getDepartmentRevenue(),
    hourlyTrends: getHourlyTrends(),
    dailyTrends: getDailyTrends(daysMap[range]),
    paymentBreakdown: getPaymentBreakdown(),
  };
}
