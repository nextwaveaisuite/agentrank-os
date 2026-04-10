import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const { targetIndustry, targetLocation, targetCompanySize, offer, campaignId } = JSON.parse(event.body ?? "{}");
    const prompt = `Find 3 real ${targetIndustry} businesses in ${targetLocation}. Return JSON array only: [{"businessName":"","contactName":"","email":"","industry":"${targetIndustry}","location":"${targetLocation}","companySize":"${targetCompanySize||"small"}","researchNotes":"","painPoints":"","source":"Google Search"}]`;
    const response = await askClaude(PROMPTS.researcher, prompt);
    const leads = parseJSON<any[]>(response, []);
    let saved = 0;
    for (const lead of leads) {
      try {
        await query(
          `INSERT INTO leads ("businessName","contactName",email,industry,location,"companySize","researchNotes","painPoints",source,status,"campaignId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'new',$10,NOW(),NOW())`,
          [lead.businessName, lead.contactName, lead.email||null, lead.industry, lead.location, lead.companySize, lead.researchNotes, lead.painPoints, lead.source||"Google Search", campaignId||null]
        );
        saved++;
      } catch {}
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, leadsCreated: saved, leads }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
