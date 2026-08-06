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

export const getAdminTransactions = async (page = 1, limit = 10, search = "", type = "all", status = "all") => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search: search,
            type: type,
            status: status
        });
        const res = await fetch(`${SERVER_URL}/api/admin/transactions?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message || "Failed to fetch admin transactions");
        }
        return result;
    } catch (err) {
        console.error("Error in getAdminTransactions:", err);
        return { success: false, total: 0, page: 1, limit: 10, totalPages: 1, result: [], stats: {} };
    }
};