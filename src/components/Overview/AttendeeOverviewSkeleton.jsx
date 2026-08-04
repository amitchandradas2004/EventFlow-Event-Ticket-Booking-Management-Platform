"use client";

export default function AttendeeOverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse pb-12">
      {/* 1. Header Banner & Profile Summary Skeleton */}
      <div className="bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-300/50 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6 w-full max-w-xl">
            {/* Avatar skeleton */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-300 dark:bg-slate-700 shrink-0" />
            <div className="space-y-2.5 w-full">
              <div className="h-5 w-44 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="h-8 w-64 sm:w-80 rounded-xl bg-slate-300 dark:bg-slate-700" />
              <div className="h-4 w-48 rounded-lg bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <div className="h-10 w-32 rounded-xl bg-slate-300 dark:bg-slate-700" />
            <div className="h-10 w-28 rounded-xl bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-24 rounded-xl bg-slate-300 dark:bg-slate-700" />
              <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Attendee Details Card (1 Col) & Next Event Spotlight (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendee Details Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-11 rounded-2xl bg-slate-100 dark:bg-slate-800/60 p-3 flex items-center justify-between">
                  <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        {/* Next Upcoming Event Spotlight Skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="h-36 sm:h-40 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="sm:col-span-2 space-y-3">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-600 rounded-lg" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-md" />
              </div>
              <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-8 w-24 bg-slate-300 dark:bg-slate-600 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recharts Charts Skeleton Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-5 w-56 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
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

        {/* Pie Chart Skeleton */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          <div className="h-48 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-8 border-slate-200 dark:border-slate-800 border-t-indigo-500 animate-spin" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Table Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((r) => (
            <div key={r} className="h-12 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl p-3 flex items-center justify-between">
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Quick Shortcuts Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {[1, 2].map((s) => (
          <div key={s} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-3.5 w-56 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
