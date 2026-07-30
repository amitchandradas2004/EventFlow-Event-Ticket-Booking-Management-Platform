"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Flame, Ticket, Info, Tag, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getApprovedEvents } from "@/lib/actions/event";
import EventDetailsModal from "@/components/Event/EventDetailsModal";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FeaturedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getApprovedEvents(6);
        const fetched = data?.result || [];
        setEvents(fetched.slice(0, 6));
      } catch (err) {
        console.error("Error fetching approved events from database:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleOpenDetails = (evt) => {
    setSelectedEvent(evt);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-100/80 py-16 px-4 transition-colors duration-300 dark:bg-[#080B21] sm:py-24 sm:px-6">
      {/* Background ambient glow accents */}
      <div className="pointer-events-none absolute -top-40 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[130px] dark:bg-indigo-600/20" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[130px] dark:bg-purple-600/20" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:border-indigo-400/20 dark:text-indigo-400">
              <Flame className="h-3.5 w-3.5 text-amber-500" /> Admin Approved Events
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
              Featured Events
            </h2>
            <p className="mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Discover top verified concerts, tech summits, sports tournaments, and live experiences.
            </p>
          </div>

          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Explore all events
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Skeleton Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 space-y-4"
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
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-12 text-center backdrop-blur-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Ticket className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Approved Events Yet</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Approved events will appear here once verified by the platform admin.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {events.map((event, index) => (
              <motion.article
                key={event._id || index}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleOpenDetails(event)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 shadow-md transition-all duration-300 hover:shadow-xl dark:border-indigo-500/15 dark:bg-indigo-950/20 dark:hover:border-indigo-500/35 dark:hover:bg-indigo-950/40 backdrop-blur-xl cursor-pointer"
              >
                <div>
                  {/* Banner Image */}
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
                    <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {event.category || "General"}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300 line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">
                          {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}
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
                <div className="mx-6 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {event.ticketPrice > 0 ? `৳${event.ticketPrice}` : "Free"}
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
      </div>

      {/* Event Details Modal (Section-scoped overlay) */}
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        event={selectedEvent}
        isSectionModal={true}
      />
    </section>
  );
}
