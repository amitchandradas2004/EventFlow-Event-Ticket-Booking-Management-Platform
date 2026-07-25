"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 dark:bg-slate-950 py-10">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.15),transparent_35%)]" />

      {/* Floating Blob 1 */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-20 top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
      />

      {/* Floating Blob 2 */}
      <motion.div
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200/70 bg-white/80 p-10 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80"
      >
        {/* Icon */}
        <motion.div
          animate={{
            rotate: [-8, 8, -8],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10"
        >
          <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>

        <p className="mt-4 text-center leading-7 text-slate-600 dark:text-slate-400">
          An unexpected error occurred while loading this page. Please try again
          or return to the homepage.
        </p>

        {/* Optional Error Message */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 rounded-xl bg-slate-100 p-4 text-left text-sm text-red-600 dark:bg-slate-800 dark:text-red-400">
            {error?.message}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RotateCcw size={18} />
            Try Again
          </motion.button>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Home size={18} />
              Home
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-500">
          EventFlow • Event Booking Platform
        </p>
      </motion.div>
    </main>
  );
}
