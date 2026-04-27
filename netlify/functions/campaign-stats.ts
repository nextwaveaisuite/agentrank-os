import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    if (event.httpMethod === "GET") {
      const campaigns = await pool.query(
        `SELECT * FROM email_campaigns ORDER BY created_at DESC`
      );
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, campaigns: campaigns.rows }) };
    }

    if (event.httpMethod === "DELETE") {
      const { id } = JSON.parse(event.body || "{}");
      await pool.query(`DELETE FROM imported_leads WHERE email_campaign_id = $1`, [id]);
      await pool.query(`DELETE FROM email_campaigns WHERE id = $1`, [id]);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
