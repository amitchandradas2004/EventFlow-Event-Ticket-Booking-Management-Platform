"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminEvents, updateEventStatus } from "@/lib/actions/event";
import EventDetailsModal from "@/components/Event/EventDetailsModal";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Loader2,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

// STATUS OPTIONS DEFINITION
const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All Statuses",
    icon: Layers,
    color: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
];

// CUSTOM STATUS SELECT COMPONENT
function CustomStatusSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    STATUS_OPTIONS.find((opt) => opt.value === value) || STATUS_OPTIONS[0];
  const SelectedIcon = selectedOption.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 w-full sm:w-56" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <SelectedIcon size={16} className={selectedOption.color} />
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {STATUS_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                        option.value === "all"
                          ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                          : option.value === "pending"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300"
                          : option.value === "approved"
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300"
                      }`}
                    >
                      <IconComponent size={14} />
                    </span>
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FULL PAGE SKELETON COMPONENT
function AdminEventsPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-80 bg-slate-200/70 dark:bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* 2. Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>

      {/* 3. Search & Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4">
        <div className="h-10 w-full sm:w-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-10 w-full sm:w-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* 4. Table Container Skeleton */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4 text-center"><div className="h-4 w-24 mx-auto bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
                <th className="px-6 py-4 text-center"><div className="h-4 w-20 mx-auto bg-slate-200 dark:bg-slate-800 rounded-md" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">
                    <div className="h-12 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md mb-1.5" />
                    <div className="h-3 w-24 bg-slate-200/70 dark:bg-slate-800/60 rounded-md" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-14 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="h-8 w-24 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="h-8 w-36 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    rejectedEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // View Details Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch events when page, search, or status filter changes
  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);
      getAdminEvents(page, 10, debouncedSearch, selectedStatus)
        .then((data) => {
          if (!isCancelled) {
            if (data?.success) {
              setEvents(data.result || []);
              setTotalEvents(data.total || 0);
              setTotalPages(data.totalPages || 1);
              if (data.stats) {
                setStats(data.stats);
              }
            } else {
              setEvents([]);
              toast.error(data?.message || "Failed to load events");
            }
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error("Error loading events:", err);
            toast.error("Failed to load events list");
            setEvents([]);
            setLoading(false);
          }
        });
    }, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [page, debouncedSearch, selectedStatus]);

  const handleRefresh = () => {
    setLoading(true);
    getAdminEvents(page, 10, debouncedSearch, selectedStatus)
      .then((data) => {
        if (data?.success) {
          setEvents(data.result || []);
          setTotalEvents(data.total || 0);
          setTotalPages(data.totalPages || 1);
          if (data.stats) {
            setStats(data.stats);
          }
        } else {
          setEvents([]);
          toast.error(data?.message || "Failed to load events");
        }
      })
      .catch((err) => {
        console.error("Error loading events:", err);
        toast.error("Failed to load events list");
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle Approve / Reject Actions
  const handleStatusChange = async (eventId, newStatus) => {
    try {
      setUpdatingId(eventId);
      const res = await updateEventStatus(eventId, newStatus);
      if (res?.success) {
        toast.success(`Event successfully ${newStatus}!`);
        // Update local state smoothly
        setEvents((prev) =>
          prev.map((item) =>
            item._id === eventId ? { ...item, status: newStatus } : item
          )
        );
        // Refresh counts
        handleRefresh();
      } else {
        toast.error(res?.message || "Failed to update event status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err?.message || "An error occurred while updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleOpenDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // IF FULL PAGE LOADING
  if (loading && events.length === 0) {
    return <AdminEventsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-indigo-600 dark:text-indigo-400" size={26} />
            Event Moderation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and manage all events submitted by organizers across the platform.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Events
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Calendar size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.totalEvents}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/30 bg-amber-50/40 dark:bg-amber-950/20 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pending Approval
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-900 dark:text-amber-300 mt-2">
            {stats.pendingEvents}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Approved Events
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-300 mt-2">
            {stats.approvedEvents}
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/30 bg-rose-50/40 dark:bg-rose-950/20 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Rejected Events
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <XCircle size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-900 dark:text-rose-300 mt-2">
            {stats.rejectedEvents}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search event title or organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Custom Status Select Dropdown */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
            <Filter size={14} />
            Filter:
          </span>
          <CustomStatusSelect
            value={selectedStatus}
            onChange={(newVal) => {
              setSelectedStatus(newVal);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Events Table Container */}
      <div className="relative z-10 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4">Image</th>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4">Price</th>
                <th scope="col" className="px-6 py-4 text-center">View Details</th>
                <th scope="col" className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-12 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800 mb-1.5" />
                      <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-8 w-24 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-8 w-36 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-3">
                      <Inbox size={40} strokeWidth={1.5} />
                      <p className="text-base font-medium">No events found matching your criteria</p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedStatus("all");
                          setPage(1);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((ev) => {
                  const isUpdating = updatingId === ev._id;
                  const currentStatus = (ev.status || "pending").toLowerCase();

                  return (
                    <tr
                      key={ev._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* 1. Image */}
                      <td className="px-6 py-4">
                        <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                          {ev.banner && !imageErrors[ev._id] ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={ev.banner}
                              alt={ev.title || "Event image"}
                              onError={() => handleImageError(ev._id)}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                              <Calendar size={20} />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 2. Name */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {ev.title || "Untitled Event"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="inline-block text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            {ev.category || "General"}
                          </span>
                          {ev.organizerEmail && (
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]" title={ev.organizerEmail}>
                              • {ev.organizerEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <Calendar size={14} className="text-slate-400" />
                          {formatDate(ev.date)}
                        </span>
                      </td>

                      {/* 4. Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {Number(ev.ticketPrice) > 0 ? `$${ev.ticketPrice}` : "Free"}
                        </span>
                      </td>

                      {/* 5. View Details Button */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(ev)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 shadow-xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </td>

                      {/* 6. Actions Button (Approve / Reject) */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {isUpdating ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium py-1.5 px-3">
                              <Loader2 size={14} className="animate-spin text-indigo-600" />
                              Updating...
                            </span>
                          ) : (
                            <>
                              {/* Approve Button */}
                              <button
                                type="button"
                                disabled={currentStatus === "approved"}
                                onClick={() => handleStatusChange(ev._id, "approved")}
                                title={currentStatus === "approved" ? "Event is already approved" : "Approve this event"}
                                className={`inline-flex items-center gap-1.5 rounded-xl py-1.5 px-3 text-xs font-bold transition-all ${
                                  currentStatus === "approved"
                                    ? "bg-emerald-500/10 text-emerald-600/60 dark:bg-emerald-950/30 dark:text-emerald-400/60 border border-emerald-500/20 cursor-not-allowed opacity-60"
                                    : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
                                }`}
                              >
                                <CheckCircle2 size={14} />
                                {currentStatus === "approved" ? "Approved" : "Approve"}
                              </button>

                              {/* Reject Button */}
                              <button
                                type="button"
                                disabled={currentStatus === "rejected"}
                                onClick={() => handleStatusChange(ev._id, "rejected")}
                                title={currentStatus === "rejected" ? "Event is already rejected" : "Reject this event"}
                                className={`inline-flex items-center gap-1.5 rounded-xl py-1.5 px-3 text-xs font-bold transition-all ${
                                  currentStatus === "rejected"
                                    ? "bg-rose-500/10 text-rose-600/60 dark:bg-rose-950/30 dark:text-rose-400/60 border border-rose-500/20 cursor-not-allowed opacity-60"
                                    : "bg-rose-600 text-white hover:bg-rose-500 shadow-xs hover:shadow-rose-500/20 active:scale-95 cursor-pointer"
                                }`}
                              >
                                <XCircle size={14} />
                                {currentStatus === "rejected" ? "Rejected" : "Reject"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && totalEvents > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div>
              Showing <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * 10 + 1}</span> to{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {Math.min(page * 10, totalEvents)}
              </span>{" "}
              of <span className="font-bold text-slate-900 dark:text-white">{totalEvents}</span> events
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span className="px-2 text-slate-600 dark:text-slate-300 font-semibold">
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}
