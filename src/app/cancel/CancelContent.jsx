"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  XCircle,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  LayoutDashboard,
  Home,
  HelpCircle,
  Sparkles,
  CreditCard
} from "lucide-react";
import Link from "next/link";

export default function CancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (canceled !== "true") {
      router.replace("/");
    }
  }, [canceled, router]);

  if (canceled !== "true") {
    return null;
  }
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: 45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 18,
        delay: 0.15,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 px-4 py-20 sm:px-6 sm:py-24 flex items-center justify-center transition-colors duration-500">
      {/* Background Ambient Lighting Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/15 blur-[130px] dark:bg-amber-600/10" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px] dark:bg-indigo-600/10" />
      <div className="pointer-events-none absolute left-10 bottom-10 h-72 w-72 rounded-full bg-slate-400/15 blur-[110px] dark:bg-slate-700/10" />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Animated Icon Badge with Pulse Glow */}
          <motion.div variants={itemVariants} className="relative mb-6">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-amber-400/30 blur-sm dark:bg-amber-500/20"
            />

            <motion.div
              variants={badgeVariants}
              className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white shadow-2xl shadow-amber-500/25 ring-4 ring-white/60 dark:ring-slate-900/60"
            >
              <XCircle className="h-12 w-12 stroke-[2.5]" />
            </motion.div>
          </motion.div>

          {/* Title & Headline */}
          <motion.div variants={itemVariants} className="space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/70 px-4 py-1 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/60 dark:text-amber-300">
              <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400" />
              <span>Checkout Canceled • No Charges Made</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Payment Not Completed
            </h1>
            <p className="max-w-md text-slate-600 sm:text-base dark:text-slate-300/80 leading-relaxed">
              No worries! You canceled the payment process. Your payment method has not been charged, and your account remains unchanged.
            </p>
          </motion.div>

          {/* Information & Reassurance Card */}
          <motion.div
            variants={itemVariants}
            className="w-full rounded-3xl border border-amber-100/80 bg-white/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 text-left space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              What Happens Next?
            </h3>

            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mt-0.5">
                  <CreditCard size={15} />
                </div>
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">
                    Zero Charge
                  </strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    No funds were deducted from your card or account.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mt-0.5">
                  <Sparkles size={15} />
                </div>
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">
                    Starter Plan Active
                  </strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    You can still publish up to 3 organizations for free!
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-8 w-full space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-center sm:gap-4">
            <Link
              href="/pricing"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
            >
              <RotateCcw size={16} />
              Return to Pricing
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/dashboard"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <LayoutDashboard size={16} />
              Go to Dashboard
            </Link>
          </motion.div>

          {/* Support & Home Footer */}
          <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Home size={14} />
              Homepage
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
