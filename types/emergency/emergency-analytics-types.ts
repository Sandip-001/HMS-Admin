// types/emergency/emergency-analytics-types.ts

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

export interface EmergencyRevenueBreakdown {
  bedFees: number;
  doctorFees: number;
  procedureCharges: number;
  pharmacy: number;
  labPathology: number;
  labRadiology: number;
  ambulanceFees: number;
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

export type DoctorEmergencyStatus = "High Load" | "Balanced" | "Low Load";

export interface DoctorEmergencyWorkload {
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
  avgTreatmentTimeMins: number;
  status: DoctorEmergencyStatus;
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

export interface EmergencyMedicineSalesData {
  id: string;
  medicineName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  trend: TrendDirection;
  trendPercentage: number;
}

export type LabType = "Pathology" | "Radiology";

export interface EmergencyLabTestData {
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
  arrivedOn: string;
  dischargedOn: string;
  doctor: string;
  totalStayHours: number;
  finalBillAmount: number;
}

export type TransferDestination = "IPD" | "ICU" | "OT";

export interface TransferRecord {
  id: string;
  patientName: string;
  uhid: string;
  fromBed: string;
  destination: TransferDestination;
  toWard: string;
  toBed: string;
  transferredAt: string;
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
  arrivedOn: string;
  timeOfDeath: string;
  doctor: string;
  causeOfDeath: string;
  certifiedBy: string;
  broughtDead: boolean;
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
  hoursAdmitted: number;
  lastPaymentDate: string;
}

export type BedStatus = "Occupied" | "Available" | "Maintenance";

export interface EmergencyBayOccupancy {
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
  arrivedOn?: string;
  triageLevel?: "Critical" | "Urgent" | "Standard";
  maintenanceReason?: string;
}

export interface DailyEmergencyTrendPoint {
  date: string;
  revenue: number;
  arrivals: number;
  discharges: number;
  deaths: number;
  collected: number;
  pending: number;
}

export interface HourlyEmergencyTrend {
  hour: string;
  arrivals: number;
  discharges: number;
}

export interface EmergencyDashboardData {
  revenue: EmergencyRevenueBreakdown;
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
    shiftedToICU: number;
    shiftedToOT: number;
    deceasedToday: number;
    newArrivalsToday: number;
    changeVsPrevious: {
      discharged: number;
      shiftedToIPD: number;
      shiftedToICU: number;
      shiftedToOT: number;
      deceased: number;
      newArrivals: number;
    };
  };
  doctorWorkload: DoctorEmergencyWorkload[];
  nurseAssignments: NursePatientAssignment[];
  medicineSales: EmergencyMedicineSalesData[];
  labTests: EmergencyLabTestData[];
  dischargedPatients: DischargedPatientRecord[];
  transferRecords: TransferRecord[];
  mortalityRecords: MortalityRecord[];
  pendingPayments: PendingPaymentRecord[];
  bayOccupancy: EmergencyBayOccupancy[];
  bedDetails: BedDetail[];
  dailyTrends: DailyEmergencyTrendPoint[];
  hourlyTrends: HourlyEmergencyTrend[];
}

export interface EmergencyDashboardFilters {
  range: DateRangeKey;
  customFrom?: string;
  customTo?: string;
  department: string;
  bay: string;
}

export type EmergencyDrawerContentType =
  | "revenue"
  | "collected"
  | "pending"
  | "labIncome"
  | "pharmacyIncome"
  | "doctorWorkload"
  | "nurseAssignments"
  | "medicineSales"
  | "labTests"
  | "dischargedPatients"
  | "shiftedToIpd"
  | "shiftedToIcu"
  | "shiftedToOt"
  | "mortalityRecords"
  | "newArrivals"
  | "paymentSources"
  | "bedOccupancy"
  | null;