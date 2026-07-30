import OrganizationTableSkeleton from "@/components/Organization/OrganizationTableSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6 container mx-auto animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 dark:bg-indigo-400/20" />
            <div className="h-7 w-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-4 w-72 sm:w-96 bg-slate-200/70 dark:bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-40 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>

      {/* TABLE SKELETON */}
      <OrganizationTableSkeleton rows={10} />
    </div>
  );
}
