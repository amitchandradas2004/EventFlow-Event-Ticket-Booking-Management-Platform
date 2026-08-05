"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { getUpdatedUser } from "@/lib/actions/user";
import {
  ShieldAlert,
  X,
  Mail,
  HelpCircle,
  Lock,
  Eye,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export default function BlockedUserGuard() {
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user;

  const [dbUser, setDbUser] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    async function checkUserStatus() {
      if (!sessionUser?.email) {
        setDbUser(null);
        setIsBlocked(false);
        return;
      }

      try {
        const user = await getUpdatedUser(sessionUser.email);
        if (user) {
          setDbUser(user);
          const blocked = user.isBlocked === true || user.status === "blocked";
          setIsBlocked(blocked);
        } else {
          const sessionBlocked = sessionUser.isBlocked === true || sessionUser.status === "blocked";
          setIsBlocked(sessionBlocked);
        }
      } catch (err) {
        console.error("Error checking user block status:", err);
        const sessionBlocked = sessionUser.isBlocked === true || sessionUser.status === "blocked";
        setIsBlocked(sessionBlocked);
      }
    }

    checkUserStatus();
    // Periodically re-check every 15 seconds to detect real-time block updates
    const interval = setInterval(checkUserStatus, 15000);
    return () => clearInterval(interval);
  }, [sessionUser?.email]);

  if (!isBlocked) {
    return null;
  }

  const adminContactEmail = "support@eventflow.com";

  return (
    <>
      {/* Sticky Top Banner */}
      {!bannerDismissed && (
        <div className="sticky z-60 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white px-4 py-2.5 shadow-lg border-b border-rose-700/50 backdrop-blur-md">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 font-medium">
              <div className="p-1 rounded-lg bg-white/20 shrink-0">
                <AlertTriangle size={15} className="text-amber-200" />
              </div>
              <span>
                <strong className="font-bold">Account Suspended:</strong> Your account is blocked by an admin. Interactive actions are disabled, but you can view your previous activity in read-only mode.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] backdrop-blur-xs transition cursor-pointer flex items-center gap-1"
              >
                <Lock size={12} /> View Details
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
                title="Dismiss Banner"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Account Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 overflow-y-auto mt-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
            />

            {/* Centered Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 0 }}
              className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-rose-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto"
            >
              {/* Close Icon */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Warning Header */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="relative">
                  <div className="w-18 h-18 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-500 shadow-xl shadow-rose-500/10">
                    <ShieldAlert size={40} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow">
                    <Lock size={12} />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 inline-block">
                    Account Blocked by Administrator
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Access Restricted
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Account: <strong className="text-slate-900 dark:text-white">{sessionUser?.email}</strong>
                  </p>
                </div>
              </div>

              {/* Status Breakdown Box */}
              <div className="space-y-3 text-xs">
                {/* Disabled Actions */}
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                    <Lock size={14} />
                    <span>Restricted Actions (Disabled):</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 pl-1">
                    <li>Booking new event tickets</li>
                    <li>Creating or editing events & organizations</li>
                    <li>Updating profile details</li>
                    <li>Making payments or subscriptions</li>
                  </ul>
                </div>

                {/* Allowed Read-Only Access */}
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <Eye size={14} />
                    <span>Allowed Read-Only Access:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    You can still view your <strong>previous activity</strong>, including past ticket bookings, entry codes, purchase history, and event records.
                  </p>
                </div>
              </div>

              {/* Contact Admin Information */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Mail size={14} className="text-indigo-500" />
                  <span>How to request unblocking?</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Please reach out directly to the platform administrator to appeal your account status:
                </p>
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`mailto:${adminContactEmail}?subject=Unblock%20Account%20Request%20-%20${encodeURIComponent(sessionUser?.email || "")}`}
                    className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {adminContactEmail} <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`mailto:${adminContactEmail}?subject=Unblock%20Account%20Request%20-%20${encodeURIComponent(sessionUser?.email || "")}`}
                  className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition cursor-pointer text-center"
                >
                  <Mail size={15} />
                  <span>Contact Admin to Unblock</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Eye size={15} />
                  <span>View Previous Activity</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
