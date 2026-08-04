"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { getUserPayments } from "@/lib/actions/payment";
import {
  CreditCard,
  DollarSign,
  Receipt,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Ticket,
  Printer,
  X
} from "lucide-react";
import Link from "next/link";

export default function AttendeePaymentsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Receipt Modal State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    async function loadPayments() {
      if (!user?.email) return;
      try {
        setLoading(true);
        const data = await getUserPayments(user.email, page, 20);
        if (data?.success) {
          setPayments(data.result || []);
          setTotalPayments(data.total || 0);
          setTotalPages(data.totalPages || 1);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.error("Failed to load payments:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, [user?.email, page]);

  // Statistics
  const totalSpent = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const totalTickets = payments.reduce((acc, p) => acc + (Number(p.quantity) || 1), 0);

  // Filtered List: Strictly Event Ticket Payments Only
  const filteredPayments = payments.filter((p) => {
    const isEventTicket = p.type === "event_booking" || Boolean(p.eventTitle) || Boolean(p.ticketCode) || (p.title && !p.title.toLowerCase().includes("membership"));
    if (!isEventTicket) return false;

    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sessionId?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/30 via-indigo-900/30 to-slate-900/50 p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <CreditCard size={14} className="text-emerald-400" /> Ticket Payment Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Payment History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Track all event ticket purchases, transactions, and download official receipts.
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Sparkles size={15} />
          <span>Book Events</span>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Total Amount Spent
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ${totalSpent.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
              <ShieldCheck size={12} /> Stripe Verified
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <DollarSign size={28} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Total Seats Reserved
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalTickets}
            </div>
            <span className="text-[11px] text-indigo-400 font-medium">
              Confirmed Event Seats
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
            <Ticket size={28} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Completed Transactions
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalPayments}
            </div>
            <span className="text-[11px] text-purple-400 font-medium">
              Payment Receipts
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
            <Receipt size={28} />
          </div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-md">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search payments by event title or session ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          Showing {filteredPayments.length} Payments
        </span>
      </div>

      {/* Payment Records Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse h-20 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
            />
          ))}
        </div>
      ) : filteredPayments.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-16 text-center backdrop-blur-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Receipt size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Ticket Payment History Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {searchQuery
                ? "No ticket payment records matched your search query."
                : "You haven't purchased any event tickets yet. Explore upcoming events and book your seats."}
            </p>
          </div>
          <Link
            href="/events"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition cursor-pointer"
          >
            Explore Events & Book Tickets
          </Link>
        </div>
      ) : (
        /* Payments Table Card Container */
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event Title / Transaction</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total Paid</th>
                  <th className="px-6 py-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredPayments.map((p) => {
                  const isPaid = (p.paymentStatus || "paid").toLowerCase() === "paid" || p.amount > 0;

                  return (
                    <tr
                      key={p.id || p.sessionId}
                      onClick={() => {
                        setSelectedPayment(p);
                        setIsReceiptModalOpen(true);
                      }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      {/* Event Title & Session ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Ticket size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-sm line-clamp-1">
                              {p.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 block truncate max-w-xs">
                              ID: {p.sessionId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300 font-semibold">
                        {p.quantity || 1} {p.quantity > 1 ? "Tickets" : "Ticket"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {(p.paymentStatus || "paid").toUpperCase()}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right whitespace-nowrap font-extrabold text-sm text-slate-900 dark:text-white">
                        {p.amount > 0 ? `$${Number(p.amount).toFixed(2)}` : "Free"}
                      </td>

                      {/* Receipt Action */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayment(p);
                            setIsReceiptModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition cursor-pointer"
                          title="View Official Receipt"
                        >
                          <Receipt size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

      {/* Detailed Receipt Modal */}
      <AnimatePresence>
        {isReceiptModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsReceiptModalOpen(false);
                setSelectedPayment(null);
              }}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsReceiptModalOpen(false);
                  setSelectedPayment(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Receipt Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Receipt size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Event Ticket Receipt
                  </h3>
                  <p className="text-xs text-slate-400">
                    EventFlow Payment Invoice
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {selectedPayment.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ref: {selectedPayment.sessionId}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {selectedPayment.amount > 0 ? `$${Number(selectedPayment.amount).toFixed(2)}` : "Free"}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Reserved Seats:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedPayment.quantity || 1} Tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attendee Email:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {(selectedPayment.paymentStatus || "paid").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Print Action */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsReceiptModalOpen(false);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
