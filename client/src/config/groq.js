const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_MODELS = {
  fast: "llama-3.1-8b-instant",
  quality: "llama-3.3-70b-versatile",
};

export function parseJsonFromResponse(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] || text).trim();
  return JSON.parse(raw);
}

export function truncateText(text, max = 6000) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max)}\n...[truncated for length]`;
}

export async function generateGroqText(prompt, model = GROQ_MODELS.quality) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    const error = new Error("Groq API key is missing");
    error.code = "MISSING_KEY";
    throw error;
  }

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const error = new Error(`Groq API error: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function generateGroqJSON(prompt, model = GROQ_MODELS.quality) {
  const text = await generateGroqText(prompt, model);
  try {
    return parseJsonFromResponse(text);
  } catch {
    const error = new Error("Failed to parse AI response");
    error.code = "PARSE_ERROR";
    throw error;
  }
}

export function getGroqErrorMessage(error, fallback = "Something went wrong. Try again.") {
  if (error?.code === "MISSING_KEY") return "Groq API key is missing. Add VITE_GROQ_API_KEY to client/.env";
  if (error?.status === 429) return "Rate limit reached. Wait a minute and try again.";
  if (error?.code === "PARSE_ERROR") return "AI returned an invalid response. Please try again.";
  return fallback;
}
