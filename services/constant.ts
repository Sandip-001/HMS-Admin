import {AlertTriangle, Boxes, Building2, ChartLine, CirclePile, LayoutDashboard, LucideIcon, Pill, Shuffle, Users, Warehouse} from "lucide-react";


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
    name: "Category Master",
    icon: Shuffle,
    path: "/pharmacy/categories",
  },
  {
    name: "Brand Master",
    icon: Building2,
    path: "/pharmacy/brands",
  },
  {
    name: "Supplier Master",
    icon: Users,
    path: "/pharmacy/suppliers",
  },
  {
    name: "Medicine Master",
    icon: Pill,
    path: "/pharmacy/medicines",
  },
  {
    name: "Batch Master",
    icon: Boxes,
    path: "/pharmacy/batches",
  },
  {
    name: "Purchase Master",
    icon: CirclePile,
    path: "/pharmacy/purchases",
  },
  {
    name: "Inventory Master",
    icon: Warehouse,
    path: "/pharmacy/inventory",
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
