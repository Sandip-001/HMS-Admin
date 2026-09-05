// types/ipd/ipd-analytics-types.ts

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

export interface IPDRevenueBreakdown {
  bedCharges: number;
  doctorFees: number;
  pharmacy: number;
  labPathology: number;
  labRadiology: number;
  procedureCharges: number;
  otCharges: number;
  total: number;
  totalCollected: number;
  totalPending: number;
  changeVsPrevious: number;
}

export type PaymentSourceType = "Self Pay" | "Ayushman Bharat" | "TPA" | "Health Insurance";

export interface PaymentSourceBreakdown {
  source: PaymentSourceType;
  amount: number;
  patients: number;
  percentage: number;
  color: string;
}

export type DoctorIpdStatus = "High Load" | "Balanced" | "Low Load";

export interface DoctorIpdWorkload {
  id: string;
  name: string;
  department: string;
  avatarInitial: string;
  totalPatients: number;
  criticalPatients: number;
  stablePatients: number;
  dischargedToday: number;
  revenueGenerated: number;
  avgStayDays: number;
  status: DoctorIpdStatus;
}

export type NurseShift = "Morning" | "Evening" | "Night";

export interface NursePatientAssignment {
  id: string;
  nurseName: string;
  nurseInitial: string;
  shift: NurseShift;
  ward: string;
  patientName: string;
  patientUhid: string;
  bed: string;
  assignedAt: string;
  status: "On Duty" | "Handover Pending" | "Completed";
}

export type TrendDirection = "up" | "down" | "stable";

export interface IpdMedicineSalesData {
  id: string;
  medicineName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  trend: TrendDirection;
  trendPercentage: number;
}

export type LabType = "Pathology" | "Radiology";

export interface IpdLabTestData {
  id: string;
  testName: string;
  labType: LabType;
  totalOrdered: number;
  revenue: number;
  avgTurnaroundTime: string;
  trend: TrendDirection;
  trendPercentage: number;
}

export interface IpdPatientMovementStats {
  totalActiveAdmissions: number;
  newRegistrationsToday: number;
  dischargedToday: number;
  shiftedToOT: number;
  shiftedToICU: number;
  shiftedFromICU: number;
  cancelledAdmissions: number;
  transferredFromOPD: number;
  changeVsPrevious: {
    newRegistrations: number;
    discharged: number;
    shiftedToOT: number;
    shiftedToICU: number;
    cancelled: number;
  };
}

export interface CancelledAdmission {
  id: string;
  patientName: string;
  uhid: string;
  department: string;
  doctor: string;
  requestedBed: string;
  cancelledAt: string;
  cancelledBy: string;
  reason: string;
}

export interface WardWiseOccupancy {
  ward: string;
  totalBeds: number;
  occupied: number;
  available: number;
  maintenance: number;
  color: string;
}

export interface DailyIpdTrendPoint {
  date: string;
  revenue: number;
  admissions: number;
  discharges: number;
  collected: number;
  pending: number;
}

export interface HourlyAdmissionTrend {
  hour: string;
  admissions: number;
  discharges: number;
}

export interface IPDDashboardData {
  revenue: IPDRevenueBreakdown;
  paymentSources: PaymentSourceBreakdown[];
  movementStats: IpdPatientMovementStats;
  doctorWorkload: DoctorIpdWorkload[];
  nurseAssignments: NursePatientAssignment[];
  medicineSales: IpdMedicineSalesData[];
  labTests: IpdLabTestData[];
  cancelledAdmissions: CancelledAdmission[];
  wardOccupancy: WardWiseOccupancy[];
  dailyTrends: DailyIpdTrendPoint[];
  hourlyTrends: HourlyAdmissionTrend[];
}

export interface IPDDashboardFilters {
  range: DateRangeKey;
  customFrom?: string;
  customTo?: string;
  department: string;
  ward: string;
}

export type DrawerContentType =
  | "revenue"
  | "collected"
  | "pending"
  | "labIncome"
  | "pharmacyIncome"
  | "doctorWorkload"
  | "nurseAssignments"
  | "medicineSales"
  | "labTests"
  | "cancelledAdmissions"
  | "newRegistrations"
  | "discharged"
  | "shiftedToOT"
  | "shiftedToICU"
  | "paymentSources"
  | null;