"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Ticket, X, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import LogoutModal from "@/components/Modals/LogoutModal";

const defaultItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Pricing", href: "/pricing" },
];

const maxWidthClasses = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[1536px]",
  full: "max-w-full",
};

export default function Navbar({
  brand = (
    <Link href="/" className="flex items-center gap-2.5 group">
      <motion.div
        whileHover={{ rotate: 12, scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20"
      >
        <Ticket size={20} className="transition-transform group-hover:scale-110" />
      </motion.div>
      <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-100 dark:to-slate-200 bg-clip-text text-transparent">
        EventFlow
      </span>
    </Link>
  ),
  items = defaultItems,
  rightContent: customRightContent,
  className,
  maxWidth = "xl",
  position = "fixed",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      toast.success("Logged out successfully");
      setShowLogoutModal(false);
    } catch (err) {
      toast.error("Failed to sign out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = user
    ? items.some((i) => i.href === "/dashboard")
      ? items
      : [...items, { label: "Dashboard", href: "/dashboard" }]
    : items;

  const userRole = (user?.role || "attendee").toLowerCase();
  const profileHref = `/dashboard/${userRole}/profile`;

  const defaultRightContent = (
    <>
      {isPending ? (
        <div className="flex items-center gap-2 animate-pulse">
          <div className="h-8 w-16 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-9 w-24 rounded-full bg-slate-300/80 dark:bg-slate-700/80" />
        </div>
      ) : user ? (
        <div className="flex items-center gap-3">
          <Link
            href={profileHref}
            onClick={() => setIsMenuOpen(false)}
            title="View Profile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition cursor-pointer group"
          >
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-xs group-hover:scale-105 transition-transform">
              {user.name ? user.name.charAt(0) : <UserIcon size={12} />}
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 max-w-[120px] truncate hidden sm:inline-block transition-colors">
              {user.name || user.email}
            </span>
          </Link>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowLogoutModal(true)}
            className="rounded-full px-3.5 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/70 dark:border-red-900/40 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </motion.button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full px-4 h-9 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
            >
              Sign In
            </motion.button>
          </Link>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full px-4 h-9 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 transition cursor-pointer"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      )}
      <div className="hidden lg:flex items-center border-l border-slate-200 dark:border-slate-800 pl-2 ml-1">
        <ThemeToggle />
      </div>
    </>
  );

  const rightContent = customRightContent ?? defaultRightContent;

  return (
    <nav
      className={cn(
        "z-50 w-full px-3 sm:px-4",
        position === "fixed" && "fixed top-4 left-0 right-0",
      )}
    >
      <header
        className={cn(
          "mx-auto flex h-14 items-center justify-between rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 px-4 sm:px-6 shadow-lg shadow-slate-900/5 dark:shadow-black/30 backdrop-blur-xl transition-all",
          maxWidthClasses[maxWidth],
          className,
        )}
      >
        {/* Brand (Left Side) */}
        <div className="flex items-center">
          {brand}
        </div>

        {/* Desktop Navigation Segmented Pill (Large Devices) */}
        <ul className="hidden items-center gap-1 lg:flex bg-slate-100/80 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
          {navItems?.map((item) => {
            const isActive = item.isActive !== undefined ? item.isActive : pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 block whitespace-nowrap",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-white dark:bg-slate-900 shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Right Actions (Large Devices) */}
        <div className="hidden items-center gap-3 lg:flex">{rightContent}</div>

        {/* Mobile / Medium Right Controls (Small & Medium Devices) */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            className="p-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "mx-auto mt-2 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl lg:hidden",
              maxWidthClasses[maxWidth],
            )}
          >
            <ul className="space-y-1.5">
              {navItems?.map((item) => {
                const isActive = item.isActive !== undefined ? item.isActive : pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-100 dark:border-indigo-900/50"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              {rightContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </nav>
  );
}


