"use client";

import { motion } from "framer-motion";

export default function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Header Banner Skeleton */}
      <div className="bg-slate-200 dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl w-full">
            {/* Badge skeleton */}
            <div className="h-6 w-48 rounded-full bg-slate-300 dark:bg-slate-700" />
            {/* Title skeleton */}
            <div className="h-8 w-3/4 rounded-xl bg-slate-300 dark:bg-slate-700" />
            {/* Subtitle skeleton */}
            <div className="h-4 w-full rounded-lg bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Action button skeleton */}
          <div className="h-10 w-36 rounded-xl bg-slate-300 dark:bg-slate-700 shrink-0" />
        </div>
      </div>

      {/* Overview Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              {/* Icon box skeleton */}
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              {/* Link action skeleton */}
              <div className="h-4 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-2">
              {/* Metric count skeleton */}
              <div className="h-9 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
              {/* Metric title skeleton */}
              <div className="h-4 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visualization Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Container Skeleton (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Bar Chart Graphics Placeholder */}
          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4">
            {[40, 75, 55, 90, 65, 80, 45, 70].map((heightPct, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full max-w-[36px] rounded-t-xl bg-slate-200 dark:bg-slate-800"
                  style={{ height: `${heightPct}%` }}
                />
                <div className="h-3 w-8 rounded bg-slate-200 dark:bg-slate-800 mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart Container Skeleton (1 Col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Circle Donut Skeleton */}
          <div className="h-48 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-8 border-slate-200 dark:border-slate-800 border-t-slate-300 dark:border-t-slate-700 animate-spin" />
          </div>

          {/* Legend Items Skeleton */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Status Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-3">
              <div className="h-8 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
              {/* Progress bar skeleton */}
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
