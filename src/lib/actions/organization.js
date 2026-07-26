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
