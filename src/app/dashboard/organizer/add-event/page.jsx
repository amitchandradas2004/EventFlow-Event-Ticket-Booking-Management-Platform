import AddEventForm from "@/components/Event/AddEventForm";

export const metadata = {
  title: "Add Event | EventFlow Organizer Dashboard",
  description: "Create and publish a new event listing under your organization."
};

export default function OrganizerAddEventPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Add New Event
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select an organization and configure event pricing, date, capacity, and details.
        </p>
      </div>

      <AddEventForm />
    </div>
  );
}
