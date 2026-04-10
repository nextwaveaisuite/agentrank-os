import type { Handler } from "@netlify/functions";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    if (event.httpMethod === "GET") {
      const rows = await query(`SELECT * FROM leads ORDER BY "createdAt" DESC LIMIT 100`);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, leads: rows }) };
    }
    if (event.httpMethod === "PATCH") {
      const { leadId, status } = JSON.parse(event.body ?? "{}");
      await query(`UPDATE leads SET status=$1, "updatedAt"=NOW() WHERE id=$2`, [status, leadId]);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
