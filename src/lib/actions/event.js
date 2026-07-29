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
