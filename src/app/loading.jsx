"use client";

import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

const dots = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      repeat: Infinity,
    },
  },
};

const dot = {
  initial: {
    y: 0,
    opacity: 0.4,
  },
  animate: {
    y: [-2, -10, -2],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-8">
        {/* Ticket Animation */}
        <div className="relative">
          {/* Glow */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-indigo-500 blur-3xl"
          />

          {/* Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -inset-6 h-24 w-24 rounded-full border-2 border-dashed border-indigo-500/40"
          />

          {/* Floating Ticket */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-600 to-cyan-500 shadow-2xl"
          >
            <Ticket className="h-10 w-10 text-white" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-center">
          <motion.h2
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            className="text-3xl font-bold text-slate-800 dark:text-white"
          >
            EventFlow
          </motion.h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Booking your experience
          </p>
        </div>

        {/* Animated Dots */}
        <motion.div
          variants={dots}
          initial="initial"
          animate="animate"
          className="flex gap-2"
        >
          {[0, 1, 2].map((item) => (
            <motion.div
              key={item}
              variants={dot}
              className="h-3 w-3 rounded-full bg-indigo-500"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
