"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Mail,
  Home,
  Check,
  PartyPopper,
  Zap,
  LayoutDashboard,
  CalendarDays
} from "lucide-react";
import Link from "next/link";

export default function SuccessContent({ sessionData }) {
  const {
    customerEmail,
    customerName,
    amountTotal,
    sessionId,
    paymentStatus = "paid",
  } = sessionData;

  const numericAmount = amountTotal > 100 ? amountTotal / 100 : (amountTotal || 49);
  const formattedAmount = numericAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

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

  const checkBadgeVariants = {
    hidden: { scale: 0, rotate: -60 },
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

  // Decorative floating confetti dots
  const confettiDots = [
    { top: "15%", left: "12%", color: "bg-emerald-400", delay: 0, duration: 4 },
    { top: "25%", right: "15%", color: "bg-indigo-400", delay: 0.5, duration: 5 },
    { top: "60%", left: "8%", color: "bg-purple-400", delay: 1, duration: 4.5 },
    { top: "70%", right: "10%", color: "bg-amber-400", delay: 0.3, duration: 3.8 },
    { top: "40%", left: "85%", color: "bg-teal-400", delay: 0.8, duration: 4.2 },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 dark:from-slate-950 dark:via-indigo-950/60 dark:to-slate-950 px-4 py-20 sm:px-6 sm:py-24 flex items-center justify-center transition-colors duration-500">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[130px] dark:bg-emerald-600/15" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px] dark:bg-indigo-600/15" />
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-purple-500/15 blur-[110px] dark:bg-purple-600/15" />

      {/* Floating Animated Confetti Dots */}
      {confettiDots.map((dot, idx) => (
        <motion.div
          key={idx}
          style={{ top: dot.top, left: dot.left, right: dot.right }}
          animate={{
            y: [-10, 15, -10],
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
          className={`pointer-events-none absolute h-3 w-3 rounded-full ${dot.color} blur-[1px] shadow-sm`}
        />
      ))}

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Animated Success Badge with Pulse Ring */}
          <motion.div variants={itemVariants} className="relative mb-6">
            {/* Outer Pulse Rings */}
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-emerald-400/40 blur-sm dark:bg-emerald-500/30"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute inset-0 rounded-full bg-indigo-400/30 blur-xs dark:bg-indigo-500/20"
            />

            {/* Core Check Icon */}
            <motion.div
              variants={checkBadgeVariants}
              className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-2xl shadow-emerald-500/30 ring-4 ring-white/60 dark:ring-slate-900/60"
            >
              <Check className="h-12 w-12 stroke-[3]" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-md ring-2 ring-white dark:ring-slate-900"
              >
                <Sparkles size={16} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Title & Subtitle */}
          <motion.div variants={itemVariants} className="space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-4 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
              <PartyPopper size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Payment Completed Successfully</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400">
                EventFlow Pro!
              </span>
            </h1>
            <p className="max-w-md text-slate-600 sm:text-lg dark:text-slate-300/80 leading-relaxed">
              Your order has been confirmed. Lifetime Pro access is now active on your account!
            </p>
          </motion.div>

          {/* Receipt & Order Summary Card */}
          <motion.div
            variants={itemVariants}
            className="w-full rounded-3xl border border-indigo-100/80 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl dark:border-indigo-500/20 dark:bg-slate-900/80 text-left space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Receipt size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Order Summary
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transaction ID: <span className="font-mono text-slate-700 dark:text-slate-300">{sessionId ? `${sessionId.slice(0, 16)}...` : "N/A"}</span>
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {paymentStatus.toUpperCase()}
              </span>
            </div>

            {/* Line Item Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-800/50">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium mb-1">
                  Purchased Plan
                </span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Pro Organizer Lifetime Deal
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  One-time payment • Lifetime access
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-800/50">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium mb-1">
                  Amount Paid
                </span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white block">
                  {formattedAmount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  USD
                </span>
              </div>
            </div>

            {/* Email Notification Note */}
            {customerEmail && (
              <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/60 p-4 text-xs text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800/50">
                <Mail size={18} className="shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                <div>
                  A confirmation receipt and invoice details have been sent to{" "}
                  <strong className="font-semibold text-slate-900 dark:text-white">{customerEmail}</strong>.
                </div>
              </div>
            )}

            {/* Unlocked Pro Features Checklist */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
                Unlocked Pro Benefits:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>Unlimited Organizations Publish</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>Unlimited Custom Ticket Tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>Featured Homepage Placement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>24/7 Priority Support</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-8 w-full space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-center sm:gap-4">
            <Link
              href="/dashboard"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/events"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <CalendarDays size={18} />
              Explore Events
            </Link>
          </motion.div>

          {/* Footer Return Link */}
          <motion.div variants={itemVariants} className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              <Home size={14} />
              Return to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
