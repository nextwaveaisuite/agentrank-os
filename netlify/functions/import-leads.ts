import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const { leads, campaignName, subject, body } = JSON.parse(event.body || "{}");

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "No leads provided" }) };
    }

    const campaign = await pool.query(
      `INSERT INTO email_campaigns (name, subject, body, status, total_leads)
       VALUES ($1, $2, $3, 'ready', $4) RETURNING *`,
      [campaignName || "MLGS Import", subject, body, leads.length]
    );

    const campaignId = campaign.rows[0].id;

    const inserted = [];
    for (const lead of leads) {
      const r = await pool.query(
        `INSERT INTO imported_leads
          (email_campaign_id, first_name, last_name, email, state, postcode, status)
         VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING *`,
        [campaignId, lead.first_name, lead.last_name, lead.email, lead.state || null, lead.postcode || null]
      );
      inserted.push(r.rows[0]);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, campaignId, total: inserted.length }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
