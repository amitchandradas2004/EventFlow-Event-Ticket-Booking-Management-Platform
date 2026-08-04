"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { getUserBookings } from "@/lib/actions/booking";
import {
  Ticket,
  Calendar,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  QrCode,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  X,
  CreditCard,
  DollarSign,
  User,
  Building
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import BookingsSkeleton from "@/components/Bookings/BookingsSkeleton";

export default function AttendeeBookingsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'upcoming', 'past'

  // Ticket Detail Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadBookings() {
      if (!user?.email) return;
      try {
        setLoading(true);
        const data = await getUserBookings(user.email, page, 20);
        if (data?.success) {
          setBookings(data.result || []);
          setTotalBookings(data.total || 0);
          setTotalPages(data.totalPages || 1);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [user?.email, page]);

  // Filtering
  const now = new Date();
  const filteredBookings = bookings.filter((b) => {
    const eventDate = b.eventDate ? new Date(b.eventDate) : null;
    const matchesSearch =
      b.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ticketCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "upcoming") {
      return eventDate ? eventDate >= now : true;
    }
    if (activeTab === "past") {
      return eventDate ? eventDate < now : false;
    }

    return true;
  });

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Ticket size={14} className="text-indigo-400" /> My Digital Ticket Wallet
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Event Ticket Bookings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Access your confirmed event passes, QR codes, entry details, and transaction history.
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Sparkles size={15} />
          <span>Browse More Events</span>
        </Link>
      </div>

      {/* Toolbar: Search & Tab Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-md">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, location, or ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Tickets ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "past"
                ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Bookings Content */}
      {loading ? (
        <BookingsSkeleton cards={6} showHeader={false} />
      ) : filteredBookings.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-16 text-center backdrop-blur-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Ticket size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Booked Tickets Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {searchQuery
                ? "No ticket bookings matched your search terms."
                : "You haven't booked any event tickets yet. Explore upcoming concerts, workshops, and sports events."}
            </p>
          </div>
          <Link
            href="/events"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition cursor-pointer"
          >
            Explore Events & Book Now
          </Link>
        </div>
      ) : (
        /* Tickets Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBookings.map((b) => {
              const isPast = b.eventDate ? new Date(b.eventDate) < now : false;

              return (
                <motion.div
                  key={b._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    setSelectedBooking(b);
                    setIsModalOpen(true);
                  }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md hover:shadow-2xl transition-all duration-300 backdrop-blur-xl cursor-pointer"
                >
                  <div>
                    {/* Header Image Banner */}
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {b.eventBanner ? (
                        <img
                          src={b.eventBanner}
                          alt={b.eventTitle}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <Calendar className="h-10 w-10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                      {/* Ticket Code Badge */}
                      <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[11px] font-extrabold text-amber-400 backdrop-blur-md shadow-sm">
                        {b.ticketCode || "TKT-CONFIRMED"}
                      </span>

                      {/* Category Badge */}
                      <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-indigo-600/80 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                        {b.category || "General"}
                      </span>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-base font-bold line-clamp-1 group-hover:text-indigo-300 transition">
                          {b.eventTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="p-5 space-y-3">
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                          <span className="font-medium">
                            {b.eventDate
                              ? new Date(b.eventDate).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "TBA"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                          <span className="line-clamp-1">{b.location || "Online"}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Seats Booked:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {b.quantity || 1} {b.quantity > 1 ? "Tickets" : "Ticket"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Total Paid:</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            {b.totalPrice > 0 ? `$${Number(b.totalPrice).toFixed(2)}` : "Free"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="mx-5 mb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isPast
                          ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      <CheckCircle2 size={12} />
                      {isPast ? "Event Ended" : "Confirmed Pass"}
                    </span>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                    >
                      <QrCode size={14} /> View Pass
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-xs font-medium text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Ticket Pass Inspection Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsModalOpen(false);
                setSelectedBooking(null);
              }}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-sm transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Event Image Banner */}
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800">
                {selectedBooking.eventBanner ? (
                  <img
                    src={selectedBooking.eventBanner}
                    alt={selectedBooking.eventTitle}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <Calendar className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                    {selectedBooking.category || "General Admission"}
                  </span>
                  <h3 className="text-xl font-bold line-clamp-1">{selectedBooking.eventTitle}</h3>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* QR Code & Code Pass Display */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-950/50 dark:to-slate-800/40 border border-indigo-200/60 dark:border-indigo-800/50 text-center sm:text-left">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                      Digital Entry Code
                    </span>
                    <span className="font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400 block">
                      {selectedBooking.ticketCode || "TKT-CONFIRMED"}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center sm:justify-start gap-1">
                      <CheckCircle2 size={12} /> Valid for Entry
                    </span>
                  </div>

                  {/* QR Visual Card */}
                  <div className="w-24 h-24 p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center justify-center shrink-0">
                    <QrCode size={64} className="text-slate-900 dark:text-white" />
                    <span className="text-[9px] font-mono text-slate-400 mt-1">SCAN ME</span>
                  </div>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 block font-medium">Date & Time</span>
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {selectedBooking.eventDate
                        ? new Date(selectedBooking.eventDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "TBA"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 block font-medium">Venue Location</span>
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {selectedBooking.location || "Online"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 block font-medium">Reserved Seats</span>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {selectedBooking.quantity || 1} {selectedBooking.quantity > 1 ? "Tickets" : "Ticket"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 block font-medium">Amount Paid</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      {selectedBooking.totalPrice > 0 ? `$${Number(selectedBooking.totalPrice).toFixed(2)}` : "Free"}
                    </span>
                  </div>
                </div>

                {/* Attendee Info */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Pass Holder: <strong className="text-slate-900 dark:text-white">{selectedBooking.userName || user?.name || user?.email}</strong></span>
                  {selectedBooking.bookedAt && (
                    <span>Booked: {new Date(selectedBooking.bookedAt).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Print & Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrintTicket}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Printer size={15} />
                    <span>Print Ticket Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedBooking(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Done</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
