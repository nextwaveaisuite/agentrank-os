import { askClaude, PROMPTS } from "./lib/claude";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const { agentRole, message } = JSON.parse(event.body || "{}");
    const systemPrompt = PROMPTS.chat(agentRole);
    const response = await askClaude(systemPrompt, message);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, response }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
