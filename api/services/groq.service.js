const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_MODELS = {
  fast: "openai/gpt-oss-20b",
  quality: "openai/gpt-oss-120b",
};

export async function generateGroqText(prompt, model = GROQ_MODELS.quality) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const error = new Error("Groq API key is not configured on the server");
    error.statusCode = 500;
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
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const error = new Error(errData?.error?.message || `Groq API error: ${res.status}`);
    error.statusCode = res.status;
    throw error;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export function parseJsonFromResponse(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] || text).trim();
  return JSON.parse(raw);
}

export async function generateGroqJSON(prompt, model = GROQ_MODELS.quality) {
  const text = await generateGroqText(prompt, model);
  try {
    return parseJsonFromResponse(text);
  } catch (parseErr) {
    // Fallback: try to find the first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    }
    const error = new Error("Failed to parse structured JSON from AI response");
    error.statusCode = 502;
    throw error;
  }
}

// ── Specialized AI Methods ──
export async function generateInterviewQuestion(topic, difficulty) {
  const prompt = `You are a technical interviewer. Generate ONE clear interview question for ${topic} at ${difficulty} difficulty.
Rules: single sentence, practical, no preamble, no numbering, no quotation marks.
Return only the question text.`;
  const text = await generateGroqText(prompt, GROQ_MODELS.fast);
  return text.replace(/^["']|["']$/g, "").trim();
}

export async function analyzeInterviewAnswer(question, answer) {
  const prompt = `You are an expert interview coach. Evaluate this candidate's verbal answer.
Question: ${question}
Answer: ${answer}

Respond with ONLY valid JSON in this exact shape:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentence constructive feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}`;
  return await generateGroqJSON(prompt, GROQ_MODELS.quality);
}

export async function analyzeResume(resumeText) {
  const prompt = `You are an ATS (Applicant Tracking System) resume auditor. Thoroughly analyze this resume text:

Resume:
${resumeText.slice(0, 6000)}

Respond with ONLY valid JSON in this exact shape:
{
  "summary": "<3-4 sentence professional summary of candidate>",
  "atsScore": <number 0-100>,
  "sectionScores": {
    "education": <0-10>,
    "experience": <0-10>,
    "skills": <0-10>,
    "formatting": <0-10>
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<actionable fix 1>", "<actionable fix 2>", "<actionable fix 3>"],
  "missingKeywords": ["<missing keyword 1>", "<missing keyword 2>", "<missing keyword 3>"],
  "roadmap": [
    { "title": "<milestone 1>", "content": "<actionable advice>" },
    { "title": "<milestone 2>", "content": "<actionable advice>" },
    { "title": "<milestone 3>", "content": "<actionable advice>" },
    { "title": "<milestone 4>", "content": "<actionable advice>" }
  ]
}`;
  return await generateGroqJSON(prompt, GROQ_MODELS.quality);
}

export async function calculateJobMatch(resumeText, skillsRequired, jobTitle) {
  const prompt = `You are an AI recruitment matchmaker. Compare the candidate's resume against the target role requirements:

Job Title: ${jobTitle}
Skills Required: ${skillsRequired}
Candidate Resume Snippet:
${resumeText.slice(0, 4000)}

Respond with ONLY valid JSON in this exact shape:
{
  "matchScore": <number 0-100>,
  "matchingSkills": ["<skill 1>", "<skill 2>"],
  "missingSkills": ["<missing skill 1>", "<missing skill 2>"],
  "verdict": "<1-2 sentence assessment of fit>"
}`;
  return await generateGroqJSON(prompt, GROQ_MODELS.quality);
}

export async function expandJobDescription(jobTitle, companyName, rawPoints) {
  const prompt = `You are a professional HR specialist. Expand these rough notes/bullet points into a compelling, polished job description.

Job Title: ${jobTitle}
Company: ${companyName}
Raw Points:
${rawPoints}

Respond with ONLY valid JSON in this exact shape:
{
  "summary": "<2-3 sentence engaging role overview>",
  "responsibilities": ["<bullet 1>", "<bullet 2>", "<bullet 3>", "<bullet 4>"],
  "requirements": ["<requirement 1>", "<requirement 2>", "<requirement 3>"],
  "benefits": ["<perk 1>", "<perk 2>", "<perk 3>"],
  "fullDescription": "<complete formatted multi-paragraph description>"
}`;
  return await generateGroqJSON(prompt, GROQ_MODELS.quality);
}
