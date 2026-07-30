"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Globe,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Receipt,
  Settings,
  ShieldCheck,
  Ticket,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ThemeToggle } from "@/components/Navbar/ThemeToggle";
import LogoutModal from "@/components/Modals/LogoutModal";

const roleNavItems = {
  attendee: [
    { label: "Overview Stats", href: "/dashboard/attendee/overview", icon: LayoutDashboard },
    { label: "Profile Update", href: "/dashboard/attendee/profile", icon: User },
    { label: "Booking History", href: "/dashboard/attendee/bookings", icon: Ticket },
    { label: "Payment History", href: "/dashboard/attendee/payments", icon: CreditCard },
  ],
  organizer: [
    { label: "Overview", href: "/dashboard/organizer/overview", icon: LayoutDashboard },
    { label: "Profile Update", href: "/dashboard/organizer/profile", icon: User },
    { label: "Manage Events", href: "/dashboard/organizer/events", icon: Calendar },
    { label: "Add Event", href: "/dashboard/organizer/add-event", icon: PlusCircle },
    { label: "Organization Settings", href: "/dashboard/organizer/settings", icon: Settings },
  ],
  admin: [
    { label: "Platform Overview", href: "/dashboard/admin/overview", icon: LayoutDashboard },
    { label: "Profile Update", href: "/dashboard/admin/profile", icon: User },
    { label: "User Management", href: "/dashboard/admin/users", icon: Users },
    { label: "Event Moderation", href: "/dashboard/admin/events", icon: ShieldCheck },
    { label: "Transaction History", href: "/dashboard/admin/transactions", icon: Receipt },
    { label: "System Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  ],
};

const roleBadgeColors = {
  attendee: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50",
  organizer: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
  admin: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/50",
};

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = (user?.role || "attendee").toLowerCase();
  const navItems = roleNavItems[role] || roleNavItems.attendee;

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      toast.success("Logged out successfully");
      setShowLogoutModal(false);
      router.push("/login");
    } catch (err) {
      toast.error("Failed to sign out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // if (isPending) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
  //       <div className="flex flex-col items-center gap-3">
  //         <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
  //         <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading Dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!session) {
    return null;
  }

  const sidebarContent = (
    <div className="flex flex-col min-h-full justify-between p-4 space-y-6">
      {/* Top Header & Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 text-white shadow-md shadow-indigo-500/25">
              <Ticket size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-100 dark:to-slate-200 bg-clip-text text-transparent">
              EventFlow
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* User Card */}
        <Link
          href={`/dashboard/${role}/profile`}
          onClick={() => setMobileOpen(false)}
          title="View Profile"
          className="rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 p-3.5 border border-slate-200/60 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800/50 flex items-center gap-3 transition cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate transition-colors">
              {user?.name || "User"}
            </p>
            <span
              className={cn(
                "inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border mt-1",
                roleBadgeColors[role] || roleBadgeColors.attendee
              )}
            >
              {role}
            </span>
          </div>
        </Link>

        {/* Dashboard Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <Icon size={18} className={cn(isActive ? "text-white" : "text-slate-500 dark:text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Main Site Links */}
        <div className="pt-2">
          <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Main Site Routes
          </p>
          <div className="grid grid-cols-3 gap-1.5 px-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/50 dark:border-slate-700/50 transition cursor-pointer"
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/50 dark:border-slate-700/50 transition cursor-pointer"
            >
              <Calendar size={14} />
              <span>Events</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/50 dark:border-slate-700/50 transition cursor-pointer"
            >
              <CreditCard size={14} />
              <span>Pricing</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Actions: Back to Website & Logout */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Link href="/" className="block" onClick={() => setMobileOpen(false)}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer shadow-xs"
          >
            <Home size={18} />
            <span>Back to Main Website</span>
          </motion.div>
        </Link>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-900/50 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all cursor-pointer shadow-xs"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Main Content & Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-600 p-1.5 text-white">
              <Ticket size={18} />
            </div>
            <span className="font-bold tracking-tight text-lg">EventFlow</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            aria-label="Toggle Dashboard Sidebar Menu"
          >
            <span>Menu</span>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 z-50 lg:hidden border-r border-slate-200 dark:border-slate-800 overflow-y-auto shadow-2xl"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}
