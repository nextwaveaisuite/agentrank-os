import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    if (event.httpMethod === "GET") {
      const clientId = event.queryStringParameters?.clientId;
      let rows;
      if (clientId) {
        const r = await pool.query(
          `SELECT l.* FROM leads l
           JOIN client_campaigns cc ON cc."campaignId" = l."campaignId"
           WHERE cc."clientId" = $1
           ORDER BY l."createdAt" DESC`,
          [clientId]
        );
        rows = r.rows;
      } else {
        const r = await pool.query(`SELECT * FROM leads ORDER BY "createdAt" DESC`);
        rows = r.rows;
      }

      const leads = rows.map((l: any) => ({
        id: l.id,
        business_name: l.businessName || l.business_name,
        contact_name: l.contactName || l.contact_name,
        email: l.email,
        phone: l.phone,
        website: l.website,
        industry: l.industry,
        location: l.location,
        notes: l.notes || l.researchNotes,
        status: l.status,
        qualification_score: l.qualificationScore || l.qualification_score,
        campaign_id: l.campaignId || l.campaign_id,
        mode: l.mode || "business",
        created_at: l.createdAt,
      }));

      return { statusCode: 200, headers, body: JSON.stringify({ leads }) };
    }

    if (event.httpMethod === "PATCH") {
      const { id, status, notes, qualification_score } = JSON.parse(event.body || "{}");
      const fields = [];
      const vals: any[] = [];
      let i = 1;
      if (status !== undefined) { fields.push(`status = $${i++}`); vals.push(status); }
      if (notes !== undefined) { fields.push(`notes = $${i++}`); vals.push(notes); }
      if (qualification_score !== undefined) { fields.push(`"qualificationScore" = $${i++}`); vals.push(qualification_score); }
      if (fields.length === 0) return { statusCode: 400, headers, body: JSON.stringify({ error: "Nothing to update" }) };
      vals.push(id);
      await pool.query(`UPDATE leads SET ${fields.join(", ")} WHERE id = $${i}`, vals);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
