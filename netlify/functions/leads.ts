import { pool } from "./lib/db";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    if (event.httpMethod === "GET") {
      const clientId = event.queryStringParameters?.clientId;
      let result;
      if (clientId) {
        result = await pool.query("SELECT l.* FROM leads l JOIN client_campaigns cc ON cc.campaign_id = l.campaign_id WHERE cc.client_id = $1 ORDER BY l.created_at DESC", [clientId]);
      } else {
        result = await pool.query("SELECT * FROM leads ORDER BY created_at DESC");
      }
      return { statusCode: 200, headers, body: JSON.stringify({ leads: result.rows }) };
    }

    if (event.httpMethod === "PATCH") {
      const { id, status, notes, qualification_score } = JSON.parse(event.body || "{}");
      const fields = [];
      const vals: any[] = [];
      let i = 1;
      if (status !== undefined) { fields.push(`status = $${i++}`); vals.push(status); }
      if (notes !== undefined) { fields.push(`notes = $${i++}`); vals.push(notes); }
      if (qualification_score !== undefined) { fields.push(`qualification_score = $${i++}`); vals.push(qualification_score); }
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
