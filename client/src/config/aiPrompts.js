export function interviewQuestionPrompt(topic, difficulty) {
  return `You are a technical interviewer. Generate ONE clear interview question for ${topic} at ${difficulty} difficulty.
Rules: single sentence, practical, no preamble, no numbering.
Return only the question text.`;
}

export function interviewAnalyzePrompt(question, answer) {
  return `You are an expert interview coach. Evaluate this answer.

Question: ${question}
Answer: ${answer}

Respond with ONLY valid JSON in this exact shape:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentence overall feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}`;
}

export function resumeFullAnalysisPrompt(resumeText) {
  return `You are an ATS resume expert. Analyze this resume text thoroughly.

Resume:
${resumeText}

Respond with ONLY valid JSON in this exact shape:
{
  "summary": "<3-4 sentence professional summary of the candidate>",
  "atsScore": <number 0-100>,
  "sectionScores": {
    "education": <0-10>,
    "experience": <0-10>,
    "skills": <0-10>,
    "formatting": <0-10>
  },
  "strengths": ["<strength>", "<strength>", "<strength>"],
  "improvements": ["<actionable fix>", "<actionable fix>", "<actionable fix>"],
  "missingKeywords": ["<keyword>", "<keyword>", "<keyword>"],
  "roadmap": [
    { "title": "<short title>", "content": "<1-2 sentence advice>" },
    { "title": "<short title>", "content": "<1-2 sentence advice>" },
    { "title": "<short title>", "content": "<1-2 sentence advice>" },
    { "title": "<short title>", "content": "<1-2 sentence advice>" }
  ]
}`;
}
