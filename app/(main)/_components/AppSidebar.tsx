// app/(main)/_components/AppSidebar.tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { SidebarOptions } from "@/services/constant";
import { cn } from "@/lib/utils";

const MODULE_GRADIENTS: Record<string, string> = {
  OPD: "from-blue-500 to-cyan-500",
  IPD: "from-indigo-500 to-blue-600",
  ICU: "from-red-500 to-rose-600",
  Emergency: "from-orange-500 to-red-600",
  "Revenue Leakage": "from-amber-500 to-orange-600",
  Pharmacy: "from-emerald-500 to-teal-600",
};

const MODULE_ACCENT_TEXT: Record<string, string> = {
  OPD: "text-white",
  IPD: "text-white",
  ICU: "text-white",
  Emergency: "text-white",
  "Revenue Leakage": "text-white",
  Pharmacy: "text-white",
};

function getModuleGradient(moduleName: string) {
  return MODULE_GRADIENTS[moduleName] ?? "from-slate-500 to-slate-600";
}

function getModuleAccent(moduleName: string) {
  return MODULE_ACCENT_TEXT[moduleName] ?? "text-slate-600";
}

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar className="border-r border-slate-200/60 bg-gradient-to-b from-white via-white to-slate-50/50">
      {/* Logo Section */}
      <SidebarHeader className="border-b border-slate-100 px-4 py-0">
        <div className="flex h-[70px] items-center gap-3">
          <div className="relative grid h-10 w-10 flex-shrink-0 place-items-center overflow-hidden rounded-xl shadow-md shadow-blue-600/20 ring-1 ring-slate-100">
            <Image
              src="/logo1.png"
              alt="logo"
              width={100}
              height={100}
              className="h-10 w-10 object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold leading-tight text-slate-900">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Leads
              </span>
            </p>
            <p className="text-[12px] font-bold uppercase tracking-widest text-red-500">
              Health Care
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Scrollable menu area — scroll works, scrollbar hidden */}
      <SidebarContent
        className={cn(
          "gap-1 px-2 py-3",
          "[scrollbar-width:none]", // Firefox
          "[&::-webkit-scrollbar]:hidden", // Chrome/Safari/Edge
        )}
        style={{ msOverflowStyle: "none" }} // IE/legacy Edge
      >
        {SidebarOptions.map((module) => {
          const gradient = getModuleGradient(module.moduleName);
          const accent = getModuleAccent(module.moduleName);

          return (
            <SidebarGroup key={module.moduleName} className="py-1">
              <SidebarGroupLabel className="px-3 pb-1.5 pt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span className={cn("h-1.5 w-1.5 rounded-full bg-gradient-to-br", gradient)} />
                  {module.moduleName}
                </span>
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {module.items.map((option) => {
                    const isActive = path === option.path;

                    return (
                      <SidebarMenuItem key={option.path}>
                        <SidebarMenuButton
                          className={cn(
                            "group relative h-auto overflow-hidden rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r shadow-md shadow-slate-200/60"
                              : "hover:bg-slate-100/80",
                            isActive && gradient,
                          )}
                        >
                          {isActive ? (
                            <span
                              className={cn(
                                "absolute inset-0 bg-gradient-to-r opacity-[0.12]",
                                gradient,
                              )}
                            />
                          ) : null}

                          {isActive ? (
                            <span
                              className={cn(
                                "absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gradient-to-b",
                                gradient,
                              )}
                            />
                          ) : null}

                          <Link
                            href={option.path}
                            className="relative flex w-full items-center gap-2.5 cursor-pointer"
                          >
                            <span
                              className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                                isActive
                                  ? cn("bg-gradient-to-br text-white shadow-sm", gradient)
                                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700",
                              )}
                            >
                              <option.icon className="h-[15px] w-[15px]" />
                            </span>

                            <span
                              className={cn(
                                "truncate transition-colors",
                                isActive ? cn("font-semibold", accent) : "text-slate-600 group-hover:text-slate-900",
                              )}
                            >
                              {option.name}
                            </span>
                          </Link>
                        </SidebarMenuButton>

                        {option.badge !== undefined && (
                          <SidebarMenuBadge
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm",
                              option.badgeVariant === "danger"
                                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
                            )}
                          >
                            {option.badge}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* Footer — promo card + copyright */}
      <SidebarFooter className="p-3">
       
        <p className="mt-3 text-center text-[11px] text-slate-400">
          © 2026 Leads Health Care. All rights reserved.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}