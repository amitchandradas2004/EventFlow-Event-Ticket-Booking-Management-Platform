"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, Ticket, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
const defaultItems = [
  { label: "Home", href: "/", isActive: true },
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
const user = true;
export default function Navbar({
  brand = (
    <Link href="/" className="flex items-center gap-3">
      <motion.div
        whileHover={{
          rotate: 12,
          scale: 1.1,
        }}
        className="rounded-xl bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-500/30"
      >
        <Ticket size={20} />
      </motion.div>
      <span className="text-2xl font-bold tracking-tight">EventFlow</span>
    </Link>
  ),
  items = defaultItems,
  rightContent = (
    <>
      {user ? (
        <Link href="/register">
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="w-30 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/30 text-white"
          >
            Get Started
          </motion.button>
        </Link>
      ) : (
        <motion.button
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="rounded-full w-20 h-9 font-medium bg-red-500 hover:bg-red-600  text-white  shadow-md shadow-red-500/30"
        >
          Logout
        </motion.button>
      )}
      <div>
        <ThemeToggle />
      </div>
    </>
  ),
  className,
  maxWidth = "xl",
  position = "fixed",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={cn(
        "z-50 w-full px-2",
        position === "fixed" && "fixed top-2 ",
        position === "fixed" && "fixed top-4 left-0",
      )}
    >
      <header
        className={cn(
          "mx-auto flex h-12 items-center overflow-hidden justify-between rounded-2xl border border-white/20 bg-white/10 px-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40",
          maxWidthClasses[maxWidth],
          className,
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {brand}
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {items?.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "transition hover:text-primary",
                  item.isActive && "font-semibold text-primary",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 md:flex">{rightContent}</div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={cn(
            "mx-auto ml-5 mr-5 mt-1 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40",
            maxWidthClasses[maxWidth],
          )}
        >
          <ul className="space-y-4">
            {items?.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block text-black dark:text-white transition hover:text-primary",
                    item.isActive &&
                      "font-semibold text-primary text-black dark:text-white",
                  )}
                  onPress={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 border-t border-default-200 pt-5">
            {rightContent}
          </div>
        </div>
      )}
    </nav>
  );
}
