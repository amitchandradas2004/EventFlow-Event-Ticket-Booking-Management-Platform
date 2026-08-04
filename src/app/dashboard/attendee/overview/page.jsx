import AttendeeOverviewView from "@/components/Overview/AttendeeOverviewView";

export const metadata = {
  title: "Attendee Overview | EventFlow Dashboard",
  description: "View attendee profile details, ticket stats, spending analytics, and upcoming event passes."
};

export default function AttendeeOverviewPage() {
  return (
    <div className="container mx-auto">
      <AttendeeOverviewView />
    </div>
  );
}
