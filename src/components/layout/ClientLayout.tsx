"use client";

import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import FloatingElements from "@/components/ui/FloatingElements";
import { ClickSparkleProvider } from "@/components/ui/ConfettiBurst";
import Loader from "./Loader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <ClickSparkleProvider>
      <div className="grain-overlay" />
      <FloatingElements />
      <TopBar />
      <main className="pt-14 page-wrapper relative z-10">
        {children}
      </main>
      <BottomNav />
    </ClickSparkleProvider>
  );
}
