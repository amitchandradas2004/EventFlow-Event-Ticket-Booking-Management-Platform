"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleToggle = (e) => {
    const nextTheme = isDark ? "light" : "dark";

    if (
      typeof document === "undefined" ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 550,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-slate-800/50" />
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 dark:border-slate-700/60 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 shadow-md transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-indigo-500/20 cursor-pointer group"
      aria-label="Toggle Theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Glow aura */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-amber-400/20 to-indigo-500/20 dark:from-indigo-600/30 dark:to-violet-500/30 blur-xs" />

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -180, scale: 0.2, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 180, scale: 0.2, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 22,
            }}
            className="relative z-10 flex items-center justify-center"
          >
            <Moon className="h-4.5 w-4.5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 180, scale: 0.2, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -180, scale: 0.2, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 22,
            }}
            className="relative z-10 flex items-center justify-center"
          >
            <Sun className="h-4.5 w-4.5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

