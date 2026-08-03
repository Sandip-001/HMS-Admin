import {AlertTriangle, ChartLine, CirclePile, LayoutDashboard, LucideIcon, Pill, Shuffle, Users} from "lucide-react";


//Login Page 
export interface LoginFormData {
  email: string;
  password: string;
}


// Sidebar Components

interface SidebarOption {
  name: string;
  icon: LucideIcon;
  path: string;
}

export const SidebarOptions:SidebarOption[] = [
  /*{
    name: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard",
  },*/
  {
    name: "Pharmacy Dashboard",
    icon: LayoutDashboard,
    path: "/pharmacy/dashboard",
  },
  {
    name: "Categories & Brands",
    icon: Shuffle,
    path: "/pharmacy/categories-brands",
  },
  {
    name: "Suppliers",
    icon: Users,
    path: "/pharmacy/suppliers",
  },
  {
    name: "Medicines",
    icon: Pill,
    path: "/pharmacy/medicines",
  },
  {
    name: "Stock Update",
    icon: CirclePile,
    path: "/pharmacy/stock-update",
  },
  {
    name: "Sales Insights",
    icon: ChartLine,
    path: "/pharmacy/sales-insights",
  },
  {
    name: "Expiry Medicines",
    icon: AlertTriangle,
    path: "/pharmacy/expiry-medicines",
  }
];
