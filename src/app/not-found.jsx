"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  ArrowLeft,
  Ticket,
  Sparkles,
  Search,
  Compass,
  LayoutDashboard
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-23 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND GRADIENT & MESH ACCENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-60 pointer-events-none" />

      {/* AMBIENT GLOW ORBS */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl dark:from-indigo-600/30 dark:via-purple-600/30 dark:to-pink-600/20"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-pink-500/20 via-indigo-500/20 to-cyan-500/20 blur-3xl dark:from-pink-600/25 dark:via-indigo-600/25 dark:to-cyan-600/20"
      />

      {/* MAIN CONTAINER */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center space-y-8"
      >
        {/* TOP STATUS BADGE */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/60 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400" />
            </span>
            <span>404 • Page Off-Stage</span>
          </div>
        </motion.div>

        {/* HERO GRAPHIC BADGE */}
        <motion.div
          variants={itemVariants}
          animate={{
            y: [0, -10, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative group cursor-default"
        >
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl group-hover:opacity-60 transition duration-500" />
          <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-3xl border border-white/40 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 shadow-2xl backdrop-blur-2xl">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30">
              <Ticket className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse" />
            </div>
            <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md">
              !
            </span>
          </div>
        </motion.div>

        {/* 404 NUMERIC & HEADLINE */}
        <div className="space-y-3">
          <motion.h1
            variants={itemVariants}
            className="text-7xl sm:text-9xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-sm"
          >
            404
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            This Event Page Doesn't Exist
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-lg text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            The link you followed might be broken, the page has been removed, or the ticket listing has expired.
          </motion.p>
        </div>

        {/* ACTION BUTTONS */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer active:scale-97"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 active:scale-97 cursor-pointer"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* QUICK DESTINATIONS CARDS */}
        <motion.div
          variants={itemVariants}
          className="w-full pt-6 border-t border-slate-200/80 dark:border-slate-800/80"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Or explore these popular pages
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <Link
              href="/events"
              className="group p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 shadow-xs hover:shadow-md flex items-center gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Calendar size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Explore Events
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Discover trending concerts, tech, & sports
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="group p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-800 transition-all duration-300 shadow-xs hover:shadow-md flex items-center gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  My Dashboard
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  View tickets, orders, & organizer settings
                </p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* FOOTER BRANDING */}
        <motion.div variants={itemVariants} className="pt-2">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <Sparkles size={13} className="text-indigo-500" />
            <span>EventFlow • Ticket Booking Platform</span>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
