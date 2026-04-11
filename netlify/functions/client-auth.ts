import { Pool } from "pg";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || "agentrank-secret-2026";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "agentrank-salt").digest("hex");
}

export const handler = async (event: any) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const { action, email, password, fullName, businessName } = JSON.parse(event.body || "{}");

    if (action === "register") {
      const existing = await pool.query("SELECT id FROM clients WHERE email = $1", [email]);
      if (existing.rows.length > 0) return { statusCode: 400, headers, body: JSON.stringify({ error: "Email already registered" }) };
      const hash = hashPassword(password);
      const result = await pool.query(
        "INSERT INTO clients (email, password_hash, full_name, business_name) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, business_name, plan, subscription_status, leads_limit",
        [email, hash, fullName, businessName]
      );
      const client = result.rows[0];
      const token = jwt.sign({ clientId: client.id, email: client.email }, JWT_SECRET, { expiresIn: "7d" });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, token, client }) };
    }

    if (action === "login") {
      const result = await pool.query("SELECT * FROM clients WHERE email = $1", [email]);
      if (result.rows.length === 0) return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid email or password" }) };
      const client = result.rows[0];
      if (client.password_hash !== hashPassword(password)) return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid email or password" }) };
      const token = jwt.sign({ clientId: client.id, email: client.email }, JWT_SECRET, { expiresIn: "7d" });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, token, client: { id: client.id, email: client.email, full_name: client.full_name, business_name: client.business_name, plan: client.plan, subscription_status: client.subscription_status, leads_limit: client.leads_limit } }) };
    }

    if (action === "me") {
      const authHeader = event.headers?.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const result = await pool.query("SELECT id, email, full_name, business_name, plan, subscription_status, leads_limit FROM clients WHERE id = $1", [decoded.clientId]);
      if (result.rows.length === 0) return { statusCode: 404, headers, body: JSON.stringify({ error: "Client not found" }) };
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, client: result.rows[0] }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "Unknown action" }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
