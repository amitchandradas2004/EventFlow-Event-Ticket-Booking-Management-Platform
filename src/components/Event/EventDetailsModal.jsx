"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  MapPin,
  Tag,
  DollarSign,
  Users,
  FileText,
  Building2,
  Mail,
  Ticket
} from "lucide-react";

export default function EventDetailsModal({ event, isOpen, onClose, isSectionModal = false }) {
  const [imageError, setImageError] = useState(false);

  if (!event) return null;

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={14} />
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle size={14} />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock size={14} />
        Pending Approval
      </span>
    );
  };

  const formattedDate = event.date
    ? new Date(event.date).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      })
    : "N/A";

  const overlayClass = isSectionModal
    ? "absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 min-h-full"
    : "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4";

  const backdropClass = isSectionModal
    ? "absolute inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
    : "fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer";

  const cardClass = isSectionModal
    ? "relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10"
    : "relative w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl rounded-b-none sm:rounded-3xl shadow-2xl z-10";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={overlayClass}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={backdropClass}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={cardClass}
          >
            {/* Header Banner Image */}
            <div className="relative w-full h-48 sm:h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {event.banner && !imageError ? (
                <img
                  src={event.banner}
                  alt={event.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Calendar className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
              
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-sm transition"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4 text-white">
                <div>
                  <span className="px-2.5 py-1 bg-indigo-600/90 text-white text-xs font-semibold rounded-md backdrop-blur-sm inline-block mb-1.5">
                    {event.category || "General"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold line-clamp-1">{event.title}</h3>
                </div>
                <div>{getStatusBadge(event.status)}</div>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Date & Time</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{formattedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Location</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Ticket Price</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {event.ticketPrice > 0 ? `$${event.ticketPrice}` : "Free"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Available Capacity</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{event.availableSeats} Seats</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Event Description
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {event.description}
                </p>
              </div>

              {/* Organizer Info & Bottom Actions */}
              <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400 gap-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> {event.organizerEmail}
                  </span>
                  {event.createdAt && (
                    <span>Created: {new Date(event.createdAt).toLocaleDateString()}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    alert(`Redirecting to ticket booking for: ${event.title}`);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition cursor-pointer active:scale-95 shrink-0"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Ticket</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
