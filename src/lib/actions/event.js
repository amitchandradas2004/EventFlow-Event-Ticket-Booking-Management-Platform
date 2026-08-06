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

export const getOrganizerStats = async (email) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/organizer/stats/${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-store"
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || "Failed to fetch organizer stats");
    }
    return result;
};

export const getApprovedEvents = async (limit = 6) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/event/approved?limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });
        if (!res.ok) {
            return { success: false, result: [] };
        }
        const result = await res.json();
        return result;
    } catch (err) {
        // console.error("Error in getApprovedEvents:", err);
        return { success: false, result: [] };
    }
};

export const getAllPublicEvents = async ({ page = 1, limit = 12, search = "", category = "", sortBy = "newest" } = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search: search,
            category: category,
            sortBy: sortBy
        });
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/all?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });
        if (!res.ok) {
            return { success: false, total: 0, page: 1, limit: 12, totalPages: 1, categories: [], result: [] };
        }
        const result = await res.json();
        return result;
    } catch (err) {
        // console.error("Error in getAllPublicEvents:", err);
        return { success: false, total: 0, page: 1, limit: 12, totalPages: 1, categories: [], result: [] };
    }
};

export const getAdminEvents = async (page = 1, limit = 10, search = "", status = "all") => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search: search,
            status: status
        });
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/events?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message || "Failed to fetch admin events");
        }
        return result;
    } catch (err) {
        return { success: false, total: 0, page: 1, limit: 10, totalPages: 1, result: [], stats: {} };
    }
};

export const updateEventStatus = async (id, status) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/event/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || "Failed to update event status");
    }
    revalidatePath("/dashboard/admin/events");
    return result;
};

