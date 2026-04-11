import Stripe from "stripe";
import { Pool } from "pg";
import * as jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || "agentrank-secret-2026";

const PLANS: Record<string, { priceId: string; name: string; limit: number }> = {
  starter: { priceId: process.env.STRIPE_STARTER_PRICE_ID || "", name: "Starter", limit: 15 },
  growth: { priceId: process.env.STRIPE_GROWTH_PRICE_ID || "", name: "Growth", limit: 40 },
  agency: { priceId: process.env.STRIPE_AGENCY_PRICE_ID || "", name: "Agency", limit: 999 },
};

export const handler = async (event: any) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const authHeader = event.headers?.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const { plan } = JSON.parse(event.body || "{}");
    const planInfo = PLANS[plan];
    if (!planInfo) return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid plan" }) };

    const clientResult = await pool.query("SELECT * FROM clients WHERE id = $1", [decoded.clientId]);
    const client = clientResult.rows[0];

    let customerId = client.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: client.email, name: client.full_name || client.business_name });
      customerId = customer.id;
      await pool.query("UPDATE clients SET stripe_customer_id = $1 WHERE id = $2", [customerId, client.id]);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: planInfo.priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `https://agentrank-os.netlify.app/portal?success=true`,
      cancel_url: `https://agentrank-os.netlify.app/pricing`,
      metadata: { clientId: String(client.id), plan },
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, url: session.url }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
