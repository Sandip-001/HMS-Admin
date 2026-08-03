// lib/admin/pharmacy/pharmacy-dashboard-data.ts
import type {
  CategorySalesSlice,
  DiseaseUsageSlice,
  ExpiryTimelinePoint,
  MedicineSalesItem,
  MonthlySalesPoint,
  PharmacyDashboardKpi,
  RevenueProfitPoint,
  StockStatusSlice,
  SupplierPurchasePoint,
} from "@/types/pharmacy/pharmacy-dashboard-types";

export const PHARMACY_KPI: PharmacyDashboardKpi = {
  totalSalesThisMonth: 486200,
  totalOrders: 1284,
  lowStockItems: 32,
  expiringSoonItems: 18,
};

export const MONTHLY_SALES: MonthlySalesPoint[] = [
  { month: "Feb", sales: 312000 },
  { month: "Mar", sales: 348000 },
  { month: "Apr", sales: 296000 },
  { month: "May", sales: 402000 },
  { month: "Jun", sales: 378000 },
  { month: "Jul", sales: 431000 },
  { month: "Aug", sales: 486200 },
];

export const CATEGORY_SALES: CategorySalesSlice[] = [
  { category: "Antibiotics", value: 128000, color: "#3b82f6" },
  { category: "Cardiac", value: 96000, color: "#8b5cf6" },
  { category: "Analgesics", value: 84000, color: "#f59e0b" },
  { category: "Vitamins & Supplements", value: 62000, color: "#10b981" },
  { category: "Diabetic Care", value: 58000, color: "#ec4899" },
  { category: "Others", value: 58200, color: "#94a3b8" },
];

export const TOP_SELLING_MEDICINES: MedicineSalesItem[] = [
  { medicineName: "Paracetamol 650mg", unitsSold: 4820 },
  { medicineName: "Azithromycin 500mg", unitsSold: 3960 },
  { medicineName: "Atorvastatin 20mg", unitsSold: 3540 },
  { medicineName: "Metformin 500mg", unitsSold: 3210 },
  { medicineName: "Pantoprazole 40mg", unitsSold: 2980 },
  { medicineName: "Amoxicillin 250mg", unitsSold: 2760 },
  { medicineName: "Cetirizine 10mg", unitsSold: 2540 },
  { medicineName: "Aspirin 75mg", unitsSold: 2380 },
  { medicineName: "Losartan 50mg", unitsSold: 2150 },
  { medicineName: "Vitamin D3 60k IU", unitsSold: 1980 },
];

export const LEAST_SELLING_MEDICINES: MedicineSalesItem[] = [
  { medicineName: "Colchicine 0.5mg", unitsSold: 48 },
  { medicineName: "Bromocriptine 2.5mg", unitsSold: 62 },
  { medicineName: "Terbinafine Cream", unitsSold: 74 },
  { medicineName: "Doxycycline 100mg", unitsSold: 88 },
  { medicineName: "Clindamycin Gel", unitsSold: 96 },
  { medicineName: "Ranitidine 150mg", unitsSold: 104 },
  { medicineName: "Domperidone 10mg", unitsSold: 118 },
  { medicineName: "Ondansetron 4mg", unitsSold: 132 },
  { medicineName: "Metronidazole 400mg", unitsSold: 146 },
  { medicineName: "Ibuprofen Gel", unitsSold: 158 },
];

export const REVENUE_PROFIT: RevenueProfitPoint[] = [
  { month: "Feb", revenue: 312000, profit: 84000 },
  { month: "Mar", revenue: 348000, profit: 96000 },
  { month: "Apr", revenue: 296000, profit: 78000 },
  { month: "May", revenue: 402000, profit: 118000 },
  { month: "Jun", revenue: 378000, profit: 104000 },
  { month: "Jul", revenue: 431000, profit: 132000 },
  { month: "Aug", revenue: 486200, profit: 148000 },
];

export const STOCK_STATUS: StockStatusSlice[] = [
  { status: "Available", count: 842, color: "#10b981" },
  { status: "Low Stock", count: 32, color: "#f59e0b" },
  { status: "Out of Stock", count: 14, color: "#ef4444" },
];

export const EXPIRY_TIMELINE: ExpiryTimelinePoint[] = [
  { bucket: "Next 30 Days", count: 8 },
  { bucket: "Next 60 Days", count: 6 },
  { bucket: "Next 90 Days", count: 4 },
];

export const DISEASE_USAGE: DiseaseUsageSlice[] = [
  { disease: "Diabetes", value: 26, color: "#3b82f6" },
  { disease: "Hypertension", value: 22, color: "#8b5cf6" },
  { disease: "Respiratory Infections", value: 18, color: "#f59e0b" },
  { disease: "Cardiac Disorders", value: 15, color: "#10b981" },
  { disease: "Gastro Disorders", value: 11, color: "#ec4899" },
  { disease: "Others", value: 8, color: "#94a3b8" },
];

export const SUPPLIER_PURCHASE: SupplierPurchasePoint[] = [
  { supplier: "MedPlus Distributors", amount: 186000 },
  { supplier: "Sun Pharma Supply Co.", amount: 154000 },
  { supplier: "Cipla Wholesale", amount: 128000 },
  { supplier: "Apollo Pharma Traders", amount: 96000 },
  { supplier: "Zydus Health Supplies", amount: 74000 },
];