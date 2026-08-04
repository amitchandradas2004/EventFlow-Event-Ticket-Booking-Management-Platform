"use client";

export default function BookingsSkeleton({ cards = 6, showHeader = true }) {
  return (
    <div className="space-y-8 animate-pulse">
      {showHeader && (
        <>
          {/* Header Banner Skeleton */}
          <div className="bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-300/50 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-3 max-w-xl w-full">
              <div className="h-6 w-44 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="h-8 w-64 sm:w-80 rounded-xl bg-slate-300 dark:bg-slate-700" />
              <div className="h-4 w-full sm:w-96 rounded-lg bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="h-10 w-44 rounded-2xl bg-slate-300 dark:bg-slate-700 shrink-0" />
          </div>

          {/* Toolbar Skeleton */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="h-10 w-full md:w-80 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </>
      )}

      {/* Bookings Card Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-0"
          >
            <div>
              {/* Banner Image Skeleton */}
              <div className="relative h-40 w-full bg-slate-200 dark:bg-slate-800">
                {/* Badge Placeholders */}
                <div className="absolute top-3 left-3 h-5 w-28 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="absolute top-3 right-3 h-5 w-20 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="absolute bottom-3 left-4 h-6 w-48 rounded-lg bg-slate-300 dark:bg-slate-700" />
              </div>

              {/* Card Details Skeleton */}
              <div className="p-5 space-y-4">
                <div className="space-y-2.5">
                  {/* Date line */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 shrink-0" />
                    <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                  {/* Location line */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 shrink-0" />
                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                  {/* Seats line */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                  {/* Total paid line */}
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Skeleton */}
            <div className="mx-5 mb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="h-5 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-20 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
