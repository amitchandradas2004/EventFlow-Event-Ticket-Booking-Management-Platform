"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAdminAnalytics } from "@/lib/actions/user";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Ticket,
  Crown,
  RefreshCw,
  Sparkles,
  PieChart as PieIcon,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  UserX,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast from "react-hot-toast";

// Status Colors Palette
const EVENT_STATUS_COLORS = ["#10b981", "#f59e0b", "#ef4444"]; // Approved (Emerald), Pending (Amber), Rejected (Rose)
const USER_ROLE_COLORS = ["#6366f1", "#f59e0b", "#3b82f6"]; // Attendees (Indigo), Organizers (Amber), Admins (Blue)

// FULL PAGE SKELETON LOADER
function AdminAnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-96 bg-slate-200/70 dark:bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

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

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 space-y-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-56 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl" />
        </div>
        <div className="h-80 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 space-y-4">
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-56 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl" />
        </div>
      </div>

      {/* Lower Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 space-y-4">
          <div className="h-6 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-48 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl" />
        </div>
        <div className="h-72 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 space-y-4">
          <div className="h-6 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-48 w-full bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// Custom Chart Tooltips Component
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-xl text-xs space-y-1.5">
        <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span style={{ color: entry.color }} className="font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {entry.name.toLowerCase().includes("revenue") ? `$${entry.value.toFixed(2)}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    setLoading(true);
    getAdminAnalytics()
      .then((res) => {
        if (res?.success) {
          setData(res);
        } else {
          toast.error(res?.message || "Failed to load system analytics");
        }
      })
      .catch((err) => {
        console.error("Error loading analytics:", err);
        toast.error("Failed to load system analytics");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);
      getAdminAnalytics()
        .then((res) => {
          if (!isCancelled) {
            if (res?.success) {
              setData(res);
            } else {
              toast.error(res?.message || "Failed to load system analytics");
            }
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error("Error loading analytics:", err);
            toast.error("Failed to load system analytics");
            setLoading(false);
          }
        });
    }, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (loading || !data) {
    return <AdminAnalyticsSkeleton />;
  }

  const {
    summary = {},
    userRoles = {},
    eventStatusStats = {},
    orgStatusStats = {},
    eventCategories = [],
    monthlyTrend = [],
    topOrganizers = [],
  } = data;

  // Pie chart datasets
  const eventPieData = [
    { name: "Approved", value: eventStatusStats.approved || 0, color: "#10b981" },
    { name: "Pending", value: eventStatusStats.pending || 0, color: "#f59e0b" },
    { name: "Rejected", value: eventStatusStats.rejected || 0, color: "#ef4444" },
  ];

  const userPieData = [
    { name: "Attendees", value: userRoles.attendees || 0, color: "#6366f1" },
    { name: "Organizers", value: userRoles.organizers || 0, color: "#f59e0b" },
    { name: "Admins", value: userRoles.admins || 0, color: "#3b82f6" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={26} />
            System Analytics & Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time financial performance, revenue trends, platform usage, and moderation metrics.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Top Key Metrics Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Platform Revenue */}
        <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 backdrop-blur-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-300">
            ${Number(summary.totalRevenue || 0).toFixed(2)}
          </p>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400 pt-1">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Pro: ${Number(summary.premiumRevenue || 0).toFixed(0)}
            </span>
            <span>•</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              Tickets: ${Number(summary.ticketRevenue || 0).toFixed(0)}
            </span>
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/30 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 backdrop-blur-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Platform Users
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-indigo-950 dark:text-indigo-300">
            {summary.totalUsers}
          </p>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400 pt-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Active: {userRoles.active}
            </span>
            <span>•</span>
            <span className="text-rose-500 dark:text-rose-400 font-semibold">
              Blocked: {userRoles.blocked}
            </span>
          </div>
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
            {summary.totalOrgs}
          </p>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400 pt-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Approved: {orgStatusStats.approved || 0}
            </span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Pending: {orgStatusStats.pending || 0}
            </span>
          </div>
        </div>

        {/* Events Moderated */}
        <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/30 bg-purple-50/40 dark:bg-purple-950/20 p-5 backdrop-blur-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Events Moderated
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-purple-950 dark:text-purple-300">
            {summary.totalEvents}
          </p>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400 pt-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Approved: {eventStatusStats.approved || 0}
            </span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Pending: {eventStatusStats.pending || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Row (Monthly Growth Trend + Event Moderation Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue & Ticket Sales Trend */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Revenue & Ticket Sales Growth
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly revenue ($) and total ticket bookings over the last 6 months.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  name="Tickets Sold"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTickets)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Moderation Status Pie Chart */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon size={18} className="text-indigo-500" />
              Event Status Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of approved, pending, and rejected events.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Pills Summary */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-2">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">Approved</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{eventStatusStats.approved || 0}</p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-2">
              <p className="font-semibold text-amber-700 dark:text-amber-400">Pending</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{eventStatusStats.pending || 0}</p>
            </div>
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-2">
              <p className="font-semibold text-rose-700 dark:text-rose-400">Rejected</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{eventStatusStats.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Category Breakdown Bar Chart */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-purple-500" />
              Event Categories Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Popular event genres hosted across EventFlow.
            </p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventCategories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Events Count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Roles & Platform Health */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              User Roles & Account Demographics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Distribution of attendees, organizers, and active accounts.
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-2">
              <p className="font-semibold text-indigo-700 dark:text-indigo-400">Attendees</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{userRoles.attendees || 0}</p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-2">
              <p className="font-semibold text-amber-700 dark:text-amber-400">Organizers</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{userRoles.organizers || 0}</p>
            </div>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2">
              <p className="font-semibold text-blue-700 dark:text-blue-400">Admins</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{userRoles.admins || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Organizations Leaderboard */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              Top Active Organizations Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Organizations with the highest event creation volume on EventFlow.
            </p>
          </div>
        </div>

        {topOrganizers.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No organization records available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-5 py-3">Organization</th>
                  <th scope="col" className="px-5 py-3">Organizer Email</th>
                  <th scope="col" className="px-5 py-3 text-center">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Total Events</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {topOrganizers.map((org) => (
                  <tr key={org._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-sm shrink-0">
                        {org.organizationName?.charAt(0).toUpperCase() || "O"}
                      </div>
                      <span>{org.organizationName}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      {org.organizerEmail}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        org.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {org.status === 'approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {org.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-indigo-600 dark:text-indigo-400">
                      {org.eventCount} Events
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
