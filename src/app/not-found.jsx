"use client";
const metadata = {
  title: "Not Found - Event Ticket Booking Platform",
  description:
    "The page you are looking for does not exist, may have been moved, or the event has already ended.",
};
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Ticket } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 dark:bg-slate-950">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[50px_50px] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      {/* Floating Circles */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute left-10 top-10 h-64 w-64 rounded-full bg-indigo-500/10"
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-500/10"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-xl flex-col items-center text-center"
      >
        {/* Ticket */}
        <motion.div
          variants={item}
          animate={{
            y: [0, -12, 0],
            rotate: [-6, 6, -6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="mb-10"
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-indigo-600 shadow-2xl shadow-indigo-500/30">
            <Ticket className="h-14 w-14 text-white" />
          </div>
        </motion.div>

        {/* 404 */}
        <motion.h1
          variants={item}
          className="text-8xl font-black tracking-tight text-indigo-600 md:text-9xl"
        >
          404
        </motion.h1>

        {/* Heading */}
        <motion.h2
          variants={item}
          className="mt-4 text-3xl font-bold text-slate-900 dark:text-white"
        >
          Oops! Ticket Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={item}
          className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400"
        >
          The page you are looking for does not exist, may have been moved, or
          the event has already ended.
        </motion.p>

        {/* Button */}
        <motion.div variants={item} className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-indigo-700 active:scale-95"
          >
            <Home size={20} />
            Back Home
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={item}
          className="my-10 h-px w-40 bg-slate-300 dark:bg-slate-700"
        />

        {/* Footer */}
        <motion.p
          variants={item}
          className="text-sm text-slate-500 dark:text-slate-500"
        >
          EventFlow • Your Event Booking Platform
        </motion.p>
      </motion.div>
    </main>
  );
}
