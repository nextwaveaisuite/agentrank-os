import { pool } from "./lib/db";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization" };

const PLAN_CONFIG: Record<string, { priceId: string; limit: number }> = {
  b_starter: { priceId: process.env.STRIPE_B_STARTER_PRICE_ID || "", limit: 15 },
  b_growth: { priceId: process.env.STRIPE_B_GROWTH_PRICE_ID || "", limit: 40 },
  b_agency: { priceId: process.env.STRIPE_B_AGENCY_PRICE_ID || "", limit: 999 },
  a_starter: { priceId: process.env.STRIPE_A_STARTER_PRICE_ID || "", limit: 20 },
  a_basic: { priceId: process.env.STRIPE_A_BASIC_PRICE_ID || "", limit: 75 },
  a_pro: { priceId: process.env.STRIPE_A_PRO_PRICE_ID || "", limit: 200 },
  a_elite: { priceId: process.env.STRIPE_A_ELITE_PRICE_ID || "", limit: 9999 },
};

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: "Stripe not configured" }) };

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" });

    const authHeader = event.headers?.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    const crypto = await import("crypto");
    const JWT_SECRET = process.env.JWT_SECRET || "agentrank-secret-2026";
    const [h, b, s] = token.split(".");
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${b}`).digest("base64url");
    if (s !== expected) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
    const payload = JSON.parse(Buffer.from(b, "base64url").toString());

    const { plan } = JSON.parse(event.body || "{}");
    const planInfo = PLAN_CONFIG[plan];
    if (!planInfo) return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid plan" }) };

    const clientResult = await pool.query("SELECT * FROM clients WHERE id = $1", [payload.clientId]);
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
