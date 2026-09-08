// types/icu/icu-analytics-types.ts

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

export interface ICURevenueBreakdown {
  bedFees: number;
  doctorFees: number;
  oxygenFees: number;
  ventilationFees: number;
  pharmacy: number;
  labPathology: number;
  labRadiology: number;
  procedureCharges: number;
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

export type DoctorICUStatus = "High Load" | "Balanced" | "Low Load";

export interface DoctorICUWorkload {
  id: string;
  name: string;
  department: string;
  avatarInitial: string;
  totalPatients: number;
  criticalPatients: number;
  stablePatients: number;
  dischargedToday: number;
  deceasedCount: number;
  revenueGenerated: number;
  avgStayDays: number;
  status: DoctorICUStatus;
}

export type NurseShift = "Morning" | "Evening" | "Night";
export type NurseAssignmentStatus = "On Duty" | "Handover Pending" | "Completed";

export interface NursePatientAssignment {
  id: string;
  nurseName: string;
  nurseInitial: string;
  shift: NurseShift;
  bay: string;
  patientName: string;
  patientUhid: string;
  bed: string;
  assignedAt: string;
  status: NurseAssignmentStatus;
}

export type TrendDirection = "up" | "down" | "stable";

export interface IcuMedicineSalesData {
  id: string;
  medicineName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  trend: TrendDirection;
  trendPercentage: number;
}

export type LabType = "Pathology" | "Radiology";

export interface IcuLabTestData {
  id: string;
  testName: string;
  labType: LabType;
  totalOrdered: number;
  revenue: number;
  avgTurnaroundTime: string;
  trend: TrendDirection;
  trendPercentage: number;
}

export interface DischargedPatientRecord {
  id: string;
  patientName: string;
  uhid: string;
  bed: string;
  admittedOn: string;
  dischargedOn: string;
  doctor: string;
  totalStayDays: number;
  finalBillAmount: number;
}

export interface ShiftedToIpdRecord {
  id: string;
  patientName: string;
  uhid: string;
  fromBed: string;
  toWard: string;
  toBed: string;
  shiftedAt: string;
  doctor: string;
  reason: string;
}

export interface MortalityRecord {
  id: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: string;
  bed: string;
  admittedOn: string;
  timeOfDeath: string;
  doctor: string;
  causeOfDeath: string;
  certifiedBy: string;
}

export interface PendingPaymentRecord {
  id: string;
  patientName: string;
  uhid: string;
  bed: string;
  doctor: string;
  totalBill: number;
  amountCollected: number;
  amountPending: number;
  daysAdmitted: number;
  lastPaymentDate: string;
}

export interface OxygenVentilationRecord {
  id: string;
  patientName: string;
  uhid: string;
  bed: string;
  type: "Oxygen Support" | "Ventilator (Invasive)" | "Ventilator (Non-Invasive)" | "High Flow Nasal Cannula";
  startedAt: string;
  durationHours: number;
  ratePerHour: number;
  totalCost: number;
  status: "Active" | "Discontinued";
}

export type BedStatus = "Occupied" | "Available" | "Maintenance";

export interface ICUBayOccupancy {
  bay: string;
  totalBeds: number;
  occupied: number;
  available: number;
  maintenance: number;
  color: string;
}

export interface BedDetail {
  bedId: string;
  bay: string;
  status: BedStatus;
  patientName?: string;
  uhid?: string;
  admittedOn?: string;
  maintenanceReason?: string;
}

export interface DailyIcuTrendPoint {
  date: string;
  revenue: number;
  admissions: number;
  discharges: number;
  deaths: number;
  collected: number;
  pending: number;
}

export interface HourlyIcuTrend {
  hour: string;
  admissions: number;
  discharges: number;
}

export interface ICUDashboardData {
  revenue: ICURevenueBreakdown;
  paymentSources: PaymentSourceBreakdown[];
  bedOccupancy: {
    totalBeds: number;
    occupied: number;
    available: number;
    maintenance: number;
    changeVsPrevious: {
      occupied: number;
    };
  };
  patientFlow: {
    dischargedToday: number;
    shiftedToIPD: number;
    deceasedToday: number;
    newAdmissionsToday: number;
    changeVsPrevious: {
      discharged: number;
      shiftedToIPD: number;
      deceased: number;
      newAdmissions: number;
    };
  };
  doctorWorkload: DoctorICUWorkload[];
  nurseAssignments: NursePatientAssignment[];
  medicineSales: IcuMedicineSalesData[];
  labTests: IcuLabTestData[];
  dischargedPatients: DischargedPatientRecord[];
  shiftedToIpd: ShiftedToIpdRecord[];
  mortalityRecords: MortalityRecord[];
  pendingPayments: PendingPaymentRecord[];
  oxygenVentilationRecords: OxygenVentilationRecord[];
  bayOccupancy: ICUBayOccupancy[];
  bedDetails: BedDetail[];
  dailyTrends: DailyIcuTrendPoint[];
  hourlyTrends: HourlyIcuTrend[];
}

export interface ICUDashboardFilters {
  range: DateRangeKey;
  customFrom?: string;
  customTo?: string;
  department: string;
  bay: string;
}

export type ICUDrawerContentType =
  | "revenue"
  | "collected"
  | "pending"
  | "labIncome"
  | "pharmacyIncome"
  | "oxygenVentilation"
  | "doctorWorkload"
  | "nurseAssignments"
  | "medicineSales"
  | "labTests"
  | "dischargedPatients"
  | "shiftedToIpd"
  | "mortalityRecords"
  | "newAdmissions"
  | "paymentSources"
  | "bedOccupancy"
  | null;