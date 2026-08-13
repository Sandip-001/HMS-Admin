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

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      {/* Logo Section — 70px header, matches PharmaCore reference */}
      <SidebarHeader className="border-b border-slate-100 px-4 py-0">
        <div className="flex h-[70px] items-center gap-3">
          <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl shadow-sm shadow-blue-600/30">
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
              <span className="text-blue-600">Leads</span>
            </p>
            <p className="text-[12px] font-bold uppercase tracking-widest text-red-500">
              Health Care
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Menu — one grouped section per module */}
      <SidebarContent className="px-2 py-3 gap-1">
        {SidebarOptions.map((module) => (
          <SidebarGroup key={module.moduleName} className="py-1">
            <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {module.moduleName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {module.items.map((option) => {
                  const isActive = path === option.path;
                  return (
                    <SidebarMenuItem key={option.path}>
                      <SidebarMenuButton
                        className={`h-auto rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                        path == option.path && "bg-blue-100"
                      }`}
                      >
                        <Link
                          href={option.path}
                          className="flex w-full items-center gap-2.5 cursor-pointer"
                        >
                          <option.icon
                            className={cn(
                              "h-[17px] w-[17px] flex-shrink-0",
                              isActive ? "text-blue-600" : "text-slate-500"
                            )}
                          />
                          <span
                            className={cn(
                              "truncate",
                              isActive ? "text-blue-600" : "text-slate-700"
                            )}
                          >
                            {option.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      {option.badge !== undefined && (
                        <SidebarMenuBadge
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            option.badgeVariant === "danger"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
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
        ))}
      </SidebarContent>

      {/* Footer — promo card + copyright, matches PharmaCore reference
      <SidebarFooter className="p-3">
        <div className="rounded-xl bg-slate-900 p-4 text-white">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            SYSTEM INSIGHTS
          </p>
          <p className="mt-1.5 text-sm font-semibold">More modules coming soon</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            OPD, IPD, Laboratory and Billing modules will appear here as new sections.
          </p>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-400">
          © 2025 Your Company
        </p>
      </SidebarFooter> */}
    </Sidebar>
  );
}