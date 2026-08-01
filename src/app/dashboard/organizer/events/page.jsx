"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { getEventsByOrganizerEmail } from "@/lib/actions/event";
import EventTable from "@/components/Event/EventTable";
import toast from "react-hot-toast";

export default function OrganizerManageEventsPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEvents = useCallback(
    async (email, page = 1, search = "") => {
      if (!email) return;
      try {
        setIsLoading(true);
        const res = await getEventsByOrganizerEmail(email, page, 10, search);
        if (res?.success) {
          setEvents(res.result || []);
          setTotalCount(res.total || 0);
          setCurrentPage(res.page || 1);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        // console.error("Error fetching events:", err);
        toast.error("Failed to load your events");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (session?.user?.email) {
      fetchEvents(session.user.email, currentPage, searchTerm);
    } else if (!sessionLoading) {
      setIsLoading(false);
    }
  }, [session, sessionLoading, currentPage, searchTerm, fetchEvents]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeleteEvent = (deletedId) => {
    setEvents((prev) => prev.filter((ev) => ev._id !== deletedId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  const handleUpdateEvent = (updatedEv) => {
    setEvents((prev) =>
      prev.map((ev) => (ev._id === updatedEv._id ? { ...ev, ...updatedEv } : ev))
    );
  };

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Manage Events
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View, edit, and track all your published and pending event listings.
        </p>
      </div>

      <EventTable
        events={events}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading || sessionLoading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onDeleteEvent={handleDeleteEvent}
        onUpdateEvent={handleUpdateEvent}
      />
    </div>
  );
}
