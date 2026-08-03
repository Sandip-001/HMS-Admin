"use client";
import { Bell, Mail, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logoutUser } from "@/app/redux/thunks/authThunks";

export default function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.auth);

  // Logout user
  const logout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  // Detect click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Greeting message
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 py-3 md:py-4 border-b bg-white sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div>
          <h1 className="text-lg md:text-xl font-bold">
            Hello {user?.username} 👋
          </h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            {getGreeting()}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search (desktop only) */}
        <div className="hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Icons */}
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-primary transition" />
        <Mail className="w-5 h-5 text-gray-600 cursor-pointer hover:text-primary transition" />

        {/* Profile Dropdown */}
        <div
          ref={dropdownRef}
          className="relative flex items-center gap-2 border rounded-lg px-2 md:px-3 py-1 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => setOpen(!open)}
        >
          {/* Circle with first letter */}
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold uppercase">
            {user?.username
              ? user.username.charAt(0)
              : user?.email?.charAt(0) || "U"}
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.email}</p>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />

          {open && (
            <div className="absolute right-0 top-12 w-40 bg-white border rounded-lg shadow-md animate-fade-in">
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
