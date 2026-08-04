'use server'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const createBooking = async (bookingData) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });
        const result = await res.json();
        return result;
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, error: error.message };
    }
};

export const getUserBookings = async (userEmail, page = 1, limit = 20) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/bookings/user/${encodeURIComponent(userEmail)}?page=${page}&limit=${limit}`, {
            cache: 'no-store',
        });
        const result = await res.json();
        return result;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return { success: false, error: error.message };
    }
};

export const verifyBookingSession = async (sessionId) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/bookings/verify-session/${sessionId}`, {
            cache: 'no-store',
        });
        const result = await res.json();
        return result;
    } catch (error) {
        console.error('Error verifying booking session:', error);
        return { success: false, error: error.message };
    }
};
