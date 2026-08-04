"use client";

export default function PaymentsSkeleton({ rows = 5, showHeader = true }) {
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
            <div className="h-10 w-36 rounded-2xl bg-slate-300 dark:bg-slate-700 shrink-0" />
          </div>

          {/* Stat Cards Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between"
              >
                <div className="space-y-2 w-full pr-4">
                  <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded-xl" />
                  <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              </div>
            ))}
          </div>

          {/* Toolbar Search Skeleton */}
          <div className="flex items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="h-10 w-full max-w-md rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded hidden sm:block" />
          </div>
        </>
      )}

      {/* Payment Table Card Container Skeleton */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">
                  <div className="h-3.5 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="px-6 py-4">
                  <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="px-6 py-4">
                  <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="px-6 py-4">
                  <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="px-6 py-4 text-right">
                  <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="h-3.5 w-14 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {Array.from({ length: rows }).map((_, idx) => (
                <tr key={idx}>
                  {/* Event Title & Session ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                      <div className="space-y-1.5 w-full">
                        <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
                        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md ml-auto" />
                  </td>

                  {/* Receipt Action */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
