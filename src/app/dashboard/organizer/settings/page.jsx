import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AddOrganizationForm from "@/components/Organization/AddOrganizationForm";

export default async function OrganizerSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Organization Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your organization profile, submission details, and status preferences.
        </p>
      </div>

      <AddOrganizationForm initialEmail={session?.user?.email || ""} />
    </div>
  );
}

