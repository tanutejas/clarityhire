module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resume, jd } = req.body;

  try {
    /* ===============================
       PROMPT — EXTRACTION ONLY
       (NOT scoring)
    =============================== */

    const prompt = `
You are a resume parser.

Return ONLY valid JSON.

Extract:

{
  "requiredSkills": string[],
  "candidateSkills": string[],
  "yearsRequired": number,
  "yearsCandidate": number,
  "educationMatch": boolean,
  "missingCriticalSkills": string[],
  "suggestions": string[]
}

Resume:
${resume}

Job Description:
${jd}
`;

    /* ===============================
       CALL OPENAI (JSON MODE)
    =============================== */

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",

          // ⭐ CRITICAL → forces pure JSON
          response_format: { type: "json_object" },

          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.1
        }),
      }
    );

    const data = await response.json();

    const ai = JSON.parse(data.choices[0].message.content);

    /* ===============================
       DETERMINISTIC SCORING (YOU CONTROL)
    =============================== */

    const required = ai.requiredSkills || [];
    const candidate = ai.candidateSkills || [];

    const matched = candidate.filter(s =>
      required.some(r =>
        r.toLowerCase().includes(s.toLowerCase())
      )
    );

    const skillsScore = required.length
      ? Math.round((matched.length / required.length) * 100)
      : 0;

    const expScore =
      ai.yearsRequired > 0
        ? Math.min(
            Math.round(
              (ai.yearsCandidate / ai.yearsRequired) * 100
            ),
            100
          )
        : 100;

    const educationScore = ai.educationMatch ? 100 : 40;

    const overall = Math.round(
      skillsScore * 0.6 +
      expScore * 0.3 +
      educationScore * 0.1
    );

    /* ===============================
       VERDICT
    =============================== */

    let hireRecommendation = "No";

    if (overall >= 80) hireRecommendation = "Strong Yes";
    else if (overall >= 55) hireRecommendation = "Maybe";

    /* ===============================
       FINAL RESPONSE
    =============================== */

    res.status(200).json({
      scores: {
        skills: skillsScore,
        experience: expScore,
        keywords: skillsScore,
        seniority: expScore,
        education: educationScore,
        overall
      },
      hireRecommendation,
      missingCriticalSkills: ai.missingCriticalSkills || [],
      suggestions: ai.suggestions || [],
      explanation: `${matched.length}/${required.length} skills matched`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};