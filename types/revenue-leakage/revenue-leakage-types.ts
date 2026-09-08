// types/revenue-leakage/revenue-leakage-types.ts

export type DateRangeKey =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "lastMonth"
  | "last6Months"
  | "custom";

export interface DateRangeOption {
  key: DateRangeKey;
  label: string;
}

export type HospitalDepartment = "IPD" | "OPD" | "ICU" | "Emergency" | "OT" | "Pharmacy" | "Lab - Pathology" | "Lab - Radiology";

export type DiscountSourceType = "Billing Department" | "Pharmacy" | "Lab - Pathology" | "Lab - Radiology";

export interface DiscountRecord {
  id: string;
  patientName: string;
  uhid: string;
  department: HospitalDepartment;
  sourceType: DiscountSourceType;
  billNumber: string;
  totalBillAmount: number;
  discountPercentage: number;
  discountAmount: number;
  netAmount: number;
  reason: string;
  approvedBy: string;
  approverRole: string;
  givenAt: string;
}

export interface ExpiredMedicineRecord {
  id: string;
  medicineName: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  expiredQuantity: number;
  unitPrice: number;
  totalLossAmount: number;
  rackNumber: string;
  detectedOn: string;
  detectedBy: string;
  status: "Pending Write-off" | "Written Off" | "Returned to Vendor";
}

export interface PendingBillRecord {
  id: string;
  patientName: string;
  uhid: string;
  department: HospitalDepartment;
  billNumber: string;
  doctor: string;
  totalBillAmount: number;
  amountCollected: number;
  amountPending: number;
  daysPending: number;
  lastPaymentDate: string;
  contactNumber: string;
  status: "Not Contacted" | "Follow-up Sent" | "Promised to Pay" | "Escalated";
}

export type LeakageCategory =
  | "Unbilled Consumables"
  | "Free Service / Waived Charges"
  | "Cancelled Bill After Service"
  | "Insurance Claim Rejection"
  | "Duplicate Refund"
  | "Rate Master Mismatch"
  | "OT Consumable Not Charged"
  | "Ambulance Free Ride";

export interface OtherLeakageRecord {
  id: string;
  category: LeakageCategory;
  department: HospitalDepartment;
  patientName: string;
  uhid: string;
  description: string;
  estimatedLossAmount: number;
  identifiedBy: string;
  identifiedOn: string;
  status: "Open" | "Under Review" | "Resolved" | "Recovered";
}

export interface DepartmentLeakageSummary {
  department: HospitalDepartment;
  discountLeakage: number;
  pendingLeakage: number;
  otherLeakage: number;
  totalLeakage: number;
  color: string;
}

export interface DailyLeakageTrendPoint {
  date: string;
  discountLeakage: number;
  pendingLeakage: number;
  expiredMedicineLeakage: number;
  otherLeakage: number;
  totalLeakage: number;
}

export interface StaffDiscountBehavior {
  staffName: string;
  role: string;
  department: HospitalDepartment;
  totalDiscountsGiven: number;
  totalDiscountAmount: number;
  avgDiscountPercentage: number;
  flagged: boolean;
}

export interface RevenueLeakageSummary {
  totalDiscountLeakage: number;
  totalExpiredMedicineLoss: number;
  totalPendingAmount: number;
  totalOtherLeakage: number;
  grandTotalLeakage: number;
  changeVsPrevious: number;
  totalDiscountRecords: number;
  totalExpiredBatches: number;
  totalPendingBills: number;
  totalOtherIssues: number;
}

export interface RevenueLeakageDashboardData {
  summary: RevenueLeakageSummary;
  discountRecords: DiscountRecord[];
  expiredMedicines: ExpiredMedicineRecord[];
  pendingBills: PendingBillRecord[];
  otherLeakageRecords: OtherLeakageRecord[];
  departmentSummary: DepartmentLeakageSummary[];
  dailyTrends: DailyLeakageTrendPoint[];
  staffDiscountBehavior: StaffDiscountBehavior[];
}

export interface RevenueLeakageFilters {
  range: DateRangeKey;
  customFrom?: string;
  customTo?: string;
  department: string;
}

export type LeakageDrawerContentType =
  | "totalDiscount"
  | "expiredMedicine"
  | "pendingAmount"
  | "otherLeakage"
  | "departmentBreakdown"
  | "staffBehavior"
  | "grandTotal"
  | null;