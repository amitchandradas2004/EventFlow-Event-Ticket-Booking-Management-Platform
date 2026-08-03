import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST() {
    try {
        const headersList = await headers();
        const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
        const userSession = await auth.api.getSession({
            headers: headersList,
        });

        const user = userSession?.user;
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        if (user?.isPremium) {
            return NextResponse.json(
                { error: "You are already a premium member" },
                { status: 400 }
            );
        }

        const PRICE_ID = process.env.PRICE_ID;
        const session = await stripe.checkout.sessions.create({
            customer_email: user?.email,
            line_items: [
                {
                    price: PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                priceId: PRICE_ID,
                userId: user?.id,
                userEmail: user?.email,
                userRole: user?.role,
                userName: user?.name,
                amount: 49,
                status: "completed",
            },
            mode: "payment",
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel?canceled=true`,
        });

        return NextResponse.redirect(session.url, 303);
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}
