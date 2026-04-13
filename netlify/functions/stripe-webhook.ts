import { pool } from "./lib/db";

const headers = { "Content-Type": "application/json" };

const PLAN_LIMITS: Record<string, number> = {
  b_starter: 15, b_growth: 40, b_agency: 999,
  a_starter: 20, a_basic: 75, a_pro: 200, a_elite: 9999,
};

export const handler = async (event: any) => {
  try {
    const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
    const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
    if (!STRIPE_KEY || !WEBHOOK_SECRET) return { statusCode: 500, headers, body: JSON.stringify({ error: "Stripe not configured" }) };

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" });

    const sig = event.headers["stripe-signature"];
    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, WEBHOOK_SECRET);
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Webhook signature failed" }) };
    }

    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object as any;
      const clientId = session.metadata?.clientId;
      const plan = session.metadata?.plan || "b_starter";
      const limit = PLAN_LIMITS[plan] || 15;
      await pool.query(
        "UPDATE clients SET plan = $1, subscription_status = $2, stripe_subscription_id = $3, leads_limit = $4 WHERE id = $5",
        [plan, "active", session.subscription, limit, clientId]
      );
    }

    if (stripeEvent.type === "customer.subscription.deleted") {
      const sub = stripeEvent.data.object as any;
      await pool.query(
        "UPDATE clients SET subscription_status = $1, plan = $2, leads_limit = $3 WHERE stripe_subscription_id = $4",
        ["inactive", "none", 0, sub.id]
      );
    }

    return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
