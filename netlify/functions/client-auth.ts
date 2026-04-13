import { pool } from "./lib/db";
import * as crypto from "crypto";

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

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const { action, email, password, fullName, businessName } = JSON.parse(event.body || "{}");

    if (action === "register") {
      const existing = await pool.query("SELECT id FROM clients WHERE email = $1", [email]);
      if (existing.rows.length > 0) return { statusCode: 400, headers, body: JSON.stringify({ error: "Email already registered" }) };
      const hash = hashPassword(password);
      const result = await pool.query(
        "INSERT INTO clients (email, password_hash, full_name, business_name) VALUES ($1,$2,$3,$4) RETURNING id, email, full_name, business_name, plan, subscription_status, leads_limit",
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
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, token, client: { id: client.id, email: client.email, full_name: client.full_name, business_name: client.business_name, plan: client.plan, subscription_status: client.subscription_status, leads_limit: client.leads_limit } }) };
    }

    if (action === "me") {
      const authHeader = event.headers?.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      const decoded = verifyToken(token);
      const result = await pool.query("SELECT id, email, full_name, business_name, plan, subscription_status, leads_limit FROM clients WHERE id = $1", [decoded.clientId]);
      if (result.rows.length === 0) return { statusCode: 404, headers, body: JSON.stringify({ error: "Client not found" }) };
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, client: result.rows[0] }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "Unknown action" }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
