import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUpdatedUser } from "@/lib/actions/user";
import { headers } from "next/headers";
import ProfileCard from "@/components/ProfileCard/ProfileCard";

export default async function AttendeeProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await getUpdatedUser(session?.user?.email);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Details</h1>
        <p className="text-slate-500 dark:text-slate-400">View and update your personal account information.</p>
      </div>
      <ProfileCard user={user} />
    </div>
  );
}
