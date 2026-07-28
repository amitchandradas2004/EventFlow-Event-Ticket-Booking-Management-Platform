"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Banner() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Container animation to stagger the text layout elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  // Upward slide and fade-in for typography
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Fade-in animation specifically for the floating graphic block
  const graphicVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center bg-linear-to-br from-indigo-50 to-slate-200 dark:from-indigo-950 dark:to-slate-900 px-6 py-25 overflow-hidden transition-colors duration-500">
      {/* Background Decorative Mesh Flare */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 container mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <motion.div
          className="text-center md:text-left text-slate-900 dark:text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl  md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-slate-800 dark:from-indigo-400 dark:to-slate-200"
            variants={textVariants}
          >
            Discover, Book, and Host Unforgettable Events
          </motion.h1>

          <motion.p
            className="text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed"
            variants={textVariants}
          >
            The all-in-one platform connecting passionate organizers with eager
            attendees. Secure your e-tickets in seconds, or scale your next big
            event seamlessly.
          </motion.p>

          <motion.div
            variants={textVariants}
            className="flex flex-wrap gap-4 items-center justify-center md:justify-start"
          >
            <Link href="/events" className="inline-block">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                Explore Events
              </button>
            </Link>

            {!user && (
              <Link href="/register" className="inline-block">
                <button className="bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white font-semibold py-3 px-8 rounded-full shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                  Get Started
                </button>
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Right Side: Interactive Floating 3D-Like Graphic */}
        <motion.div
          className="flex justify-center items-center h-64 sm:h-80 md:h-full relative"
          variants={graphicVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Floating Container */}
          <motion.div
            className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl bg-linear-to-tr from-indigo-500 to-slate-400 dark:from-indigo-600 dark:to-slate-500 shadow-2xl relative flex items-center justify-center border border-white/20 dark:border-white/10"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          >
            {/* Main Ticket Icon in the center */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/80 dark:text-white/60 drop-shadow-md"
            >
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2" />
              <path d="M13 11v2" />
              <path d="M13 17v2" />
            </svg>

            {/* Embedded inner glassmorphism card that floats independently */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md shadow-lg border border-white/30 dark:border-slate-700/30 flex flex-col justify-between p-4"
              animate={{
                y: [0, 12, 0],
                x: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center shadow-sm">
                {/* Small Ticket Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2" />
                  <path d="M13 11v2" />
                  <path d="M13 17v2" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-3/4 bg-slate-700/40 dark:bg-white/40 rounded" />
                <div className="h-3 w-1/2 bg-slate-700/30 dark:bg-white/30 rounded" />
              </div>
            </motion.div>

            {/* Orbiting element */}
            <motion.div
              className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-slate-800 dark:bg-slate-100 shadow-md flex items-center justify-center text-white dark:text-slate-900"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Micro Ticket Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 11v2" />
                <path d="M13 17v2" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
