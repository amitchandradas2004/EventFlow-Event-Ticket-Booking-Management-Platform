'use server'

import { revalidatePath } from "next/cache";

export const addOrganization = async (data) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/organization`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message);
    }
    revalidatePath("/dashboard/organizer/settings");
    return result;
}


export const getOrganizationByUserEmail = async (email, page = 1, limit = 10) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/organization/${email}?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-store"
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message);
    }
    return result;
};

export const deleteOrganizationById = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/organization/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message);
    }
    revalidatePath("/dashboard/organizer/settings");
    return result;
};

export const updateOrganizationById = async (id, data) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/organization/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message);
    }
    revalidatePath("/dashboard/organizer/settings");
    return result;
};