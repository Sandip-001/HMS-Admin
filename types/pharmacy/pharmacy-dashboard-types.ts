
export interface MonthlySalesPoint {
  month: string;
  sales: number;
}

export interface CategorySalesSlice {
  category: string;
  value: number;
  color: string;
}

export interface MedicineSalesItem {
  medicineName: string;
  unitsSold: number;
}

export interface RevenueProfitPoint {
  month: string;
  revenue: number;
  profit: number;
}

export interface StockStatusSlice {
  status: "Available" | "Low Stock" | "Out of Stock";
  count: number;
  color: string;
}

export interface ExpiryTimelinePoint {
  bucket: "Next 30 Days" | "Next 60 Days" | "Next 90 Days";
  count: number;
}

export interface DiseaseUsageSlice {
  disease: string;
  value: number;
  color: string;
}

export interface SupplierPurchasePoint {
  supplier: string;
  amount: number;
}

export interface PharmacyDashboardKpi {
  totalSalesThisMonth: number;
  totalOrders: number;
  lowStockItems: number;
  expiringSoonItems: number;
}