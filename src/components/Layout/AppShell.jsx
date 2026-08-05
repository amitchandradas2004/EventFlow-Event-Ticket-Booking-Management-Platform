"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ScrollProgressBar from "@/components/Layout/ScrollProgressBar";
import BlockedUserGuard from "@/components/BlockedUserGuard";

export function AppShell({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      <ScrollProgressBar />
      <BlockedUserGuard />
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}

