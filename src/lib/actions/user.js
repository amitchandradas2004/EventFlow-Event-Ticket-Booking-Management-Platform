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

export const getAdminUsers = async (page = 1, limit = 10, search = '', role = '', status = '') => {
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            search: search || '',
            role: role || '',
            status: status || ''
        });

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users?${params.toString()}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch admin users');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in getAdminUsers:', error);
        return { success: false, message: error.message, result: [] };
    }
};

export const toggleUserBlockStatus = async (userId, isBlocked) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/user/${userId}/status`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isBlocked }),
            }
        );

        if (!res.ok) {
            throw new Error('Failed to update user block status');
        }

        revalidatePath('/dashboard/admin/users');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in toggleUserBlockStatus:', error);
        throw error;
    }
};