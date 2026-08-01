"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Zap,
  X,
  PartyPopper,
  LockKeyhole,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Pricing({ searchParams = {} }) {
  const canceled = searchParams?.canceled;

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and checkout when you\'re ready.'
    )
  }
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const handleFreeClick = () => {
    setIsFreeModalOpen(true);
  };

  const handlePremiumClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      setIsCheckoutModalOpen(true);
    }
  };

  const handleRedirectHome = () => {
    setIsFreeModalOpen(false);
    router.push("/");
  };

  const handleRedirectLogin = () => {
    setIsLoginModalOpen(false);
    router.push("/login");
  };

  const handleRedirectRegister = () => {
    setIsLoginModalOpen(false);
    router.push("/register");
  };

  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-slate-100 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 px-4 py-16 sm:px-6 sm:py-20 md:py-28 transition-colors duration-500"
    >
      {/* Background ambient lighting glows */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-400/30 blur-[100px] sm:h-96 sm:w-140 sm:blur-[130px] dark:bg-indigo-600/20" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-[90px] dark:bg-indigo-900/20" />
      <div className="pointer-events-none absolute -right-10 top-1/3 h-72 w-72 rounded-full bg-slate-400/20 blur-[100px] dark:bg-slate-700/20" />

      <div className="relative mx-auto container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-100/60 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 backdrop-blur-md dark:border-indigo-500/30 dark:bg-indigo-900/40 dark:text-indigo-300 transition-colors duration-500">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            Simple & Transparent Pricing
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white transition-colors duration-500">
            Pay once, use{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-slate-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-indigo-300 dark:to-slate-300">
              forever
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg dark:text-slate-300/80 transition-colors duration-500">
            No recurring monthly subscriptions. Choose your plan with a single one-time payment for lifetime access.
          </p>

          {/* One-Time Payment Highlight Pill */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-xs dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Zap size={14} className="fill-emerald-500 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
            <span>One-Time Lifetime Access • No Subscriptions</span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto items-stretch"
        >
          {/* Static Card 1: Free Plan ($0) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group relative flex flex-col justify-between rounded-3xl border border-indigo-100/80 bg-white/70 backdrop-blur-xl p-7 sm:p-9 shadow-lg hover:shadow-xl dark:border-indigo-500/20 dark:bg-slate-900/60 dark:shadow-none transition-all duration-300"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300">
                  Free Plan
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Always $0</span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                Starter
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed">
                Ideal for individuals, attendees, and small organizers starting their event journey.
              </p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  $0
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  / Free Forever
                </span>
              </div>

              {/* Features List */}
              <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-4">
                  Included Features:
                </p>
                <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-200">
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>
                      <strong className="font-semibold text-slate-900 dark:text-white">3 Organizations</strong> publish limit
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>Standard event creation & ticketing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>Digital QR ticket & email delivery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>Basic attendee registration metrics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>Standard community & email support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={handleFreeClick}
                className="w-full rounded-2xl border border-indigo-200 bg-white py-3.5 px-4 text-center text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-indigo-500/30 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-indigo-400 dark:hover:bg-slate-800 hover:shadow-md cursor-pointer"
              >
                Get Started Free
              </button>
            </div>
          </motion.div>

          {/* Static Card 2: Premium Plan ($49) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group relative flex flex-col justify-between rounded-3xl border-2 border-indigo-500 bg-white/90 backdrop-blur-xl p-7 sm:p-9 shadow-2xl dark:border-indigo-500 dark:bg-slate-900/90 transition-all duration-300"
          >
            {/* Glowing border background ring */}
            <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300" />

            {/* Popular Badge */}
            <div className="absolute -top-4 right-8 z-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1.5">
              <Sparkles size={13} className="animate-pulse" />
              Most Popular
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/80 dark:text-indigo-300">
                  Pro Organizer
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Lifetime Deal
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Premium Plan
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed">
                For active event organizers, agencies, and businesses demanding full scale.
              </p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  $49
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 border border-indigo-200/50 dark:border-indigo-800/50">
                  One-time payment
                </span>
              </div>

              {/* Features List */}
              <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
                  Everything in Free, plus:
                </p>
                <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-200">
                  {/* Highlighted key feature */}
                  <li className="flex items-start gap-3 rounded-xl bg-indigo-50/80 p-2.5 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-500/30">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500 mt-0.5">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Unlimited organizations publish
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>Unlimited event listings & custom ticket tiers</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>Featured homepage priority placement</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>Advanced sales analytics & exportable reports</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>0% platform commission fee discount</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mt-0.5">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span>24/7 Priority support & dedicated account manager</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="relative z-10 mt-8 pt-4">
              <button
                type="button"
                onClick={handlePremiumClick}
                className="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 py-3.5 px-4 text-center text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Get Lifetime Access ($49)
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Trust Note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-6"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
            No monthly fees or hidden subscriptions
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />
            Pay once, enjoy lifetime updates
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 size={16} className="text-indigo-600 dark:text-indigo-400" />
            Instant feature activation
          </span>
        </motion.div>
      </div>

      {/* Free Plan Activation Modal - Positioned inside Pricing component */}
      <AnimatePresence>
        {isFreeModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleRedirectHome}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-2xl dark:border-indigo-500/30 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={handleRedirectHome}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                  <PartyPopper size={32} />
                </div>

                <h3 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
                  Welcome to EventFlow! 🎉
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You are starting with our <strong className="font-semibold text-indigo-600 dark:text-indigo-400">$0 Free Starter Plan</strong>. You can now publish up to 3 organizations and explore all essential event management features!
                </p>

                <div className="mt-6 w-full space-y-3">
                  <button
                    type="button"
                    onClick={handleRedirectHome}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
                  >
                    Go to Homepage
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Plan Login Required Modal (Positioned inside Pricing component) */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-2xl dark:border-indigo-500/30 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                  <LockKeyhole size={30} />
                </div>

                <h3 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
                  Sign In Required
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Please sign in to your EventFlow account to purchase the <strong className="font-semibold text-indigo-600 dark:text-indigo-400">Premium Plan ($49 Lifetime)</strong> and publish unlimited organizations.
                </p>

                <div className="mt-6 w-full space-y-3">
                  <button
                    type="button"
                    onClick={handleRedirectLogin}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
                  >
                    <LogIn size={16} />
                    Sign In to Account
                  </button>

                  <button
                    type="button"
                    onClick={handleRedirectRegister}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 cursor-pointer"
                  >
                    <UserPlus size={16} />
                    Create New Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Plan Checkout Modal (Positioned inside Pricing component) */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-2xl dark:border-indigo-500/30 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/30">
                  <Sparkles size={32} />
                </div>

                <h3 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
                  Upgrade to Premium
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Welcome back, <strong className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name || user?.email}</strong>! Ready to activate lifetime access to <strong className="font-semibold text-slate-900 dark:text-white">Unlimited Organizations Publish</strong> for just $49?
                </p>

                <div className="mt-6 w-full space-y-3">
                  <form action="/api/checkout_session" method="POST" className="w-full">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
                    >
                      Proceed to Payment ($49)
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
