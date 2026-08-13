// services/constant.ts
import {
  AlertTriangle,
  Boxes,
  Building2,
  ChartLine,
  LayoutDashboard,
  LucideIcon,
  Pill,
  ShoppingCart,
  Shuffle,
  Users,
  Warehouse,
} from "lucide-react";

// Login Page
export interface LoginFormData {
  email: string;
  password: string;
}

// ── Sidebar structure ──────────────────────────────────────────────
// Each module (Pharmacy, and future modules like OPD / IPD / Laboratory)
// renders as its own labelled group in the sidebar, matching the
// PharmaCore reference: an uppercase micro-label heading followed by
// its list of menu items.

export interface SidebarMenuOption {
  name: string;
  icon: LucideIcon;
  path: string;
  badge?: string | number;
  badgeVariant?: "default" | "danger";
}

export interface SidebarModule {
  moduleName: string;
  moduleIcon: LucideIcon;
  items: SidebarMenuOption[];
}

export const SidebarOptions: SidebarModule[] = [
  {
    moduleName: "Pharmacy",
    moduleIcon: Pill,
    items: [
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
        icon: ShoppingCart,
        path: "/pharmacy/purchases",
      },
      {
        name: "Inventory Master",
        icon: Warehouse,
        path: "/pharmacy/inventory",
      },
      {
        name: "Sales Master",
        icon: ChartLine,
        path: "/pharmacy/sales",
      },
      {
        name: "Expiry Medicines",
        icon: AlertTriangle,
        path: "/pharmacy/expiry-medicines",
      },
    ],
  },

  // ── Future modules go here ──────────────────────────────────────
  // Just add a new SidebarModule object below and it will automatically
  // render as its own grouped section with its own heading, e.g.:
  //
  // {
  //   moduleName: "OPD",
  //   moduleIcon: Stethoscope,
  //   items: [
  //     { name: "OPD Dashboard", icon: LayoutDashboard, path: "/opd/dashboard" },
  //     { name: "Appointments", icon: CalendarCheck, path: "/opd/appointments" },
  //   ],
  // },
];