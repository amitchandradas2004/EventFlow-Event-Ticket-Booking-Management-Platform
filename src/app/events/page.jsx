"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Search,
  Filter,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Info,
  Ticket,
  Sparkles,
  RefreshCw,
  Flame,
  Tag,
  Palette
} from "lucide-react";
import { getAllPublicEvents } from "@/lib/actions/event";
import EventDetailsModal from "@/components/Event/EventDetailsModal";

const HEADER_THEMES = [
  {
    id: "indigo",
    label: "Indigo",
    colorDot: "bg-indigo-500",
    bgClass: "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 dark:from-[#0B0F2E] dark:via-[#080B21] dark:to-[#050718]",
    glowClass: "bg-indigo-400/30 dark:bg-indigo-500/20"
  },
  {
    id: "ocean",
    label: "Ocean",
    colorDot: "bg-cyan-500",
    bgClass: "bg-gradient-to-br from-blue-600 via-teal-600 to-indigo-800 dark:from-[#031B33] dark:via-[#061329] dark:to-[#020A17]",
    glowClass: "bg-cyan-400/30 dark:bg-cyan-500/20"
  },
  {
    id: "sunset",
    label: "Sunset",
    colorDot: "bg-rose-500",
    bgClass: "bg-gradient-to-br from-rose-600 via-purple-600 to-indigo-800 dark:from-[#2A081A] dark:via-[#19071E] dark:to-[#0B0518]",
    glowClass: "bg-rose-400/30 dark:bg-rose-500/20"
  },
  {
    id: "emerald",
    label: "Emerald",
    colorDot: "bg-emerald-500",
    bgClass: "bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-800 dark:from-[#04201A] dark:via-[#06181E] dark:to-[#030D15]",
    glowClass: "bg-emerald-400/30 dark:bg-emerald-500/20"
  },
  {
    id: "obsidian",
    label: "Obsidian",
    colorDot: "bg-slate-700",
    bgClass: "bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-950 dark:from-[#090D16] dark:via-[#05070D] dark:to-[#020306]",
    glowClass: "bg-slate-400/20 dark:bg-slate-500/20"
  }
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Date: Earliest First", value: "date-asc" },
  { label: "Date: Latest First", value: "date-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" }
];

const DEFAULT_CATEGORIES = [
  "All",
  "Concert",
  "Conference",
  "Comedy",
  "Sports",
  "Workshop",
  "Exhibition",
  "Networking"
];

export default function PublicEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  // Header Background Theme State
  const [headerThemeId, setHeaderThemeId] = useState("indigo");

  useEffect(() => {
    const savedTheme = localStorage.getItem("events_header_theme");
    if (savedTheme && HEADER_THEMES.some((t) => t.id === savedTheme)) {
      setHeaderThemeId(savedTheme);
    }
  }, []);

  const handleSelectHeaderTheme = (id) => {
    setHeaderThemeId(id);
    try {
      localStorage.setItem("events_header_theme", id);
    } catch (e) { }
  };

  const activeHeaderTheme = HEADER_THEMES.find((t) => t.id === headerThemeId) || HEADER_THEMES[0];

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortDropdownRef = useRef(null);

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch events when filters/page change
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await getAllPublicEvents({
          page,
          limit: 12,
          search: debouncedSearch,
          category: selectedCategory,
          sortBy
        });

        if (data?.success) {
          setEvents(data.result || []);
          setTotalEvents(data.total || 0);
          setTotalPages(data.totalPages || 1);

          if (data.categories && data.categories.length > 0) {
            const merged = Array.from(new Set(["All", ...data.categories, ...DEFAULT_CATEGORIES]));
            setCategories(merged);
          }
        } else {
          setEvents([]);
          setTotalEvents(0);
          setTotalPages(1);
        }
      } catch (err) {
        // console.error("Failed to load events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [page, debouncedSearch, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("All");
    setSortBy("newest");
    setIsSortOpen(false);
    setPage(1);
  };

  const handleOpenDetails = (eventItem) => {
    setSelectedEvent(eventItem);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Newest First";

  return (
    <div className="relative w-full min-h-screen bg-slate-100/80 dark:bg-[#080B21] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Background ambient glow accents */}
      <div className="pointer-events-none absolute -top-40 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[130px] dark:bg-indigo-600/20" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[130px] dark:bg-purple-600/20" />

      {/* Hero Header Section */}
      <section className={`relative w-full overflow-hidden ${activeHeaderTheme.bgClass} py-20 px-4 text-white sm:py-24 sm:px-6 shadow-xl transition-colors duration-500`}>
        <div className={`pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full ${activeHeaderTheme.glowClass} blur-[140px] transition-colors duration-500`} />

        <div className="relative mx-auto container text-center space-y-5">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95 border border-white/20 shadow-sm">
              <Sparkles size={14} className="text-amber-400" /> Discover Unforgettable Experiences
            </span>

            {/* Header Theme / Background Color Picker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-sm text-xs font-semibold text-white/95 transition-all hover:bg-white/20">
              <Palette size={14} className="text-white" />
              <span className="text-[11px] opacity-90 hidden sm:inline">Header Theme:</span>
              <div className="flex items-center gap-1.5">
                {HEADER_THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectHeaderTheme(t.id)}
                    title={`Switch header color to ${t.label}`}
                    className={`h-4 w-4 rounded-full ${t.colorDot} transition-all duration-200 cursor-pointer ${headerThemeId === t.id
                        ? "ring-2 ring-white scale-110 shadow-md"
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
            Explore All Events
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-indigo-100/90 font-medium">
            Find and book tickets for top concerts, tech conferences, comedy shows, and sports events.
          </p>

          {/* Search Box in Hero */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 p-2 shadow-2xl focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/30 transition">
              <Search className="w-5 h-5 text-indigo-100 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search events by title, location, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-indigo-100/70 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full text-indigo-100 hover:text-white hover:bg-white/20 transition mr-2"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative mx-auto container px-4 sm:px-6 py-10 space-y-8">
        {/* Controls Toolbar: Categories & Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 dark:bg-indigo-950/20 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-indigo-500/15 shadow-md backdrop-blur-xl">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <Filter size={13} /> Categories:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Right Toolbar Controls: Custom Animated Sort Dropdown & Reset */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
            {/* Custom Modern Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100/90 dark:bg-indigo-950/40 border border-slate-200 dark:border-indigo-500/20 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500/40 hover:bg-slate-200/70 dark:hover:bg-indigo-900/50 transition shadow-xs cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Sort: {currentSortLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Animated Popover Menu */}
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 z-30 overflow-hidden rounded-2xl bg-white dark:bg-[#0B0F2E] border border-slate-200/90 dark:border-indigo-500/20 shadow-2xl p-1.5 backdrop-blur-2xl"
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Sort Events By
                    </div>
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setIsSortOpen(false);
                            setPage(1);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${isSelected
                            ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-indigo-900/40"
                            }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset Button if filter active */}
            {(debouncedSearch || selectedCategory !== "All" || sortBy !== "newest") && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
          <span>
            {loading
              ? "Fetching events..."
              : `Showing ${events.length > 0 ? (page - 1) * 12 + 1 : 0} - ${Math.min(page * 12, totalEvents)} of ${totalEvents} Events`}
          </span>
          {selectedCategory !== "All" && (
            <span className="text-indigo-600 dark:text-indigo-400">
              Filtered by Category: {selectedCategory}
            </span>
          )}
        </div>

        {/* Skeleton Loading Grid (12 items) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-indigo-500/15 dark:bg-indigo-950/20 space-y-4"
              >
                <div className="h-44 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 rounded-md bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="h-8 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-indigo-950/20 p-16 text-center backdrop-blur-sm space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Ticket className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Events Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                We couldn&apos;t find any events matching your search or filters. Try adjusting your search query or categories.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md hover:bg-indigo-500 transition cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Events Grid (12 Items per Page) */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {events.map((event, index) => (
              <motion.article
                key={event._id || index}
                whileHover={{ y: -6 }}
                onClick={() => handleOpenDetails(event)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 shadow-md transition-all duration-300 hover:shadow-xl dark:border-indigo-500/15 dark:bg-indigo-950/20 dark:hover:border-indigo-500/35 dark:hover:bg-indigo-950/40 backdrop-blur-xl cursor-pointer"
              >
                <div>
                  {/* Event Image Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {event.banner ? (
                      <img
                        src={event.banner}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-indigo-500 dark:text-indigo-400">
                        <Calendar className="h-10 w-10" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                      {event.category || "General"}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300 line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })
                            : "TBA"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="line-clamp-1">{event.location || "Online / TBA"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="mx-5 mb-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {event.ticketPrice > 0 ? `$${event.ticketPrice}` : "Free"}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(event);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
                  >
                    View Details <Info className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 dark:border-indigo-500/20">
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-indigo-950/40 border border-slate-200 dark:border-indigo-500/20 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-indigo-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs cursor-pointer"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${page === pageNum
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "bg-white dark:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-indigo-900/50 border border-slate-200 dark:border-indigo-500/20"
                    }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-indigo-950/40 border border-slate-200 dark:border-indigo-500/20 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-indigo-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs cursor-pointer"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
}
