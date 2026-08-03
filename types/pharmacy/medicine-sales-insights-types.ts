
export interface MedicineMonthlySales {
  month: string;
  unitsSold: number;
}

export interface MedicineSalesRecord {
  id: string;
  medicineName: string;
  genericName: string;
  brand: string;
  category: string;
  monthlySales: MedicineMonthlySales[];
}

export interface RankedMedicineItem {
  id: string;
  medicineName: string;
  genericName: string;
  brand: string;
  category: string;
  totalUnitsSold: number;
}