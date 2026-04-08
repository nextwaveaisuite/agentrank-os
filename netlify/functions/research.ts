import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const { targetIndustry, targetLocation, targetCompanySize, offer, count = 5, campaignId } = JSON.parse(event.body ?? "{}");
    const prompt = `Find ${count} high-quality ${targetIndustry} business leads in ${targetLocation}${targetCompanySize ? `, size: ${targetCompanySize}` : ""}. Offer: ${offer}. Return JSON array: [{"businessName":"","contactName":"","email":"","phone":"","website":"","linkedinUrl":"","industry":"","location":"","companySize":"","estimatedRevenue":"","source":"","researchNotes":"","painPoints":""}]`;
    const response = await askClaude(PROMPTS.researcher, prompt);
    const leads = parseJSON<any[]>(response, []);
    let saved = 0;
    for (const lead of leads) {
      try {
        await query(`INSERT INTO leads ("businessName","contactName",email,phone,website,"linkedinUrl",industry,location,"companySize","estimatedRevenue",source,"researchNotes","painPoints",status,"campaignId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'new',$14,NOW(),NOW())`, [lead.businessName,lead.contactName,lead.email,lead.phone,lead.website,lead.linkedinUrl,lead.industry,lead.location,lead.companySize,lead.estimatedRevenue,lead.source,lead.researchNotes,lead.painPoints,campaignId||null]);
        saved++;
      } catch {}
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, leadsCreated: saved, leads }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
