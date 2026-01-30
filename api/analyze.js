export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resume, jd } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are an ATS engine used by Fortune 500 companies. Be strict. Output ONLY valid JSON.",
          },
          {
            role: "user",
            content: `
Analyze the resume against the JD using these rules:

STRICT RULES:
- Be harsh
- Missing core skills = heavy penalty
- Scores must be defensible

SCORING RULES:
- Skills Match: % of required skills present
- Experience Match:
  - 0 if <50% required years
  - Linear scaling otherwise
- Keyword Coverage:
  - Exact + semantic matches only
- Seniority Fit penalty
- Education only if required

RETURN STRICT JSON:

{
  "scores": {
    "skills": number,
    "experience": number,
    "keywords": number,
    "seniority": number,
    "education": number,
    "overall": number
  },
  "missingCriticalSkills": string[],
  "riskFlags": string[],
  "hireRecommendation": "Strong Yes | Maybe | No",
  "explanation": string
}

Resume:
${resume}

JD:
${jd}
            `,
          },
        ],
      }),
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
