import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function POST(req) {
    try {
        const headersList = await headers();
        const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

        // 1. Verify User Authentication
        const userSession = await auth.api.getSession({
            headers: headersList,
        });

        const user = userSession?.user;
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required. Please sign in to book tickets." },
                { status: 401 }
            );
        }

        // 2. Parse payload
        const body = await req.json();
        const { eventId, quantity = 1 } = body;

        if (!eventId) {
            return NextResponse.json(
                { error: "Event ID is required" },
                { status: 400 }
            );
        }

        const qty = Math.max(1, Number(quantity));

        // 3. Fetch Event Details from Server
        const eventRes = await fetch(`${SERVER_URL}/api/event/${eventId}`, {
            cache: "no-store",
        });

        if (!eventRes.ok) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        const eventData = await eventRes.json();
        const event = eventData.result;

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        // 4. Verify Seat Capacity
        if (event.availableSeats !== undefined && event.availableSeats < qty) {
            return NextResponse.json(
                { error: `Only ${event.availableSeats} seats remaining for this event.` },
                { status: 400 }
            );
        }

        const ticketPrice = Number(event.ticketPrice || 0);

        // 5. Handle Free Event ($0) directly
        if (ticketPrice <= 0) {
            return NextResponse.json({
                isFree: true,
                eventId: String(event._id),
                quantity: qty,
                ticketPrice: 0,
                totalPrice: 0,
            });
        }

        // 6. Create Dynamic Stripe Checkout Session
        const unitAmountCents = Math.round(ticketPrice * 100);
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Ticket: ${event.title}`,
                            description: `Date: ${new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} | Location: ${event.location}`,
                            images: event.banner ? [event.banner] : [],
                        },
                        unit_amount: unitAmountCents,
                    },
                    quantity: qty,
                },
            ],
            metadata: {
                type: "event_booking",
                eventId: String(event._id),
                eventTitle: event.title,
                eventBanner: event.banner || "",
                eventDate: event.date || "",
                location: event.location || "",
                category: event.category || "General",
                organizerEmail: event.organizerEmail || "",
                userId: String(user.id),
                userEmail: user.email,
                userName: user.name || user.email,
                quantity: String(qty),
                unitPrice: String(ticketPrice),
                totalPrice: String(ticketPrice * qty),
            },
            mode: "payment",
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&type=event_booking`,
            cancel_url: `${origin}/events?canceled=true`,
        });

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });
    } catch (err) {
        console.error("Stripe event checkout error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to initiate payment" },
            { status: err.statusCode || 500 }
        );
    }
}
