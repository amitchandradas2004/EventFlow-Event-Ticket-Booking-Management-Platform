export default function ProfileSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Page Title Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800/60 rounded-lg animate-pulse" />
      </div>

      {/* Main Profile Card Skeleton */}
      <div className="w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl">
        {/* Banner Skeleton */}
        <div className="h-28 sm:h-36 bg-slate-200 dark:bg-slate-800 animate-pulse relative p-6">
          <div className="flex justify-end gap-2">
            <div className="h-6 w-24 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="relative px-6 pb-6 pt-0 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
            {/* Avatar Circle Skeleton */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 animate-pulse shadow-xl" />

            {/* Action Button Skeleton */}
            <div className="h-10 w-44 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse self-start sm:self-auto" />
          </div>

          {/* User Details Header Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-52 bg-slate-200 dark:bg-slate-800/70 rounded-lg animate-pulse" />
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800/70 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Detail Cards Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 p-4 border border-slate-200/60 dark:border-slate-700/50 space-y-2"
              >
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700/60 rounded-md animate-pulse" />
                <div className="h-5 w-28 bg-slate-300 dark:bg-slate-700 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
