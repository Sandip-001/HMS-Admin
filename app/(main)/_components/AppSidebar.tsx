"use client";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarOptions } from "@/services/constant";

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar className="bg-white shadow-lg border-r w-64">
      {/* Logo + Owner Section */}
      <SidebarHeader className="flex flex-col justify-center items-center mt-3">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={100}
          height={100}
          className="w-[150px]"
        />
      </SidebarHeader>

      {/* Sidebar Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SidebarOptions.map((option, index) => {
                const isActive = path === option.path;
                return (
                  <SidebarMenuItem key={index} className="p-1">
                    <SidebarMenuButton
                      className={`p-5 ${
                        path == option.path && "bg-blue-100 rounded-lg"
                      }`}
                    >
                      <Link
                        href={option.path}
                        className="flex items-center w-full "
                      >
                        <option.icon
                          className={`mr-2 h-4 w-4 ${
                            isActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-[16px] font-medium ${
                            isActive ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          {option.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 text-center text-xs text-gray-400">
        © 2025 Your Company
      </SidebarFooter>
    </Sidebar>
  );
}
