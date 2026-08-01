import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import SuccessContent from './SuccessContent'
import { payments } from '@/lib/actions/payment'

export default async function Success({ searchParams }) {
    const params = await searchParams;
    const session_id = params?.session_id;

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

        const sessionData = {
            customerEmail: metadata?.userEmail || customer_details?.email || "",
            customerName: metadata?.userName || customer_details?.name || "",
            amountTotal: amount_total ? amount_total / 100 : 49,
            sessionId: session.id,
            paymentStatus: payment_status || "paid",
        };

        if (status === 'complete') {
            await payments({
                customerEmail: sessionData.customerEmail,
                customerName: sessionData.customerName,
                amountTotal: sessionData.amountTotal,
                sessionId: sessionData.sessionId,
                paymentStatus: sessionData.paymentStatus,
            });
        }

        return <SuccessContent sessionData={sessionData} />;
    } catch (err) {
        // console.error("Stripe session retrieval error:", err);
        return redirect('/');
    }
}