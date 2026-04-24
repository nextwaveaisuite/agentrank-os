import { Pool } from "pg";
import * as crypto from "crypto";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || "agentrank-secret-2026";
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization" };

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "agentrank-salt").digest("hex");
}

function signToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 })).toString("base64url");
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

function verifyToken(token: string): any {
  const [header, body, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  if (sig !== expected) throw new Error("Invalid token");
  const payload = JSON.parse(Buffer.from(body, "base64url").toString());
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Token expired");
  return payload;
}

const PLAN_LIMITS: Record<string, number> = {
  a_starter: 20,
  a_basic: 75,
  a_pro: 200,
  a_elite: 9999,
  b_starter: 15,
  b_growth: 40,
  b_agency: 9999,
  none: 0,
};

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const body = JSON.parse(event.body || "{}");
    const { action, email, password, fullName, businessName } = body;

    if (action === "register") {
      const existing = await pool.query("SELECT id FROM clients WHERE email = $1", [email]);
      if (existing.rows.length > 0) return { statusCode: 400, headers, body: JSON.stringify({ error: "Email already registered" }) };
      const hash = hashPassword(password);
      const result = await pool.query(
        `INSERT INTO clients (email, password_hash, full_name, business_name, plan, subscription_status, leads_limit, leads_used, billing_cycle_start)
         VALUES ($1,$2,$3,$4,'none','inactive',0,0,NOW()) RETURNING id, email, full_name, business_name, plan, subscription_status, leads_limit, leads_used`,
        [email, hash, fullName, businessName]
      );
      const client = result.rows[0];
      const token = signToken({ clientId: client.id, email: client.email });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, token, client }) };
    }

    if (action === "login") {
      const result = await pool.query("SELECT * FROM clients WHERE email = $1", [email]);
      if (result.rows.length === 0) return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid email or password" }) };
      const client = result.rows[0];
      if (client.password_hash !== hashPassword(password)) return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid email or password" }) };
      const token = signToken({ clientId: client.id, email: client.email });
      return {
        statusCode: 200, headers, body: JSON.stringify({
          success: true, token, client: {
            id: client.id, email: client.email,
            full_name: client.full_name, business_name: client.business_name,
            plan: client.plan, subscription_status: client.subscription_status,
            leads_limit: client.leads_limit, leads_used: client.leads_used || 0
          }
        })
      };
    }

    if (action === "me") {
      const authHeader = event.headers?.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      const decoded = verifyToken(token);
      const result = await pool.query(
        "SELECT id, email, full_name, business_name, plan, subscription_status, leads_limit, leads_used, billing_cycle_start FROM clients WHERE id = $1",
        [decoded.clientId]
      );
      if (result.rows.length === 0) return { statusCode: 404, headers, body: JSON.stringify({ error: "Client not found" }) };
      const client = result.rows[0];

      // Reset leads_used if billing cycle has reset
      const cycleStart = new Date(client.billing_cycle_start);
      const now = new Date();
      const daysSinceCycle = (now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCycle >= 30) {
        await pool.query("UPDATE clients SET leads_used = 0, billing_cycle_start = NOW() WHERE id = $1", [client.id]);
        client.leads_used = 0;
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, client }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "Unknown action" }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
