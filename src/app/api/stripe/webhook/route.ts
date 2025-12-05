import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover", // ✅ Your beta version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log("Stripe webhook event:", event.type);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ✅ Handle successful checkout
async function handleCheckoutCompleted(session: any) {
  const userId = session.metadata?.userId;
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  if (!userId || !subscriptionId) {
    console.error("Missing userId or subscriptionId in checkout session");
    return;
  }

  try {
    // Get subscription details
    const subscription: any = await stripe.subscriptions.retrieve(
      subscriptionId
    );

    // ✅ Check if customerId already exists (to avoid duplicates)
    const existingCustomer = await prisma.user.findFirst({
      where: {
        stripeCustomerId: customerId,
        id: { not: userId },
      },
    });

    if (existingCustomer) {
      console.warn(`Customer ID ${customerId} already exists for another user`);
    }

    // ✅ Handle current_period_end safely
    const periodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Update user to PRO
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "PRO",
        isPro: true,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeCurrentPeriodEnd: periodEnd,
        proExpiresAt: periodEnd,
        emailQuota: -1, // Unlimited
      },
    });

    console.log(`User ${userId} upgraded to PRO`);
  } catch (error) {
    console.error("Error upgrading user:", error);
    throw error;
  }
}

// ✅ Handle subscription updates
async function handleSubscriptionUpdated(subscription: any) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error("Missing userId in subscription metadata");
    return;
  }

  // Check if subscription is active
  const isActive = ["active", "trialing"].includes(subscription.status);

  // ✅ Safe access to current_period_end
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: isActive ? "PRO" : "USER",
      isPro: isActive,
      stripeCurrentPeriodEnd: periodEnd,
      proExpiresAt: periodEnd,
      emailQuota: isActive ? -1 : 10,
    },
  });

  console.log(
    `Subscription updated for user ${userId}: ${subscription.status}`
  );
}

// ✅ Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: any) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error("Missing userId in subscription metadata");
    return;
  }

  // Downgrade user to FREE
  await prisma.user.update({
    where: { id: userId },
    data: {
      role: "USER",
      isPro: false,
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      proExpiresAt: null,
      emailQuota: 10,
    },
  });

  console.log(`User ${userId} subscription cancelled, downgraded to FREE`);
}

// ✅ Handle successful payment
async function handlePaymentSucceeded(invoice: any) {
  // ✅ Access subscription property
  const subscriptionId = invoice.subscription;

  if (!subscriptionId) return;

  const subscription: any = await stripe.subscriptions.retrieve(
    typeof subscriptionId === "string" ? subscriptionId : subscriptionId.id
  );

  const userId = subscription.metadata?.userId;

  if (!userId) return;

  // ✅ Safe access to period end
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;

  // Extend PRO period
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCurrentPeriodEnd: periodEnd,
      proExpiresAt: periodEnd,
    },
  });

  console.log(`Payment succeeded for user ${userId}`);
}

// ✅ Handle failed payment
async function handlePaymentFailed(invoice: any) {
  // ✅ Access subscription property
  const subscriptionId = invoice.subscription;

  if (!subscriptionId) return;

  const subscription: any = await stripe.subscriptions.retrieve(
    typeof subscriptionId === "string" ? subscriptionId : subscriptionId.id
  );

  const userId = subscription.metadata?.userId;

  if (!userId) return;

  // Optionally notify user about payment failure
  console.error(`Payment failed for user ${userId}`);

  // TODO: Send email notification here
}
