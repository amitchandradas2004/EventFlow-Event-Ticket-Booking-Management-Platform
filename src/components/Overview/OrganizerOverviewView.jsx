"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  Loader2,
  Layers,
  ArrowRight,
  BarChart3,
  PieChart as PieIcon
} from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useSession } from "@/lib/auth-client";
import { getOrganizerStats } from "@/lib/actions/event";
import OverviewSkeleton from "@/components/Overview/OverviewSkeleton";

const STATUS_COLORS = {
  Approved: "#10b981", // Emerald
  Pending: "#f59e0b",  // Amber
  Rejected: "#ef4444"   // Rose
};

export default function OrganizerOverviewView() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!session?.user?.email) return;
      try {
        setLoading(true);
        const data = await getOrganizerStats(session.user.email);
        if (data?.success) {
          setStats(data);
        }
      } catch (err) {
        // console.error("Failed to load organizer stats:", err);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.email) {
      loadStats();
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  if (loading || sessionLoading) {
    return <OverviewSkeleton />;
  }

  const orgStats = stats?.orgStats || { total: 0, approved: 0, pending: 0, rejected: 0 };
  const eventStats = stats?.eventStats || { total: 0, approved: 0, pending: 0, rejected: 0 };

  const getPercentages = (statObj) => {
    const total = statObj.total || 1;
    const approvedPct = Math.round((statObj.approved / total) * 100) || 0;
    const pendingPct = Math.round((statObj.pending / total) * 100) || 0;
    const rejectedPct = Math.round((statObj.rejected / total) * 100) || 0;
    return { approvedPct, pendingPct, rejectedPct };
  };

  const eventPcts = getPercentages(eventStats);
  const orgPcts = getPercentages(orgStats);

  // Recharts Data Sets
  const barChartData = [
    {
      category: "Created Events",
      Approved: eventStats.approved,
      Pending: eventStats.pending,
      Rejected: eventStats.rejected
    },
    {
      category: "Organizations",
      Approved: orgStats.approved,
      Pending: orgStats.pending,
      Rejected: orgStats.rejected
    }
  ];

  const pieChartData = [
    { name: "Approved Events", value: eventStats.approved, color: "#10b981" },
    { name: "Pending Events", value: eventStats.pending, color: "#f59e0b" },
    { name: "Rejected Events", value: eventStats.rejected, color: "#ef4444" },
    { name: "Approved Orgs", value: orgStats.approved, color: "#059669" },
    { name: "Pending Orgs", value: orgStats.pending, color: "#d97706" },
    { name: "Rejected Orgs", value: orgStats.rejected, color: "#dc2626" }
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100">
              <Sparkles className="w-3.5 h-3.5" /> Organizer Dashboard Analytics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {session?.user?.name || "Organizer"}! 👋
            </h1>
            <p className="text-sm text-indigo-100/90 max-w-xl">
              Track your created events, organizations, and approval statuses in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/organizer/add-event"
              className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Create Event
            </Link>
          </div>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Events Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <Link
              href="/dashboard/organizer/events"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Manage Events <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {eventStats.total}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Total Created Events
            </p>
          </div>
        </motion.div>

        {/* Organizations Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Building2 className="w-6 h-6" />
            </div>
            <Link
              href="/dashboard/organizer/settings"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              Manage Orgs <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {orgStats.total}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Total Created Organizations
            </p>
          </div>
        </motion.div>
      </div>

      {/* RECHARTS VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recharts Bar Chart (2 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Status Comparison (Recharts)
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Events vs Organizations
            </span>
          </div>

          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "14px",
                    color: "#f8fafc",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                  }}
                  itemStyle={{ color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="Approved" fill={STATUS_COLORS.Approved} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Pending" fill={STATUS_COLORS.Pending} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Rejected" fill={STATUS_COLORS.Rejected} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recharts Pie Chart (1 Col) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Status Distribution
              </h3>
            </div>
          </div>

          <div className="w-full h-56 flex items-center justify-center">
            {pieChartData.length === 0 ? (
              <div className="text-center text-xs text-slate-400">No data available for chart</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick Legend Indicators */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Approved ({eventStats.approved + orgStats.approved})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Pending ({eventStats.pending + orgStats.pending})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Rejected ({eventStats.rejected + orgStats.rejected})</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* STATUS BREAKDOWN PROGRESS BARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. CREATED EVENTS STATUS BAR CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Created Events Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {eventStats.total} Total Events
            </span>
          </div>

          {/* Segmented Status Distribution Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
              <span>Status Breakdown</span>
              <span>100% Total</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5">
              {eventStats.total === 0 ? (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full" />
              ) : (
                <>
                  {eventStats.approved > 0 && (
                    <div
                      style={{ width: `${(eventStats.approved / eventStats.total) * 100}%` }}
                      className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                      title={`Approved: ${eventStats.approved}`}
                    />
                  )}
                  {eventStats.pending > 0 && (
                    <div
                      style={{ width: `${(eventStats.pending / eventStats.total) * 100}%` }}
                      className="h-full bg-amber-500 transition-all duration-500"
                      title={`Pending: ${eventStats.pending}`}
                    />
                  )}
                  {eventStats.rejected > 0 && (
                    <div
                      style={{ width: `${(eventStats.rejected / eventStats.total) * 100}%` }}
                      className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
                      title={`Rejected: ${eventStats.rejected}`}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Status Breakdown Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {/* Approved */}
            <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Approved
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{eventStats.approved}</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {eventPcts.approvedPct}% of total
              </p>
            </div>

            {/* Pending */}
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Pending
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{eventStats.pending}</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                {eventPcts.pendingPct}% of total
              </p>
            </div>

            {/* Rejected */}
            <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                Rejected
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{eventStats.rejected}</p>
              <p className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                {eventPcts.rejectedPct}% of total
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2. CREATED ORGANIZATIONS STATUS BAR CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Organizations Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {orgStats.total} Total Orgs
            </span>
          </div>

          {/* Segmented Status Distribution Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
              <span>Status Breakdown</span>
              <span>100% Total</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5">
              {orgStats.total === 0 ? (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full" />
              ) : (
                <>
                  {orgStats.approved > 0 && (
                    <div
                      style={{ width: `${(orgStats.approved / orgStats.total) * 100}%` }}
                      className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                      title={`Approved: ${orgStats.approved}`}
                    />
                  )}
                  {orgStats.pending > 0 && (
                    <div
                      style={{ width: `${(orgStats.pending / orgStats.total) * 100}%` }}
                      className="h-full bg-amber-500 transition-all duration-500"
                      title={`Pending: ${orgStats.pending}`}
                    />
                  )}
                  {orgStats.rejected > 0 && (
                    <div
                      style={{ width: `${(orgStats.rejected / orgStats.total) * 100}%` }}
                      className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
                      title={`Rejected: ${orgStats.rejected}`}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Status Breakdown Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {/* Approved */}
            <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Approved
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{orgStats.approved}</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {orgPcts.approvedPct}% of total
              </p>
            </div>

            {/* Pending */}
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Pending
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{orgStats.pending}</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                {orgPcts.pendingPct}% of total
              </p>
            </div>

            {/* Rejected */}
            <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                Rejected
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{orgStats.rejected}</p>
              <p className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                {orgPcts.rejectedPct}% of total
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <Link
          href="/dashboard/organizer/events"
          className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">View All Managed Events</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Edit, filter, or delete your events table.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/dashboard/organizer/settings"
          className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Manage Organizations</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">View & update organization settings.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
