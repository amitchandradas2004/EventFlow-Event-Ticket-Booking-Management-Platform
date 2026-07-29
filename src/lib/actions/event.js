'use server';

import { revalidatePath } from "next/cache";

export const addEvent = async (eventData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/event`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || "Failed to create event");
    }
    revalidatePath("/dashboard/organizer/events");
    revalidatePath("/dashboard/organizer/add-event");
    return result;
};

export const getEventsByOrganizerEmail = async (email, page = 1, limit = 10, search = "") => {
    const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search
    });
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/event/organizer/${encodeURIComponent(email)}?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-store"
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || "Failed to fetch events");
    }
    return result;
};

export const deleteEventById = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/event/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || "Failed to delete event");
    }
    revalidatePath("/dashboard/organizer/events");
    return result;
};

export const updateEventById = async (id, data) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/event/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || "Failed to update event");
    }
    revalidatePath("/dashboard/organizer/events");
    return result;
};
