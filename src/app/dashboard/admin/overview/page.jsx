"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminOverview } from "@/lib/actions/user";
import { updateEventStatus } from "@/lib/actions/event";
import {
  LayoutDashboard,
  DollarSign,
  Calendar,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  BarChart3,
  UserCheck,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Check,
  X,
  Tag,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// SKELETON LOADER
function AdminOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 w-full" />

      {/* Top 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-3 w-40 bg-slate-200/70 dark:bg-slate-800/60 rounded-md" />
          </div>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 space-y-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="h-96 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 space-y-4">
          <div className="h-6 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchOverview = () => {
    setLoading(true);
    getAdminOverview()
      .then((res) => {
        if (res?.success) {
          setData(res);
        } else {
          toast.error(res?.message || "Failed to load dashboard overview");
        }
      })
      .catch((err) => {
        console.error("Error loading admin overview:", err);
        toast.error("Failed to load dashboard overview");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);
      getAdminOverview()
        .then((res) => {
          if (!isCancelled) {
            if (res?.success) {
              setData(res);
            } else {
              toast.error(res?.message || "Failed to load dashboard overview");
            }
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error("Error loading admin overview:", err);
            toast.error("Failed to load dashboard overview");
            setLoading(false);
          }
        });
    }, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const handleModeration = async (eventId, newStatus) => {
    try {
      setActionLoadingId(eventId);
      const res = await updateEventStatus(eventId, newStatus);
      if (res?.success) {
        toast.success(`Event ${newStatus} successfully!`);
        fetchOverview();
      } else {
        toast.error(res?.message || "Failed to update event status");
      }
    } catch (err) {
      console.error("Error updating event status:", err);
      toast.error("Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading || !data) {
    return <AdminOverviewSkeleton />;
  }

  const {
    summary = {},
    pendingEvents = [],
    recentTransactions = [],
  } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    if (num === 0) return "Free";
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-semibold">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Administrator 👋
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Here is your live platform overview. Monitor pending event approvals, active organizations, revenue totals, and system transactions.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/admin/events"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
            >
              <Clock size={15} />
              Events Queue ({summary.pendingEventsCount || 0})
            </Link>

            <Link
              href="/dashboard/admin/transactions"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <CreditCard size={15} />
              Transactions
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 backdrop-blur-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Total Platform Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-300">
            ${Number(summary.totalRevenue || 0).toFixed(2)}
          </p>
          <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={13} /> Stripe payments verified
          </p>
        </div>

        {/* Events */}
        <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/30 bg-purple-50/40 dark:bg-purple-950/20 p-5 backdrop-blur-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Total Events
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-purple-950 dark:text-purple-300">
            {summary.totalEvents || 0}
          </p>
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Clock size={13} /> {summary.pendingEventsCount || 0} Pending Approval
          </p>
        </div>

        {/* Organizations */}
        <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/30 bg-amber-50/40 dark:bg-amber-950/20 p-5 backdrop-blur-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Organizations
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Building2 size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-950 dark:text-amber-300">
            {summary.totalOrgs || 0}
          </p>
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={13} /> {summary.approvedOrgsCount || 0} Verified Active
          </p>
        </div>

        {/* Total Users */}
        <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/30 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 backdrop-blur-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Registered Users
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-indigo-950 dark:text-indigo-300">
            {summary.totalUsers || 0}
          </p>
          <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <UserCheck size={13} /> Attendees & Organizers
          </p>
        </div>
      </div>

      {/* Main Content Grid: Pending Moderation Action Center + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Pending Moderation Action Center */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" />
                  Events Pending Moderation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review and moderate newly created events requiring admin approval.
                </p>
              </div>

              <Link
                href="/dashboard/admin/events"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View Moderation Table
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pending Events List */}
            <div className="mt-4 space-y-3">
              {pendingEvents.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    All caught up!
                  </p>
                  <p className="text-xs">There are no pending events requiring approval.</p>
                </div>
              ) : (
                pendingEvents.map((evt) => (
                  <div
                    key={evt._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 transition-all hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Event Image / Placeholder */}
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700">
                        {evt.banner || evt.image ? (
                          <img
                            src={evt.banner || evt.image}
                            alt={evt.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <Calendar size={20} />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate" title={evt.title}>
                          {evt.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span>{formatDate(evt.date)}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(evt.price)}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[140px] text-slate-400" title={evt.organizerEmail}>
                            {evt.organizerEmail}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inline Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        disabled={actionLoadingId === evt._id}
                        onClick={() => handleModeration(evt._id, "approved")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <Check size={14} />
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={actionLoadingId === evt._id}
                        onClick={() => handleModeration(evt._id, "rejected")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/40 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom link bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Moderation queue helps maintain platform quality.</span>
            <Link
              href="/dashboard/admin/events"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open Full Moderation Table →
            </Link>
          </div>
        </div>

        {/* Right 1-Col: Recent Transactions Activity Stream */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt size={18} className="text-indigo-600 dark:text-indigo-400" />
                Recent Transactions
              </h3>

              <Link
                href="/dashboard/admin/transactions"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recentTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No recent transactions.</p>
              ) : (
                recentTransactions.map((txn) => (
                  <div
                    key={txn.id || txn.transactionId}
                    className="flex items-center justify-between rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 p-3.5 text-xs border border-slate-100 dark:border-slate-800/60"
                  >
                    <div className="min-w-0 space-y-0.5 pr-2">
                      <p className="font-semibold text-slate-900 dark:text-white truncate" title={txn.item}>
                        {txn.item}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate" title={txn.userEmail}>
                        {txn.userEmail}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(txn.amount)}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                        {txn.paymentStatus}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Platform Health Badge */}
          <div className="rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/50 p-4 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-indigo-900 dark:text-indigo-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
              <span>100% Health</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Database connection, Stripe Webhooks, and API services are running smoothly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
