'use server'
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
export const payments = async (data) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.success) {
            return result;
        }
    } catch (error) {
        // console.error('Error creating payment session:', error);
        return error;
    }
};

export const getUserPayments = async (userEmail, page = 1, limit = 20) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/payments/user/${encodeURIComponent(userEmail)}?page=${page}&limit=${limit}`, {
            cache: 'no-store',
        });
        const result = await res.json();
        return result;
    } catch (error) {
        console.error('Error fetching user payments:', error);
        return { success: false, error: error.message };
    }
};