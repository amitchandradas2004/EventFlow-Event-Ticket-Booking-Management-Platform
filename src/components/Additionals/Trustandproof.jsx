"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useState } from "react";

// Edit this array with your own testimonials
const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "Attended Coldplay — Music of the Spheres",
    quote:
      "Booking was ridiculously smooth. Got my seat, got my QR code, walked straight in. No queues, no printed paper, nothing.",
    rating: 5,
  },
  {
    name: "Tanvir Ahmed",
    role: "Attended Dhaka Comedy Fest",
    quote:
      "Had to move my ticket to a friend last minute and the transfer took under a minute. Genuinely the best booking experience I've had.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Attended Champions League Screening Night",
    quote:
      "The event got rescheduled and EventFlow notified me before I even checked my email. Refund policy was crystal clear too.",
    rating: 4,
  },
  {
    name: "Farhan Kabir",
    role: "Attended Dhaka Startup Summit",
    quote:
      "Clean checkout, no hidden fees, and the e-ticket looked legit enough that security didn't even blink twice at the gate.",
    rating: 5,
  },
];

// Edit this array with your own partner / venue names
const partners = [
  "Bengal Arena",
  "Army Stadium",
  "Star Cineplex",
  "Radisson Blu",
  "Jamuna Future Park",
  "Dhaka Club",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={0}
          className={`transition-colors duration-500 ${
            i < rating
              ? "fill-indigo-500 text-indigo-500 dark:fill-indigo-400 dark:text-indigo-400"
              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (newIndex, dir) => {
    setDirection(dir);
    setIndex((newIndex + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white/60 px-6 py-8 backdrop-blur-xl sm:rounded-3xl sm:px-10 sm:py-10 dark:border-indigo-500/20 dark:bg-slate-800/40 transition-colors duration-500 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {/* Subtle inner linear mesh */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-500/5 via-slate-400/5 to-slate-300/5 dark:from-indigo-500/10 dark:via-slate-400/10 dark:to-slate-300/10" />

        <Quote
          size={32}
          strokeWidth={1.5}
          className="relative text-indigo-300 dark:text-indigo-500/40 transition-colors duration-500"
        />

        <div className="relative min-h-40 sm:min-h-32">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base sm:leading-relaxed dark:text-slate-200 transition-colors duration-500">
                {current.quote}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-slate-500 text-sm font-semibold text-white shadow-md">
                  {current.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors duration-500">
                    {current.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-500">
                    {current.role}
                  </p>
                </div>
                <div className="ml-auto hidden sm:block">
                  <StarRating rating={current.rating} />
                </div>
              </div>
              <div className="mt-4 sm:hidden">
                <StarRating rating={current.rating} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => goTo(index - 1, -1)}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-white text-slate-500 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-indigo-500/30 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-indigo-400 dark:hover:text-indigo-300 active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-indigo-600 dark:bg-indigo-400"
                  : "w-2 bg-indigo-200 dark:bg-slate-600 hover:bg-indigo-300 dark:hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1, 1)}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-white text-slate-500 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-indigo-500/30 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-indigo-400 dark:hover:text-indigo-300 active:scale-95"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function TrustAndProof() {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-br from-indigo-50 to-slate-100 dark:from-indigo-950 dark:to-slate-900 px-4 py-16 sm:px-6 sm:py-20 md:py-24 transition-colors duration-500">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-60 -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-300/40 blur-[80px] sm:h-80 sm:w-125 sm:blur-[100px] md:h-125 md:w-175 md:blur-[120px] dark:bg-indigo-600/20" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-40 w-60 translate-x-1/3 translate-y-1/3 rounded-full bg-slate-400/30 blur-[80px] sm:h-80 sm:w-125 sm:blur-[100px] md:h-125 md:w-175 md:blur-[120px] dark:bg-slate-700/20" />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="mb-3 inline-block rounded-full border border-indigo-200 bg-indigo-100/50 px-4 py-1 text-xs font-medium uppercase tracking-wider text-indigo-700 backdrop-blur-md dark:border-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-300 transition-colors duration-500">
            Trusted by thousands
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-white transition-colors duration-500">
            Do not just take{" "}
            <span className="bg-linear-to-r from-indigo-600 via-indigo-500 to-slate-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-indigo-300 dark:to-slate-300">
              our word for it.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 sm:text-base dark:text-slate-300/70 transition-colors duration-500">
            Real feedback from real attendees who booked through EventFlow.
          </p>
        </motion.div>

        {/* Testimonial carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <TestimonialCard />
        </motion.div>

        {/* Trusted-by partner strip */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-20 sm:mt-24"
        >
          <motion.p
            variants={itemVariants}
            className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 sm:mb-8 dark:text-slate-400 transition-colors duration-500"
          >
            Venues & partners who trust EventFlow
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12"
          >
            {partners.map((partner) => (
              <span
                key={partner}
                className="text-sm font-semibold tracking-tight text-slate-400 transition-colors duration-300 hover:text-indigo-600 sm:text-base dark:text-slate-500 dark:hover:text-indigo-300 cursor-default"
              >
                {partner}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
