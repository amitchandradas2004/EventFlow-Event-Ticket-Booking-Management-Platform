"use client";

export default function OrganizationTableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl overflow-hidden animate-pulse">
      {/* HEADER BAR SKELETON */}
      <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 dark:bg-indigo-400/20" />
            <div className="h-6 w-40 sm:w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="h-4 w-56 sm:w-72 bg-slate-200/70 dark:bg-slate-800/60 rounded-md" />
        </div>
        <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-full self-start sm:self-auto" />
      </div>

      {/* MOBILE CARD SKELETON VIEW (< sm) */}
      <div className="block sm:hidden divide-y divide-slate-200/70 dark:divide-slate-800/70">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 min-w-0">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-3 w-40 bg-slate-200/70 dark:bg-slate-800/60 rounded-md" />
                </div>
              </div>
              <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="h-3.5 w-28 bg-slate-200/70 dark:bg-slate-800/60 rounded-md" />
              <div className="flex items-center gap-1">
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE SKELETON VIEW (>= sm) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-4 px-6">Organization</th>
              <th className="py-4 px-6">Website</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx}>
                {/* Organization & Logo */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                      <div className="h-3.5 w-44 bg-slate-200/70 dark:bg-slate-800/60 rounded-md" />
                    </div>
                  </div>
                </td>

                {/* Website */}
                <td className="py-4 px-6">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION SKELETON */}
      <div className="p-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="flex items-center gap-1.5">
          <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-1">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-8 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
