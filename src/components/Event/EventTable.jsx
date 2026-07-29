"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash2,
  Inbox,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import EventDetailsModal from "./EventDetailsModal";
import EditEventModal from "./EditEventModal";
import EventTableSkeleton from "./EventTableSkeleton";
import { deleteEventById } from "@/lib/actions/event";

export default function EventTable({
  events = [],
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  searchTerm = "",
  onSearchChange,
  onPageChange,
  onDeleteEvent,
  onUpdateEvent
}) {
  const [imageErrors, setImageErrors] = useState({});

  // View modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit modal state
  const [eventToEdit, setEventToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Deletion state
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleOpenDetails = (ev) => {
    setSelectedEvent(ev);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev) => {
    setEventToEdit(ev);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete?._id) {
      toast.error("Event ID missing");
      return;
    }

    setDeleting(true);
    try {
      await deleteEventById(eventToDelete._id);
      toast.success("Event deleted successfully!");
      if (onDeleteEvent) {
        onDeleteEvent(eventToDelete._id);
      }
      setEventToDelete(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={13} />
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle size={13} />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock size={13} />
        Pending
      </span>
    );
  };

  const formatShortDate = (dtStr) => {
    if (!dtStr) return "N/A";
    try {
      const dt = new Date(dtStr);
      if (isNaN(dt.getTime())) return dtStr;
      return dt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dtStr;
    }
  };

  if (isLoading) {
    return <EventTableSkeleton rows={5} />;
  }

  return (
    <>
      <div className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-300">
        {/* HEADER BAR */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                My Organized Events
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Showing {events.length} of {totalCount} total event listings
            </p>
          </div>

          {/* Controls: Search Bar & Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by event name..."
                value={searchTerm}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full sm:w-60 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <Link
              href="/dashboard/organizer/add-event"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 transition"
            >
              <Plus className="w-4 h-4" /> Add Event
            </Link>
          </div>
        </div>

        {/* EMPTY STATE */}
        {events.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <Inbox className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {searchTerm ? "No events match your search" : "No events created yet"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchTerm
                  ? "Try adjusting your search criteria to find what you are looking for."
                  : "Publish your first event under your organization to start selling tickets."}
              </p>
            </div>
            {!searchTerm && (
              <Link
                href="/dashboard/organizer/add-event"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition"
              >
                <Plus className="w-4 h-4" /> Create Your First Event
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* MOBILE CARD VIEW (< sm) */}
            <div className="block sm:hidden divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {events.map((ev) => (
                <div key={ev._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                        {ev.banner && !imageErrors[ev._id] ? (
                          <img
                            src={ev.banner}
                            alt=""
                            onError={() => handleImageError(ev._id)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Calendar size={18} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {ev.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Tag size={12} /> {ev.category}
                        </p>
                      </div>
                    </div>
                    <div>{getStatusBadge(ev.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin size={12} className="shrink-0" /> <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                      <DollarSign size={12} className="text-emerald-500" /> {ev.ticketPrice > 0 ? `$${ev.ticketPrice}` : "Free"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400">
                      {formatShortDate(ev.date)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(ev)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ev)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventToDelete(ev)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE VIEW (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-6">Event</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Seats</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70 text-sm">
                  {events.map((ev) => (
                    <tr
                      key={ev._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Banner & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                            {ev.banner && !imageErrors[ev._id] ? (
                              <img
                                src={ev.banner}
                                alt=""
                                onError={() => handleImageError(ev._id)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Calendar size={18} />
                              </div>
                            )}
                          </div>
                          <div className="max-w-[240px] truncate">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {ev.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ev.category}
                        </span>
                      </td>

                      {/* Seats */}
                      <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {ev.availableSeats} Seats
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">{getStatusBadge(ev.status)}</td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View Details"
                            onClick={() => handleOpenDetails(ev)}
                            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            title="Edit Event"
                            onClick={() => handleOpenEdit(ev)}
                            className="p-2 rounded-xl text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            title="Delete Event"
                            onClick={() => setEventToDelete(ev)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION BAR */}
            {totalPages > 1 && (
              <div className="p-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange && onPageChange(currentPage - 1)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange && onPageChange(currentPage + 1)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* EDIT MODAL */}
      <EditEventModal
        event={eventToEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateSuccess={(updatedEv) => {
          if (onUpdateEvent) onUpdateEvent(updatedEv);
        }}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {eventToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEventToDelete(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Delete Event</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{eventToDelete.title}"</strong>? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEventToDelete(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    "Yes, Delete Event"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
