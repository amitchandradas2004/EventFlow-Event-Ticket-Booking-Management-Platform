"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  DollarSign,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  User,
  Mail,
  ShieldCheck,
  QrCode,
  MapPin,
  CreditCard,
  BarChart3,
  PieChart as PieIcon,
  ArrowRight,
  Layers,
  Receipt
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
import { authClient } from "@/lib/auth-client";
import { getUserBookings } from "@/lib/actions/booking";
import { getUserPayments } from "@/lib/actions/payment";
import AttendeeOverviewSkeleton from "@/components/Overview/AttendeeOverviewSkeleton";

const CATEGORY_COLORS = {
  General: "#6366f1",     // Indigo
  Music: "#ec4899",       // Pink
  Tech: "#06b6d4",        // Cyan
  Conference: "#8b5cf6",  // Purple
  Workshop: "#f59e0b",    // Amber
  Sports: "#10b981",      // Emerald
  Arts: "#ef4444",        // Rose
  Other: "#64748b"        // Slate
};

export default function AttendeeOverviewView() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendeeData() {
      if (!user?.email) return;
      try {
        setLoading(true);
        const [bookingsRes, paymentsRes] = await Promise.all([
          getUserBookings(user.email, 1, 100),
          getUserPayments(user.email, 1, 100)
        ]);

        if (bookingsRes?.success) {
          setBookings(bookingsRes.result || []);
        }
        if (paymentsRes?.success) {
          setPayments(paymentsRes.result || []);
        }
      } catch (err) {
        console.error("Failed to load attendee overview data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.email) {
      loadAttendeeData();
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [user?.email, sessionLoading]);

  if (loading || sessionLoading) {
    return <AttendeeOverviewSkeleton />;
  }

  // Calculated Metrics
  const now = new Date();
  const totalBookings = bookings.length;
  const totalSpent = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalSeats = bookings.reduce((sum, b) => sum + (Number(b.quantity) || 1), 0);

  const upcomingBookings = bookings.filter((b) => {
    const eventDate = b.eventDate ? new Date(b.eventDate) : null;
    return eventDate ? eventDate >= now : true;
  }).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

  const nextUpcomingEvent = upcomingBookings[0] || null;

  // Monthly Activity Chart Data
  const monthlyDataMap = {};
  bookings.forEach((b) => {
    const date = b.eventDate ? new Date(b.eventDate) : new Date(b.bookedAt || Date.now());
    const monthKey = date.toLocaleDateString("en-US", { month: "short" });
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = { month: monthKey, Tickets: 0, Spent: 0 };
    }
    monthlyDataMap[monthKey].Tickets += Number(b.quantity) || 1;
    monthlyDataMap[monthKey].Spent += Number(b.totalPrice) || 0;
  });

  const barChartData = Object.values(monthlyDataMap).length > 0
    ? Object.values(monthlyDataMap)
    : [
        { month: "Jan", Tickets: 0, Spent: 0 },
        { month: "Feb", Tickets: 0, Spent: 0 },
        { month: "Mar", Tickets: 0, Spent: 0 },
        { month: "Apr", Tickets: 0, Spent: 0 }
      ];

  // Category Breakdown Data
  const categoryMap = {};
  bookings.forEach((b) => {
    const cat = b.category || "General";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const pieChartData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
    color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other
  }));

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AT";

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner & Attendee Profile Summary */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* User Avatar */}
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "Attendee Avatar"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-lg shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white text-xl sm:text-2xl font-extrabold shadow-lg shrink-0">
                {userInitials}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md text-[11px] font-bold text-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" /> Verified Attendee Account
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || "Attendee"}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/90 font-medium flex items-center gap-2">
                <Mail size={14} className="text-indigo-300 shrink-0" />
                <span>{user?.email || "attendee@eventflow.com"}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-stretch sm:self-auto justify-start">
            <Link
              href="/events"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" /> Browse Events
            </Link>
            <Link
              href="/dashboard/attendee/bookings"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl border border-indigo-400/30 shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Ticket className="w-4 h-4" /> My Wallet
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Booked Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Ticket className="w-6 h-6" />
            </div>
            <Link
              href="/dashboard/attendee/bookings"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Wallet <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalBookings}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Total Ticket Bookings
            </p>
          </div>
        </motion.div>

        {/* Card 2: Total Amount Spent */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <Link
              href="/dashboard/attendee/payments"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ${totalSpent.toFixed(2)}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Total Amount Spent
            </p>
          </div>
        </motion.div>

        {/* Card 3: Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
              Scheduled
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {upcomingBookings.length}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Upcoming Events
            </p>
          </div>
        </motion.div>

        {/* Card 4: Total Seats Reserved */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300">
              Passes
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalSeats}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Total Reserved Seats
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. Attendees Profile Details & Next Event Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Attendee Full Details Profile Card (1 Col) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Attendee Details
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                Active Member
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Full Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{user?.name || "N/A"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Account Email</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">{user?.email || "N/A"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-500 font-medium">User Role</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px]">
                  {user?.role || "Attendee"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payment Provider</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CreditCard size={13} /> Stripe Secure
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/attendee/profile"
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <User size={14} />
            <span>Manage Profile Settings</span>
          </Link>
        </motion.div>

        {/* Next Upcoming Event Spotlight (2 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Next Upcoming Event Pass
              </h3>
            </div>
            <Link
              href="/dashboard/attendee/bookings"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {nextUpcomingEvent ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50 dark:from-indigo-950/40 dark:to-slate-800/40 border border-indigo-200/60 dark:border-indigo-800/50">
              {/* Event Image Banner */}
              <div className="relative h-36 sm:h-40 w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                {nextUpcomingEvent.eventBanner ? (
                  <img
                    src={nextUpcomingEvent.eventBanner}
                    alt={nextUpcomingEvent.eventTitle}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <Calendar className="h-10 w-10" />
                  </div>
                )}
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-amber-400 font-mono text-[10px] font-extrabold backdrop-blur-md">
                  {nextUpcomingEvent.ticketCode || "CONFIRMED"}
                </span>
              </div>

              {/* Event Details */}
              <div className="sm:col-span-2 space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-indigo-600 text-white font-bold text-[10px] rounded uppercase">
                    {nextUpcomingEvent.category || "General Admission"}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                    {nextUpcomingEvent.eventTitle}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="font-semibold truncate">
                      {nextUpcomingEvent.eventDate
                        ? new Date(nextUpcomingEvent.eventDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        : "TBA"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="truncate">{nextUpcomingEvent.location || "Online"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-indigo-200/60 dark:border-indigo-800/40">
                  <span className="text-slate-500">Reserved Seats: <strong>{nextUpcomingEvent.quantity || 1} Ticket(s)</strong></span>
                  <Link
                    href="/dashboard/attendee/bookings"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-500 transition cursor-pointer"
                  >
                    <QrCode size={13} /> View Pass
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Ticket size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Upcoming Events Scheduled</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Explore concerts, tech summits, and workshops available now.</p>
              </div>
              <Link
                href="/events"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition"
              >
                Browse & Book Events
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* 4. RECHARTS VISUALIZATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recharts Bar Chart: Monthly Activity (2 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Booking & Spending Activity
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Recharts Analytics
            </span>
          </div>

          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
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
                <Bar dataKey="Tickets" fill="#6366f1" radius={[6, 6, 0, 0]} name="Tickets Booked" />
                <Bar dataKey="Spent" fill="#10b981" radius={[6, 6, 0, 0]} name="Amount Spent ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recharts Pie Chart: Category Distribution (1 Col) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ticket Category Breakdown
              </h3>
            </div>
          </div>

          <div className="w-full h-56 flex items-center justify-center">
            {pieChartData.length === 0 ? (
              <div className="text-center text-xs text-slate-400">No ticket category data yet</div>
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

          {/* Category Legend Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieChartData.length > 0 ? (
              pieChartData.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name} ({cat.value})</span>
                </div>
              ))
            ) : (
              <span className="text-slate-400 col-span-2 text-center text-[11px]">Book tickets to build your category breakdown</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* 5. Recent Ticket Activity Preview Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-md backdrop-blur-xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Ticket Activity
            </h3>
          </div>
          <Link
            href="/dashboard/attendee/bookings"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Go to Ticket Wallet <ArrowRight size={14} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
            No ticket bookings found. Explore upcoming events to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Event Title</th>
                  <th className="px-4 py-3">Ticket Code</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {b.eventTitle}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-amber-600 dark:text-amber-400 font-extrabold">
                      {b.ticketCode || "CONFIRMED"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {b.eventDate ? new Date(b.eventDate).toLocaleDateString() : "TBA"}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-semibold">
                      {b.quantity || 1} Ticket(s)
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                      {b.totalPrice > 0 ? `$${Number(b.totalPrice).toFixed(2)}` : "Free"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* 6. Quick Dashboard Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <Link
          href="/dashboard/attendee/bookings"
          className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Digital Ticket Wallet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">View entry QR passes, print tickets, or filter bookings.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/dashboard/attendee/payments"
          className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Payment History & Receipts</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track spend, download Stripe payment receipts, and view logs.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
