export const getUpdatedUser = async (email) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${email}`);
    const data = await res.json();
    return data;
}