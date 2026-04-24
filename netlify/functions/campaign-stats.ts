import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const campaigns = await pool.query(
      `SELECT * FROM email_campaigns ORDER BY created_at DESC`
    );
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, campaigns: campaigns.rows }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
