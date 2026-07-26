import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import OrganizationSettingsView from "@/components/Organization/OrganizationSettingsView";
import { getOrganizationByUserEmail } from "@/lib/actions/organization";

export default async function OrganizerSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const email = session?.user?.email || "";
  let initialOrganizations = [];
  let paginationInfo = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  };

  if (email) {
    try {
      const response = await getOrganizationByUserEmail(email, 1, 10);
      if (response?.result && Array.isArray(response.result)) {
        initialOrganizations = response.result;
        paginationInfo = {
          total: response.total ?? response.result.length,
          page: response.page || 1,
          limit: response.limit || 10,
          totalPages: response.totalPages || 1
        };
      } else if (Array.isArray(response)) {
        initialOrganizations = response;
        paginationInfo.total = response.length;
        paginationInfo.totalPages = Math.ceil(response.length / 10) || 1;
      } else if (response && !response.error && response._id) {
        initialOrganizations = [response];
        paginationInfo.total = 1;
        paginationInfo.totalPages = 1;
      }
    } catch (err) {
      console.error("Failed to fetch organization by user email:", err);
    }
  }

  return (
    <OrganizationSettingsView
      initialEmail={email}
      initialOrganizations={initialOrganizations}
      initialPagination={paginationInfo}
    />
  );
}
