// Remove createServerFn entirely
// src/lib/gemini.ts

const GEMINI_MODEL = "gemini-2.5-flash";

async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return "[AI Response Placeholder] — VITE_GEMINI_API_KEY is not configured.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini API error:", res.status, errText);
    return `[AI Error] Failed to generate response (${res.status}).`;
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "[No response generated]";
}

export async function generateFollowUp(input: { leadName: string; company: string; lastMessage: string; notes: string; tone: string }) {
  const prompt = `Write a concise, professional follow-up message for a sales lead.
Lead Name: ${input.leadName}
Company: ${input.company}
Last Message/Context: ${input.lastMessage || input.notes}
Tone: ${input.tone}
Write a natural, human follow-up email. Keep it concise (3-5 sentences). Include a clear call to action.`;

  const systemInstruction = `You are a skilled sales assistant. Write follow-up messages that sound human, ${input.tone}, and effective. Never include subject lines.`;
  return { text: await callGemini(prompt, systemInstruction) };
}

export async function summarizeConversation(input: { conversationText: string; leadName: string; company: string }) {
  const prompt = `Summarize this sales conversation with ${input.leadName} from ${input.company}. Identify the client intent and suggest the next best action.
Conversation:
${input.conversationText}
Respond with:
📋 Summary: (2-3 sentence summary)
🎯 Intent: (what the client wants)
➡️ Next Step: (recommended action)`;

  return { text: await callGemini(prompt, "You are a sales intelligence assistant. Provide clear, actionable summaries.") };
}

export async function getSmartSuggestions(input: { leadName: string; company: string; status: string; notes: string; messageHistory: string }) {
  const prompt = `Based on this lead data, suggest the best next action.
Lead: ${input.leadName} at ${input.company}
Current Status: ${input.status}
Notes: ${input.notes}
Message History: ${input.messageHistory || "No messages yet"}
Respond with:
💡 Recommended Action: (specific next step)
📊 Deal Assessment: (probability and reasoning)
🗓️ Timing: (when to follow up)`;

  return { text: await callGemini(prompt, "You are an AI sales advisor. Give specific, actionable suggestions.") };
}