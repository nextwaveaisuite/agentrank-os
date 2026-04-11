import Stripe from "stripe";
import { Pool } from "pg";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const PLAN_LIMITS: Record<string, number> = {
  starter: 15,
  growth: 40,
  agency: 999,
};

export const handler = async (event: any) => {
  const headers = { "Content-Type": "application/json" };
  const sig = event.headers["stripe-signature"];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err: any) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Webhook signature failed" }) };
  }

  try {
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const clientId = session.metadata?.clientId;
      const plan = session.metadata?.plan || "starter";
      const limit = PLAN_LIMITS[plan] || 15;

      await pool.query(
        "UPDATE clients SET plan = $1, subscription_status = $2, stripe_subscription_id = $3, leads_limit = $4 WHERE id = $5",
        [plan, "active", session.subscription, limit, clientId]
      );
    }

    if (stripeEvent.type === "customer.subscription.deleted") {
      const sub = stripeEvent.data.object as Stripe.Subscription;
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
