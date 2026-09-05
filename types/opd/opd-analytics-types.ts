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

export interface RevenueBreakdown {
  opdConsultation: number;
  doctorFees: number;
  pharmacy: number;
  labPathology: number;
  labRadiology: number;
  total: number;
  changeVsPrevious: number;
}

export type DoctorPerformanceStatus = "Top Performer" | "Average" | "Needs Attention";

export interface DoctorPerformance {
  id: string;
  name: string;
  department: string;
  avatarInitial: string;
  totalConsultations: number;
  completedConsultations: number;
  cancelledConsultations: number;
  rescheduledConsultations: number;
  followUpConsultations: number;
  newConsultations: number;
  revenueGenerated: number;
  avgConsultationTimeMins: number;
  patientSatisfactionPct: number;
  status: DoctorPerformanceStatus;
}

export type TrendDirection = "up" | "down" | "stable";

export interface MedicineSalesData {
  id: string;
  medicineName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  trend: TrendDirection;
  trendPercentage: number;
}

export type LabType = "Pathology" | "Radiology";

export interface LabTestData {
  id: string;
  testName: string;
  labType: LabType;
  totalOrdered: number;
  revenue: number;
  avgTurnaroundTime: string;
  trend: TrendDirection;
  trendPercentage: number;
}

export interface ConsultationStats {
  totalToday: number;
  newConsultations: number;
  followUpConsultations: number;
  rescheduled: number;
  cancelled: number;
  completed: number;
  waiting: number;
  checkedIn: number;
  opdToIpdTransfers: number;
  noShow: number;
  changeVsPrevious: {
    total: number;
    newConsultations: number;
    followUp: number;
    rescheduled: number;
    cancelled: number;
    completed: number;
    transfers: number;
  };
}

export interface DepartmentWiseRevenue {
  department: string;
  revenue: number;
  consultations: number;
  color: string;
}

export interface HourlyTrend {
  hour: string;
  consultations: number;
  revenue: number;
}

export interface DailyTrendPoint {
  date: string;
  revenue: number;
  consultations: number;
  newPatients: number;
  followUps: number;
}

export interface PaymentModeBreakdown {
  method: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface OPDDashboardData {
  revenue: RevenueBreakdown;
  consultationStats: ConsultationStats;
  doctorPerformance: DoctorPerformance[];
  medicineSales: MedicineSalesData[];
  labTests: LabTestData[];
  departmentRevenue: DepartmentWiseRevenue[];
  hourlyTrends: HourlyTrend[];
  dailyTrends: DailyTrendPoint[];
  paymentBreakdown: PaymentModeBreakdown[];
}

export interface OPDDashboardFilters {
  range: DateRangeKey;
  customFrom?: string;
  customTo?: string;
  department: string;
}