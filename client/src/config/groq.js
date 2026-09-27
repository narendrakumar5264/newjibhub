// ── Server-delegated AI Client (Secret Keys Protected on Server) ──

export const GROQ_MODELS = {
  fast: "openai/gpt-oss-20b",
  quality: "openai/gpt-oss-120b",
};

export function truncateText(text, max = 6000) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max)}\n...[truncated for length]`;
}

export function parseJsonFromResponse(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] || text).trim();
  return JSON.parse(raw);
}

// ── Secure Server-Side Endpoints ──

export async function fetchAiQuestion(topic, difficulty = "Medium") {
  const res = await fetch("/api/ai/interview/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, difficulty }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Server error: ${res.status}`);
  }
  return data.question;
}

export async function analyzeAiAnswer(question, answer) {
  const res = await fetch("/api/ai/interview/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Server error: ${res.status}`);
  }
  return data;
}

export async function analyzeAiResume(resumeText) {
  const res = await fetch("/api/ai/resume/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Server error: ${res.status}`);
  }
  return data;
}

export async function calculateAiMatch(resumeText, skillsRequired, jobTitle) {
  const res = await fetch("/api/ai/match-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, skillsRequired, jobTitle }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Server error: ${res.status}`);
  }
  return data;
}

export async function expandAiDescription(jobTitle, companyName, rawPoints) {
  const res = await fetch("/api/ai/listing/expand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobTitle, companyName, rawPoints }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Server error: ${res.status}`);
  }
  return data;
}

// ── Backwards-Compatible Proxies for existing components ──

export async function generateGroqText(prompt, model = GROQ_MODELS.quality) {
  // If this is an interview question prompt
  const topicMatch = prompt.match(/for\s+(.*?)\s+at\s+(.*?)\s+difficulty/i);
  if (topicMatch) {
    return await fetchAiQuestion(topicMatch[1].trim(), topicMatch[2].trim());
  }

  // Fallback to direct call only if VITE_GROQ_API_KEY is present
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("No server route matched and client Groq key is absent");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function generateGroqJSON(prompt, model = GROQ_MODELS.quality) {
  // Check if it's an interview answer evaluation
  if (prompt.includes("You are an expert interview coach")) {
    const qMatch = prompt.match(/Question:\s*([\s\S]*?)\nAnswer:\s*([\s\S]*?)\n\nRespond/i);
    if (qMatch) {
      return await analyzeAiAnswer(qMatch[1].trim(), qMatch[2].trim());
    }
  }

  // Check if it's a resume full analysis
  if (prompt.includes("You are an ATS resume expert")) {
    const resumeMatch = prompt.match(/Resume:\s*([\s\S]*?)\n\nRespond/i);
    if (resumeMatch) {
      return await analyzeAiResume(resumeMatch[1].trim());
    }
  }

  // Fallback to text + parse
  const text = await generateGroqText(prompt, model);
  return parseJsonFromResponse(text);
}

export function getGroqErrorMessage(error, fallback = "Something went wrong. Try again.") {
  if (error?.message) return error.message;
  return fallback;
}
