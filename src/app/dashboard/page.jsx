"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else {
        const role = (session?.user?.role || "attendee").toLowerCase();
        if (role === "admin") {
          router.push("/dashboard/admin/overview");
        } else if (role === "organizer") {
          router.push("/dashboard/organizer/overview");
        } else {
          router.push("/dashboard/attendee/overview");
        }
      }
    }
  }, [isPending, session, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
