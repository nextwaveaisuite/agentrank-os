import type { Handler } from "@netlify/functions";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    if (event.httpMethod === "GET") {
      const leads = await query(`SELECT * FROM leads ORDER BY "createdAt" DESC LIMIT 100`);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, leads }) };
    }

    if (event.httpMethod === "PATCH") {
      const body = JSON.parse(event.body ?? "{}");
      const { leadId, status } = body;
      await query(`UPDATE leads SET status = $1, "updatedAt" = NOW() WHERE id = $2`, [status, leadId]);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
