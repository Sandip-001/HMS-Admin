"use client";

import React, { useEffect } from "react";
import DashboardProvider from "./provider";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { useAppSelector } from "../redux/hooks";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        >
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </motion.div>

        {/* Animated Text */}
        <motion.p
          className="text-lg font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Preparing your dashboard...
        </motion.p>
      </div>
    );
  }

  if (!user) return null;

  return <DashboardProvider>{children}</DashboardProvider>;
};

export default DashboardLayout;
