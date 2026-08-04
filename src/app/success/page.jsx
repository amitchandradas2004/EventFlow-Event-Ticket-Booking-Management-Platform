import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import SuccessContent from './SuccessContent'
import { payments } from '@/lib/actions/payment'
import { createBooking } from '@/lib/actions/booking'

export default async function Success({ searchParams }) {
    const params = await searchParams;
    const session_id = params?.session_id;
    const type = params?.type;

    if (!session_id) {
        return redirect('/');
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items', 'payment_intent']
        });

        const { status, customer_details, amount_total, payment_status, metadata } = session;

        if (status === 'open') {
            return redirect('/');
        }

        const isEventBooking = type === 'event_booking' || metadata?.type === 'event_booking';

        let bookingInfo = null;

        if (status === 'complete') {
            if (isEventBooking && metadata?.eventId) {
                const bookingResult = await createBooking({
                    eventId: metadata.eventId,
                    eventTitle: metadata.eventTitle || "Event Ticket",
                    eventBanner: metadata.eventBanner || "",
                    eventDate: metadata.eventDate || "",
                    location: metadata.location || "",
                    category: metadata.category || "General",
                    userEmail: metadata.userEmail || customer_details?.email || "",
                    userName: metadata.userName || customer_details?.name || "",
                    quantity: Number(metadata.quantity || 1),
                    unitPrice: Number(metadata.unitPrice || 0),
                    totalPrice: amount_total ? amount_total / 100 : Number(metadata.totalPrice || 0),
                    paymentStatus: payment_status || "paid",
                    stripeSessionId: session.id,
                    organizerEmail: metadata.organizerEmail || "",
                });

                if (bookingResult?.booking) {
                    bookingInfo = bookingResult.booking;
                }
            } else {
                // Membership payment
                await payments({
                    customerEmail: metadata?.userEmail || customer_details?.email || "",
                    customerName: metadata?.userName || customer_details?.name || "",
                    amountTotal: amount_total ? amount_total / 100 : 49,
                    sessionId: session.id,
                    paymentStatus: payment_status || "paid",
                });
            }
        }

        const sessionData = {
            customerEmail: metadata?.userEmail || customer_details?.email || "",
            customerName: metadata?.userName || customer_details?.name || "",
            amountTotal: amount_total ? amount_total / 100 : 0,
            sessionId: session.id,
            paymentStatus: payment_status || "paid",
            isEventBooking,
            eventTitle: metadata?.eventTitle || "",
            eventBanner: metadata?.eventBanner || "",
            eventDate: metadata?.eventDate || "",
            location: metadata?.location || "",
            quantity: Number(metadata?.quantity || 1),
            ticketCode: bookingInfo?.ticketCode || null,
            bookingId: bookingInfo?._id || null,
        };

        return <SuccessContent sessionData={sessionData} />;
    } catch (err) {
        console.error("Stripe session retrieval error:", err);
        return redirect('/');
    }
}