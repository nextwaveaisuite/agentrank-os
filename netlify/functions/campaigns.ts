import type { Handler } from "@netlify/functions";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    if (event.httpMethod === "GET") {
      const rows = await query(`SELECT * FROM campaigns ORDER BY "createdAt" DESC`);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, campaigns: rows }) };
    }
    if (event.httpMethod === "POST") {
      const { name, description, targetIndustry, targetLocation, targetCompanySize, offer } = JSON.parse(event.body ?? "{}");
      const rows = await query(`INSERT INTO campaigns (name, description, "targetIndustry", "targetLocation", "targetCompanySize", offer, status, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,'active',NOW(),NOW()) RETURNING *`, [name, description, targetIndustry, targetLocation, targetCompanySize, offer]);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, campaign: rows[0] }) };
    }
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
