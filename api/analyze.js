export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resume, jd } = req.body;

  if (!resume || !jd) {
    return res.status(400).json({ error: "Missing resume or JD" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an ATS resume analyzer. Return scores and improvement suggestions in JSON.",
          },
          {
            role: "user",
            content: `
Resume:
${resume}

Job Description:
${jd}

Give output strictly in this JSON format:
{
  "overallScore": number,
  "skillsMatch": number,
  "experienceMatch": number,
  "missingSkills": [],
  "suggestions": []
}
`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}