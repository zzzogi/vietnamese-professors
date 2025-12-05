import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { billingCycle } = body;

    // Price IDs from Stripe Dashboard
    const priceId =
      billingCycle === "yearly"
        ? process.env.STRIPE_PRICE_ID_YEARLY
        : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      throw new Error("Price ID not configured");
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: session.user.id,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
      allow_promotion_codes: true,
    });

    // ✅ Return checkout URL directly
    return NextResponse.json({
      sessionId: checkoutSession.id,
      checkoutUrl: checkoutSession.url, // ✅ Add this
    });
  } catch (error: any) {
    console.error("Create checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
