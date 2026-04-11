import type { Handler } from "@netlify/functions";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    if (event.httpMethod === "GET") {
      const rows = await query(`SELECT * FROM messages ORDER BY "createdAt" DESC LIMIT 500`);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, messages: rows }) };
    }
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
