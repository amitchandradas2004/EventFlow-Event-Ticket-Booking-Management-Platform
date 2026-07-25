"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, Crown, Edit3, Mail, ShieldAlert, ShieldCheck, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfileCard({ user, onUpdate, className = "" }) {
  const [showDemoModal, setShowDemoModal] = useState(false);

  if (!user) return null;

  const role = (user?.role || "attendee").toUpperCase();
  const isPremium = Boolean(user?.isPremium);
  const isBlocked = Boolean(user?.isBlocked);
  const isDemoUser = user?.email?.toLowerCase() === "demouser@gmail.com";

  const rawDate = user?.createdAt || user?.created_at || user?.joinedAt;
  const joinedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const handleUpdateClick = (e) => {
    if (isDemoUser) {
      setShowDemoModal(true);
    } else if (onUpdate) {
      onUpdate(e);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl transition-all ${className}`}
      >
        {/* Top Gradient Decorative Banner */}
        <div className="relative h-28 sm:h-36 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6">
          <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[2px]" />
          
          {/* Top Badges */}
          <div className="relative z-10 flex items-center justify-end gap-2">
            {isPremium && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/90 text-amber-950 px-3 py-1 text-xs font-bold shadow-md backdrop-blur-md">
                <Crown size={13} />
                <span>PRO MEMBER</span>
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-md backdrop-blur-md ${
                isBlocked
                  ? "bg-rose-500/90 text-white"
                  : "bg-emerald-500/90 text-white"
              }`}
            >
              {isBlocked ? <ShieldAlert size={13} /> : <ShieldCheck size={13} />}
              <span>{isBlocked ? "BLOCKED" : "ACTIVE"}</span>
            </span>
          </div>
        </div>

        {/* Main Profile Info Section */}
        <div className="relative px-6 pb-6 pt-0 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
            {/* Avatar Container */}
            <div className="relative">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user?.name || "User Avatar"}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-3xl">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={36} />}
                  </div>
                )}
              </div>
              {isPremium && (
                <div className="absolute bottom-1 right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-md border-2 border-white dark:border-slate-900">
                  <Crown size={14} />
                </div>
              )}
            </div>

            {/* Action Button: Update Information */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleUpdateClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-indigo-500/25 transition cursor-pointer self-start sm:self-auto"
            >
              <Edit3 size={16} />
              <span>Update Information</span>
            </motion.button>
          </div>

          {/* User Name & Role Header */}
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {user?.name || "Anonymous User"}
              </h2>
              <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 px-3 py-0.5 text-xs font-bold tracking-wider">
                {role}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 flex-wrap pt-0.5">
              <span className="flex items-center gap-1.5">
                <Mail size={15} className="text-slate-400 dark:text-slate-500" />
                <span>{user?.email}</span>
              </span>
              {rawDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-slate-400 dark:text-slate-500" />
                  <span>Joined {joinedDate}</span>
                </span>
              )}
            </div>
          </div>

          {/* Detail Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Account Role
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                {role}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Membership
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {isPremium ? (
                  <>
                    <Crown size={14} className="text-amber-500" />
                    <span>Premium Plan</span>
                  </>
                ) : (
                  <span>Standard Member</span>
                )}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Account Status
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {isBlocked ? (
                  <span className="text-rose-500">Blocked</span>
                ) : (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Verified Active</span>
                  </>
                )}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Joined Date
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar size={14} className="text-indigo-500" />
                <span>{joinedDate}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Demo User Restriction Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 z-10 space-y-5"
            >
              {/* Header Icon & Title */}
              <div className="flex items-center gap-3.5">
                <div className="rounded-2xl bg-amber-100 dark:bg-amber-950/60 p-3 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 shrink-0">
                  <ShieldAlert size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Demo Account Restricted
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Profile modification is disabled
                  </p>
                </div>
              </div>

              {/* Explanation Message */}
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 space-y-2">
                <p>
                  You are currently logged in as a <strong>Demo User</strong> (<code className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">demouser@gmail.com</code>).
                </p>
                <p>
                  To preserve shared demo data for other visitors testing the platform, editing account details is restricted on demo accounts. Please create a new account to test profile updates.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
                <Link
                  href="/register"
                  onClick={() => setShowDemoModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-semibold text-sm transition border border-indigo-200/80 dark:border-indigo-800/60 cursor-pointer text-center"
                >
                  Create New Account
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDemoModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-500/20 cursor-pointer text-center"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
