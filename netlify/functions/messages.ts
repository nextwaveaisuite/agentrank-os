import { pool } from "./lib/db";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const leadId = event.queryStringParameters?.leadId;
    if (!leadId) return { statusCode: 400, headers, body: JSON.stringify({ error: "leadId required" }) };
    const result = await pool.query("SELECT * FROM messages WHERE lead_id = $1 ORDER BY created_at ASC", [leadId]);
    return { statusCode: 200, headers, body: JSON.stringify({ messages: result.rows }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
