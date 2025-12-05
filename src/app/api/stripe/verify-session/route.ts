import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
});

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    // Retrieve checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        status: checkoutSession.payment_status,
      });
    }

    return NextResponse.json({
      success: false,
      status: checkoutSession.payment_status,
    });
  } catch (error: any) {
    console.error("Verify session error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
