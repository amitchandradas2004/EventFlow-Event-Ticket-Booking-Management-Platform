import OrganizerOverviewView from "@/components/Overview/OrganizerOverviewView";

export const metadata = {
  title: "Organizer Overview | EventFlow Dashboard",
  description: "View created events, organizations, and status breakdown analytics."
};

export default function OrganizerOverviewPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <OrganizerOverviewView />
    </div>
  );
}
