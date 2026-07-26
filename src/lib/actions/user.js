'use server'

import { revalidatePath } from "next/cache";

export const getUpdatedUser = async (email) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${email}`);
    const data = await res.json();
    return data;
}

export const updateUserInfo = async ({ email, name, image }) => {
    if (!email) {
        throw new Error('Email is required for update');
    }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${email}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, image }),
            }
        );
        if (!res.ok) {
            throw new Error('Failed to update user');
        }

        revalidatePath(`/dashboard/${email}/profile`);
        const data = await res.json();
        return data;
    } catch (error) {
        throw error;
    }
};