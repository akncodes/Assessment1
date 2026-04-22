import { getEnv } from "@/lib/env";

export async function generatePostSummary(content: string) {
  const { googleAiApiKey } = getEnv();

  if (!googleAiApiKey || !content.trim()) {
    return "Summary unavailable. Add GOOGLE_AI_API_KEY to enable AI summaries.";
  }

  const prompt = [
    "Create a concise summary in around 200 words.",
    "Keep the language clear, factual, and readable.",
    "Do not use bullet points or markdown.",
    "Blog content:",
    content,
  ].join("\n\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleAiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return "Summary generation failed. Post is saved without AI summary.";
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || "Summary generation returned empty output.";
}
