// lib/revenue-leakage/revenue-leakage-data.ts
import type {
  DateRangeKey,
  DateRangeOption,
  RevenueLeakageDashboardData,
  DiscountRecord,
  ExpiredMedicineRecord,
  PendingBillRecord,
  OtherLeakageRecord,
  DepartmentLeakageSummary,
  DailyLeakageTrendPoint,
  StaffDiscountBehavior,
  HospitalDepartment,
} from "@/types/revenue-leakage/revenue-leakage-types";

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisWeek", label: "This Week" },
  { key: "lastWeek", label: "Last Week" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last6Months", label: "Last 6 Months" },
  { key: "custom", label: "Custom Range" },
];

export const HOSPITAL_DEPARTMENTS = [
  "All Departments",
  "IPD",
  "OPD",
  "ICU",
  "Emergency",
  "OT",
  "Pharmacy",
  "Lab - Pathology",
  "Lab - Radiology",
];

const DISCOUNT_BASE: Omit<DiscountRecord, "id">[] = [
  { patientName: "Ravi Sharma", uhid: "UHID12345685", department: "IPD", sourceType: "Billing Department", billNumber: "BILL-IPD-20260827-014", totalBillAmount: 285000, discountPercentage: 10, discountAmount: 28500, netAmount: 256500, reason: "Senior citizen discount as per hospital policy", approvedBy: "Sunil Kapoor", approverRole: "Billing Manager", givenAt: "27 Aug 2026, 04:30 PM" },
  { patientName: "Rahul Roy", uhid: "UHID12398211", department: "IPD", sourceType: "Billing Department", billNumber: "BILL-IPD-20260827-021", totalBillAmount: 512000, discountPercentage: 15, discountAmount: 76800, netAmount: 435200, reason: "Corporate tie-up discount for employee dependent", approvedBy: "Anjali Mehta", approverRole: "Front Office Head", givenAt: "27 Aug 2026, 06:15 PM" },
  { patientName: "Meera Joshi", uhid: "UHID12345750", department: "Emergency", sourceType: "Billing Department", billNumber: "BILL-ER-20260827-008", totalBillAmount: 45200, discountPercentage: 20, discountAmount: 9040, netAmount: 36160, reason: "Financial hardship case - approved by Medical Superintendent", approvedBy: "Dr. Kunal Bose", approverRole: "Medical Superintendent", givenAt: "27 Aug 2026, 09:20 AM" },
  { patientName: "Anjali Deshmukh", uhid: "UHID12398250", department: "OPD", sourceType: "Billing Department", billNumber: "BILL-OPD-20260830-112", totalBillAmount: 3500, discountPercentage: 100, discountAmount: 3500, netAmount: 0, reason: "Free consultation - staff family member (unauthorized waiver)", approvedBy: "Rajesh Nair", approverRole: "Front Desk Executive", givenAt: "30 Aug 2026, 10:05 AM" },
  { patientName: "Sanjay Malhotra", uhid: "UHID12398225", department: "ICU", sourceType: "Billing Department", billNumber: "BILL-ICU-20260828-009", totalBillAmount: 298000, discountPercentage: 8, discountAmount: 23840, netAmount: 274160, reason: "Loyalty discount - repeat patient over 5 years", approvedBy: "Sunil Kapoor", approverRole: "Billing Manager", givenAt: "28 Aug 2026, 02:40 PM" },
  { patientName: "Vinod Kulkarni", uhid: "UHID12398254", department: "OT", sourceType: "Billing Department", billNumber: "BILL-OT-20260829-004", totalBillAmount: 185000, discountPercentage: 12, discountAmount: 22200, netAmount: 162800, reason: "Package deal discount for elective surgery", approvedBy: "Anjali Mehta", approverRole: "Front Office Head", givenAt: "29 Aug 2026, 11:30 AM" },
  { patientName: "Ramesh Gupta", uhid: "UHID12398232", department: "Pharmacy", sourceType: "Pharmacy", billNumber: "PHM-20260829-045", totalBillAmount: 8400, discountPercentage: 25, discountAmount: 2100, netAmount: 6300, reason: "Discount given without valid reason code entered", approvedBy: "Rohit Ghosh", approverRole: "Pharmacist", givenAt: "29 Aug 2026, 03:15 PM" },
  { patientName: "Kavita Desai", uhid: "UHID12398226", department: "Pharmacy", sourceType: "Pharmacy", billNumber: "PHM-20260830-078", totalBillAmount: 12600, discountPercentage: 15, discountAmount: 1890, netAmount: 10710, reason: "Bulk purchase discount - chronic medication refill", approvedBy: "Priya Sen", approverRole: "Pharmacist", givenAt: "30 Aug 2026, 01:20 PM" },
  { patientName: "Lakshmi Pillai", uhid: "UHID12398233", department: "Lab - Pathology", sourceType: "Lab - Pathology", billNumber: "LAB-20260830-032", totalBillAmount: 4500, discountPercentage: 30, discountAmount: 1350, netAmount: 3150, reason: "Discount given to walk-in patient without documented approval", approvedBy: "Sneha Kulkarni", approverRole: "Lab Receptionist", givenAt: "30 Aug 2026, 09:50 AM" },
  { patientName: "Suresh Yadav", uhid: "UHID12398230", department: "Lab - Radiology", sourceType: "Lab - Radiology", billNumber: "RAD-20260830-019", totalBillAmount: 9500, discountPercentage: 10, discountAmount: 950, netAmount: 8550, reason: "Referral doctor discount arrangement", approvedBy: "Manoj Verma", approverRole: "Radiology Technician", givenAt: "30 Aug 2026, 12:10 PM" },
  { patientName: "Farida Khan", uhid: "UHID12398243", department: "Emergency", sourceType: "Billing Department", billNumber: "BILL-ER-20260830-031", totalBillAmount: 28900, discountPercentage: 100, discountAmount: 28900, netAmount: 0, reason: "Fully waived - trauma victim, no attendant, police case", approvedBy: "Dr. Kunal Bose", approverRole: "Medical Superintendent", givenAt: "30 Aug 2026, 11:15 AM" },
  { patientName: "Manoj Bhatt", uhid: "UHID12398251", department: "OPD", sourceType: "Billing Department", billNumber: "BILL-OPD-20260830-118", totalBillAmount: 2200, discountPercentage: 50, discountAmount: 1100, netAmount: 1100, reason: "Discount applied twice on same bill by mistake", approvedBy: "Rajesh Nair", approverRole: "Front Desk Executive", givenAt: "30 Aug 2026, 01:45 PM" },
];

export function getDiscountRecords(): DiscountRecord[] {
  return DISCOUNT_BASE.map((d, idx) => ({ id: `DISC${String(idx + 1).padStart(3, "0")}`, ...d }));
}

const EXPIRED_MEDICINE_BASE: Omit<ExpiredMedicineRecord, "id">[] = [
  { medicineName: "Amoxicillin 500mg", category: "Antibiotic", batchNumber: "AMX23087", expiryDate: "2026-08-15", expiredQuantity: 240, unitPrice: 8, totalLossAmount: 1920, rackNumber: "B-03", detectedOn: "20 Aug 2026", detectedBy: "Rohit Ghosh", status: "Pending Write-off" },
  { medicineName: "Insulin Regular", category: "Antidiabetic", batchNumber: "INS24012", expiryDate: "2026-08-20", expiredQuantity: 18, unitPrice: 320, totalLossAmount: 5760, rackNumber: "Cold Storage-01", detectedOn: "21 Aug 2026", detectedBy: "Priya Sen", status: "Written Off" },
  { medicineName: "Atorvastatin 40mg", category: "Statin", batchNumber: "ATV23980", expiryDate: "2026-08-25", expiredQuantity: 156, unitPrice: 5, totalLossAmount: 780, rackNumber: "B-04", detectedOn: "26 Aug 2026", detectedBy: "Rohit Ghosh", status: "Pending Write-off" },
  { medicineName: "Cefixime 200mg", category: "Antibiotic", batchNumber: "CFX24055", expiryDate: "2026-08-18", expiredQuantity: 95, unitPrice: 22, totalLossAmount: 2090, rackNumber: "B-02", detectedOn: "19 Aug 2026", detectedBy: "Priya Sen", status: "Returned to Vendor" },
  { medicineName: "Metoprolol 25mg", category: "Beta Blocker", batchNumber: "MET24072", expiryDate: "2026-08-30", expiredQuantity: 310, unitPrice: 3, totalLossAmount: 930, rackNumber: "B-02", detectedOn: "30 Aug 2026", detectedBy: "Rohit Ghosh", status: "Pending Write-off" },
  { medicineName: "Ondansetron 4mg", category: "Antiemetic", batchNumber: "OND24019", expiryDate: "2026-08-28", expiredQuantity: 128, unitPrice: 2, totalLossAmount: 256, rackNumber: "C-01", detectedOn: "29 Aug 2026", detectedBy: "Priya Sen", status: "Written Off" },
  { medicineName: "Pantoprazole 40mg Injection", category: "Antacid", batchNumber: "PAN23890", expiryDate: "2026-08-22", expiredQuantity: 64, unitPrice: 35, totalLossAmount: 2240, rackNumber: "B-01", detectedOn: "23 Aug 2026", detectedBy: "Rohit Ghosh", status: "Pending Write-off" },
  { medicineName: "Piperacillin-Tazobactam 4.5g", category: "Antibiotic", batchNumber: "PIP24398", expiryDate: "2026-08-19", expiredQuantity: 12, unitPrice: 320, totalLossAmount: 3840, rackNumber: "ICU-01", detectedOn: "20 Aug 2026", detectedBy: "Priya Sen", status: "Written Off" },
];

export function getExpiredMedicines(): ExpiredMedicineRecord[] {
  return EXPIRED_MEDICINE_BASE.map((e, idx) => ({ id: `EXP${String(idx + 1).padStart(3, "0")}`, ...e })).sort((a, b) => b.totalLossAmount - a.totalLossAmount);
}

const PENDING_BILL_BASE: Omit<PendingBillRecord, "id">[] = [
  { patientName: "Ravi Sharma", uhid: "UHID12345685", department: "ICU", billNumber: "BILL-ICU-20260827-001", doctor: "Dr. Amit Verma", totalBillAmount: 425000, amountCollected: 250000, amountPending: 175000, daysPending: 4, lastPaymentDate: "28 Aug 2026", contactNumber: "9876543210", status: "Follow-up Sent" },
  { patientName: "Rahul Roy", uhid: "UHID12398211", department: "ICU", billNumber: "BILL-ICU-20260827-002", doctor: "Dr. Rahul Mehta", totalBillAmount: 512000, amountCollected: 300000, amountPending: 212000, daysPending: 4, lastPaymentDate: "27 Aug 2026", contactNumber: "9123456789", status: "Promised to Pay" },
  { patientName: "Sanjay Malhotra", uhid: "UHID12398225", department: "ICU", billNumber: "BILL-ICU-20260828-009", doctor: "Dr. Arjun Kapoor", totalBillAmount: 298000, amountCollected: 150000, amountPending: 148000, daysPending: 3, lastPaymentDate: "29 Aug 2026", contactNumber: "9988776655", status: "Not Contacted" },
  { patientName: "Kavita Desai", uhid: "UHID12398226", department: "ICU", billNumber: "BILL-ICU-20260829-011", doctor: "Dr. Vikram Singh", totalBillAmount: 176000, amountCollected: 80000, amountPending: 96000, daysPending: 2, lastPaymentDate: "30 Aug 2026", contactNumber: "9765432109", status: "Not Contacted" },
  { patientName: "Suresh Yadav", uhid: "UHID12398230", department: "IPD", billNumber: "BILL-IPD-20260824-005", doctor: "Dr. Amit Verma", totalBillAmount: 285000, amountCollected: 285000, amountPending: 0, daysPending: 0, lastPaymentDate: "30 Aug 2026", contactNumber: "9871234567", status: "Not Contacted" },
  { patientName: "Anita Rao", uhid: "UHID12398231", department: "IPD", billNumber: "BILL-IPD-20260826-007", doctor: "Dr. Priya Nair", totalBillAmount: 168000, amountCollected: 90000, amountPending: 78000, daysPending: 4, lastPaymentDate: "28 Aug 2026", contactNumber: "9812345670", status: "Escalated" },
  { patientName: "Vinod Kulkarni", uhid: "UHID12398254", department: "OT", billNumber: "BILL-OT-20260829-004", doctor: "Dr. Sunita Rao", totalBillAmount: 185000, amountCollected: 100000, amountPending: 85000, daysPending: 2, lastPaymentDate: "30 Aug 2026", contactNumber: "9765123480", status: "Follow-up Sent" },
  { patientName: "Unknown Male (RTA)", uhid: "UHID12398211", department: "Emergency", billNumber: "BILL-ER-20260827-005", doctor: "Dr. Rahul Mehta", totalBillAmount: 45200, amountCollected: 0, amountPending: 45200, daysPending: 4, lastPaymentDate: "N/A", contactNumber: "N/A", status: "Escalated" },
  { patientName: "Manoj Tiwari", uhid: "UHID12398227", department: "IPD", billNumber: "BILL-IPD-20260830-014", doctor: "Dr. Arjun Kapoor", totalBillAmount: 92000, amountCollected: 40000, amountPending: 52000, daysPending: 1, lastPaymentDate: "30 Aug 2026", contactNumber: "9654321098", status: "Not Contacted" },
];

export function getPendingBills(): PendingBillRecord[] {
  return PENDING_BILL_BASE.filter((p) => p.amountPending > 0).map((p, idx) => ({ id: `PEND${String(idx + 1).padStart(3, "0")}`, ...p }));
}

const OTHER_LEAKAGE_BASE: Omit<OtherLeakageRecord, "id">[] = [
  { category: "OT Consumable Not Charged", department: "OT", patientName: "Vinod Kulkarni", uhid: "UHID12398254", description: "3 surgical mesh units and 2 suture packs used but not added to final OT bill", estimatedLossAmount: 18500, identifiedBy: "Internal Audit Team", identifiedOn: "30 Aug 2026", status: "Under Review" },
  { category: "Unbilled Consumables", department: "ICU", patientName: "Rahul Roy", uhid: "UHID12398211", description: "Ventilator circuit and 4 units of IV cannula consumed but missing from daily consumption sheet", estimatedLossAmount: 6200, identifiedBy: "Internal Audit Team", identifiedOn: "29 Aug 2026", status: "Open" },
  { category: "Insurance Claim Rejection", department: "IPD", patientName: "Meera Iyer", uhid: "UHID12398234", description: "Claim rejected by TPA due to incomplete pre-authorization documentation; amount not recovered from patient", estimatedLossAmount: 84000, identifiedBy: "Insurance Desk - Kiran Shah", identifiedOn: "28 Aug 2026", status: "Open" },
  { category: "Free Service / Waived Charges", department: "OPD", patientName: "Staff Dependent - R. Nair", uhid: "UHID12398260", description: "Consultation and 2 diagnostic tests marked complimentary without Medical Superintendent sign-off", estimatedLossAmount: 4800, identifiedBy: "Internal Audit Team", identifiedOn: "30 Aug 2026", status: "Resolved" },
  { category: "Cancelled Bill After Service", department: "Lab - Pathology", patientName: "Deepa Nair", uhid: "UHID12398241", description: "CBC and LFT performed and reported, but bill was cancelled in system without refund trail", estimatedLossAmount: 900, identifiedBy: "Lab Billing Audit", identifiedOn: "29 Aug 2026", status: "Under Review" },
  { category: "Rate Master Mismatch", department: "Lab - Radiology", patientName: "Multiple Patients (12)", uhid: "Multiple", description: "CT Chest with Contrast billed at old rate (₹4,200) instead of revised rate (₹5,000) for 12 patients this month", estimatedLossAmount: 9600, identifiedBy: "Finance Team", identifiedOn: "30 Aug 2026", status: "Recovered" },
  { category: "Duplicate Refund", department: "Pharmacy", patientName: "Ramesh Gupta", uhid: "UHID12398232", description: "Medicine return refund of ₹1,200 processed twice for the same return transaction", estimatedLossAmount: 1200, identifiedBy: "Pharmacy Audit", identifiedOn: "29 Aug 2026", status: "Recovered" },
  { category: "Ambulance Free Ride", department: "Emergency", patientName: "Harish Chandra", uhid: "UHID12398240", description: "Ambulance transport charge waived without approval for non-emergency inter-facility transfer", estimatedLossAmount: 3500, identifiedBy: "Internal Audit Team", identifiedOn: "30 Aug 2026", status: "Open" },
  { category: "Unbilled Consumables", department: "OT", patientName: "Geetha Nambiar", uhid: "UHID12398253", description: "High-cost implant (orthopedic screw set) used during surgery but not reflected in OT billing module", estimatedLossAmount: 42000, identifiedBy: "Internal Audit Team", identifiedOn: "29 Aug 2026", status: "Open" },
];

export function getOtherLeakageRecords(): OtherLeakageRecord[] {
  return OTHER_LEAKAGE_BASE.map((o, idx) => ({ id: `OTH${String(idx + 1).padStart(3, "0")}`, ...o })).sort((a, b) => b.estimatedLossAmount - a.estimatedLossAmount);
}

const STAFF_BEHAVIOR_BASE: StaffDiscountBehavior[] = [
  { staffName: "Sunil Kapoor", role: "Billing Manager", department: "IPD", totalDiscountsGiven: 14, totalDiscountAmount: 168000, avgDiscountPercentage: 11.2, flagged: false },
  { staffName: "Anjali Mehta", role: "Front Office Head", department: "IPD", totalDiscountsGiven: 9, totalDiscountAmount: 142000, avgDiscountPercentage: 13.5, flagged: false },
  { staffName: "Dr. Kunal Bose", role: "Medical Superintendent", department: "Emergency", totalDiscountsGiven: 6, totalDiscountAmount: 98000, avgDiscountPercentage: 45.0, flagged: false },
  { staffName: "Rajesh Nair", role: "Front Desk Executive", department: "OPD", totalDiscountsGiven: 22, totalDiscountAmount: 18400, avgDiscountPercentage: 38.6, flagged: true },
  { staffName: "Rohit Ghosh", role: "Pharmacist", department: "Pharmacy", totalDiscountsGiven: 18, totalDiscountAmount: 24600, avgDiscountPercentage: 19.8, flagged: true },
  { staffName: "Priya Sen", role: "Pharmacist", department: "Pharmacy", totalDiscountsGiven: 8, totalDiscountAmount: 9200, avgDiscountPercentage: 12.4, flagged: false },
  { staffName: "Sneha Kulkarni", role: "Lab Receptionist", department: "Lab - Pathology", totalDiscountsGiven: 11, totalDiscountAmount: 8900, avgDiscountPercentage: 27.3, flagged: true },
  { staffName: "Manoj Verma", role: "Radiology Technician", department: "Lab - Radiology", totalDiscountsGiven: 5, totalDiscountAmount: 4200, avgDiscountPercentage: 9.5, flagged: false },
];

export function getStaffDiscountBehavior(): StaffDiscountBehavior[] {
  return [...STAFF_BEHAVIOR_BASE].sort((a, b) => b.totalDiscountAmount - a.totalDiscountAmount);
}

const DEPT_COLORS: Record<string, string> = {
  IPD: "#3b82f6",
  OPD: "#8b5cf6",
  ICU: "#ef4444",
  Emergency: "#f97316",
  OT: "#a855f7",
  Pharmacy: "#ec4899",
  "Lab - Pathology": "#06b6d4",
  "Lab - Radiology": "#0ea5e9",
};

export function getDepartmentSummary(
  discounts: DiscountRecord[],
  pending: PendingBillRecord[],
  otherLeakage: OtherLeakageRecord[],
): DepartmentLeakageSummary[] {
  const departments: HospitalDepartment[] = ["IPD", "OPD", "ICU", "Emergency", "OT", "Pharmacy", "Lab - Pathology", "Lab - Radiology"];

  return departments
    .map((dept) => {
      const discountLeakage = discounts.filter((d) => d.department === dept).reduce((sum, d) => sum + d.discountAmount, 0);
      const pendingLeakage = pending.filter((p) => p.department === dept).reduce((sum, p) => sum + p.amountPending, 0);
      const otherLeak = otherLeakage.filter((o) => o.department === dept).reduce((sum, o) => sum + o.estimatedLossAmount, 0);
      const totalLeakage = discountLeakage + pendingLeakage + otherLeak;

      return {
        department: dept,
        discountLeakage,
        pendingLeakage,
        otherLeakage: otherLeak,
        totalLeakage,
        color: DEPT_COLORS[dept] ?? "#64748b",
      };
    })
    .filter((d) => d.totalLeakage > 0)
    .sort((a, b) => b.totalLeakage - a.totalLeakage);
}

export function getDailyTrends(days: number): DailyLeakageTrendPoint[] {
  const base: DailyLeakageTrendPoint[] = [
    { date: "25 Aug", discountLeakage: 18500, pendingLeakage: 145000, expiredMedicineLeakage: 2200, otherLeakage: 8500, totalLeakage: 174200 },
    { date: "26 Aug", discountLeakage: 24200, pendingLeakage: 158000, expiredMedicineLeakage: 1800, otherLeakage: 6200, totalLeakage: 190200 },
    { date: "27 Aug", discountLeakage: 114340, pendingLeakage: 387000, expiredMedicineLeakage: 3840, otherLeakage: 0, totalLeakage: 505180 },
    { date: "28 Aug", discountLeakage: 23840, pendingLeakage: 148000, expiredMedicineLeakage: 5760, otherLeakage: 84000, totalLeakage: 261600 },
    { date: "29 Aug", discountLeakage: 24300, pendingLeakage: 233000, expiredMedicineLeakage: 780, otherLeakage: 900, totalLeakage: 258980 },
    { date: "30 Aug", discountLeakage: 34990, pendingLeakage: 148000, expiredMedicineLeakage: 930, otherLeakage: 27800, totalLeakage: 211720 },
    { date: "31 Aug", discountLeakage: 12400, pendingLeakage: 96000, expiredMedicineLeakage: 0, otherLeakage: 0, totalLeakage: 108400 },
    { date: "1 Sep", discountLeakage: 15600, pendingLeakage: 102000, expiredMedicineLeakage: 0, otherLeakage: 9600, totalLeakage: 127200 },
    { date: "2 Sep", discountLeakage: 19800, pendingLeakage: 118000, expiredMedicineLeakage: 0, otherLeakage: 0, totalLeakage: 137800 },
    { date: "3 Sep", discountLeakage: 21200, pendingLeakage: 125000, expiredMedicineLeakage: 0, otherLeakage: 1200, totalLeakage: 147400 },
    { date: "4 Sep", discountLeakage: 17400, pendingLeakage: 108000, expiredMedicineLeakage: 0, otherLeakage: 0, totalLeakage: 125400 },
    { date: "5 Sep", discountLeakage: 9200, pendingLeakage: 68000, expiredMedicineLeakage: 0, otherLeakage: 0, totalLeakage: 77200 },
  ];
  return base.slice(-days);
}

const RANGE_MULTIPLIER: Record<DateRangeKey, number> = {
  today: 1,
  yesterday: 0.92,
  thisWeek: 6.2,
  lastWeek: 5.9,
  lastMonth: 26.4,
  last6Months: 157,
  custom: 1,
};

const RANGE_CHANGE: Record<DateRangeKey, number> = {
  today: 14.2,
  yesterday: -6.8,
  thisWeek: 18.5,
  lastWeek: 9.4,
  lastMonth: 22.1,
  last6Months: 28.6,
  custom: 0,
};

export function getRevenueLeakageDashboardData(range: DateRangeKey): RevenueLeakageDashboardData {
  const multiplier = RANGE_MULTIPLIER[range];
  const change = RANGE_CHANGE[range];

  const discountRecords = getDiscountRecords();
  const expiredMedicines = getExpiredMedicines();
  const pendingBills = getPendingBills();
  const otherLeakageRecords = getOtherLeakageRecords();

  const totalDiscountLeakage = Math.round(discountRecords.reduce((sum, d) => sum + d.discountAmount, 0) * multiplier);
  const totalExpiredMedicineLoss = Math.round(expiredMedicines.reduce((sum, e) => sum + e.totalLossAmount, 0) * multiplier);
  const totalPendingAmount = Math.round(pendingBills.reduce((sum, p) => sum + p.amountPending, 0) * multiplier);
  const totalOtherLeakage = Math.round(otherLeakageRecords.reduce((sum, o) => sum + o.estimatedLossAmount, 0) * multiplier);
  const grandTotalLeakage = totalDiscountLeakage + totalExpiredMedicineLoss + totalPendingAmount + totalOtherLeakage;

  const daysMap: Record<DateRangeKey, number> = {
    today: 1, yesterday: 1, thisWeek: 7, lastWeek: 7, lastMonth: 12, last6Months: 12, custom: 7,
  };

  return {
    summary: {
      totalDiscountLeakage,
      totalExpiredMedicineLoss,
      totalPendingAmount,
      totalOtherLeakage,
      grandTotalLeakage,
      changeVsPrevious: change,
      totalDiscountRecords: discountRecords.length,
      totalExpiredBatches: expiredMedicines.length,
      totalPendingBills: pendingBills.length,
      totalOtherIssues: otherLeakageRecords.length,
    },
    discountRecords,
    expiredMedicines,
    pendingBills,
    otherLeakageRecords,
    departmentSummary: getDepartmentSummary(discountRecords, pendingBills, otherLeakageRecords),
    dailyTrends: getDailyTrends(daysMap[range]),
    staffDiscountBehavior: getStaffDiscountBehavior(),
  };
}
