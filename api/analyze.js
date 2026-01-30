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

    const prompt = `
You are an ATS resume scoring engine.

STRICTLY RETURN JSON ONLY.
NO TEXT.
NO EXPLANATION OUTSIDE JSON.

Format MUST be:

{
  "scores": {
    "skills": number,
    "experience": number,
    "keywords": number,
    "seniority": number,
    "education": number,
    "overall": number
  },
  "hireRecommendation": "Strong Yes | Maybe | No",
  "explanation": "short reason"
}

Score harshly.

Resume:
${resume}

JD:
${jd}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    const parsed = JSON.parse(data.choices[0].message.content);

    res.status(200).json(parsed);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};