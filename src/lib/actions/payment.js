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
}