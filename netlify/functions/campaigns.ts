import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    if (event.httpMethod === "GET") {
      const result = await pool.query("SELECT * FROM campaigns ORDER BY created_at DESC");
      return { statusCode: 200, headers, body: JSON.stringify({ campaigns: result.rows }) };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const {
        name, target_industry, target_location, offer,
        mode, niche, affiliate_url,
        auto_research, auto_write, auto_outreach, auto_qualify
      } = body;

      const result = await pool.query(
        `INSERT INTO campaigns
          (name, target_industry, target_location, offer, mode, niche, affiliate_url, auto_research, auto_write, auto_outreach, auto_qualify, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'active')
         RETURNING *`,
        [
          name,
          target_industry,
          target_location,
          offer,
          mode || "business",
          niche || null,
          affiliate_url || null,
          auto_research ?? true,
          auto_write ?? true,
          auto_outreach ?? true,
          auto_qualify ?? true
        ]
      );
      return { statusCode: 200, headers, body: JSON.stringify({ campaign: result.rows[0] }) };
    }

    if (event.httpMethod === "PATCH") {
      const { id, status } = JSON.parse(event.body || "{}");
      await pool.query("UPDATE campaigns SET status = $1 WHERE id = $2", [status, id]);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
