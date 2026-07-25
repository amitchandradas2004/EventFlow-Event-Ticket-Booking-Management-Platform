"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Laugh,
  Cpu,
  Trophy,
  Sparkles,
  Utensils,
  ArrowRight,
  Compass,
  Flame,
  Ticket,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "music",
    title: "Music & Live Concerts",
    slug: "music",
    icon: Music,
    badge: "Popular",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    eventCount: "120+ Events",
    description: "Stadium tours, indie acoustic sessions, music festivals, and electronic night beats.",
    tags: ["Rock & Pop", "EDM", "Classical", "Acoustic"],
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "comedy",
    title: "Stand-Up & Comedy",
    slug: "comedy",
    icon: Laugh,
    badge: "Trending",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    eventCount: "45+ Shows",
    description: "Unfiltered laughter, celebrity comedy tours, open mics, and improv nights.",
    tags: ["Stand-Up", "Improv", "Open Mic", "Comedy Special"],
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "tech",
    title: "Tech & Business Summits",
    slug: "tech",
    icon: Cpu,
    badge: "Networking",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    eventCount: "85+ Summits",
    description: "AI keynotes, startup pitches, developer hackathons, and executive expos.",
    tags: ["AI & Web3", "Startups", "Keynotes", "DevCon"],
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "sports",
    title: "Sports & eSports Arena",
    slug: "sports",
    icon: Trophy,
    badge: "Hot Pick",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    eventCount: "60+ Matches",
    description: "Live stadium finals, eSports tournaments, marathons, and combat sports.",
    tags: ["Football", "eSports", "Cricket", "Marathon"],
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "arts",
    title: "Theatre & Performing Arts",
    slug: "arts",
    icon: Sparkles,
    badge: "Exclusive",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    eventCount: "35+ Shows",
    description: "Broadway musicals, dramatic plays, contemporary dance, and art galas.",
    tags: ["Musicals", "Drama", "Ballet", "Art Expos"],
    image:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "food",
    title: "Food & Cultural Festivals",
    slug: "food",
    icon: Utensils,
    badge: "Weekend Special",
    badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    eventCount: "50+ Fests",
    description: "Street food carnivals, craft brew tastings, cultural parades, and masterclasses.",
    tags: ["Street Food", "Wine Tasting", "Carnival", "Culinary"],
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function CategoryExplorer() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredCategories =
    selectedFilter === "all"
      ? categories
      : categories.filter((cat) => cat.id === selectedFilter);

  return (
    <section className="relative w-full overflow-hidden bg-slate-100 py-16 px-4 transition-colors duration-300 dark:bg-[#070B1E] sm:py-24 sm:px-6">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute top-1/3 left-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[110px] dark:bg-indigo-600/15" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[110px] dark:bg-purple-600/15" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-600 dark:border-indigo-400/20 dark:text-indigo-300 mb-4">
              <Compass className="h-3.5 w-3.5" />
              <span>Explore by Vibe</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl tracking-tight">
              Find Events by Category
            </h2>
            <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Discover thrilling experiences curated for your taste. Filter by category to quickly jump into live concerts, tech expos, sports matches, and more.
            </p>
          </div>

          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors self-start md:self-end"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
              selectedFilter === "all"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 dark:bg-indigo-500 dark:border-indigo-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 dark:bg-indigo-950/40 dark:text-slate-300 dark:border-indigo-900/60 dark:hover:border-indigo-700"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 dark:bg-indigo-500 dark:border-indigo-500"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 dark:bg-indigo-950/40 dark:text-slate-300 dark:border-indigo-900/60 dark:hover:border-indigo-700"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Category Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-indigo-900/40 dark:bg-[#0E1338] shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image & Overlay */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${cat.badgeColor}`}
                      >
                        <Flame className="h-3 w-3" />
                        {cat.badge}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/70 text-white backdrop-blur-md border border-white/10">
                        <Ticket className="h-3 w-3 text-indigo-400" />
                        {cat.eventCount}
                      </span>
                    </div>

                    {/* Category Title on Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-600/90 text-white backdrop-blur-md shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Sub-Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-indigo-900/30">
                      {cat.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-indigo-950/60 dark:text-slate-300 border border-slate-200/60 dark:border-indigo-900/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/events?category=${cat.slug}`}
                      className="mt-2 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white font-semibold text-xs sm:text-sm transition-all duration-300 group/btn"
                    >
                      <span>Explore {cat.title.split(" ")[0]}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Organizer CTA Banner */}
        <div className="mt-14 relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 via-indigo-700 to-slate-900 p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Hosting an Event or Concert?
              </h4>
              <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-xl">
                Sell tickets with 0% setup fee, instant gate QR scanner app, and real-time seating & sales analytics on EventFlow.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>Host Your Event</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/events"
                className="px-6 py-3 rounded-xl bg-indigo-900/50 hover:bg-indigo-900/80 border border-white/20 text-white font-semibold text-sm transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
