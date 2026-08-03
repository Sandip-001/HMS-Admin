"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "./redux/hooks";

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

 useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login"); // ✅ redirect to /login
    }
  }, [user, router]);

  if (user) return <p className="flex flex-col items-center justify-center h-screen">Redirecting to dashboard...</p>;
}

