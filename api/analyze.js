import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { resume, jd } = req.body;

  const prompt = `
You are an ATS system.
Compare the resume with the job description.
Return JSON with:
match (0-100),
strengths,
gaps,
suggestions.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: `RESUME:\n${resume}\n\nJD:\n${jd}` }
    ]
  });

  res.status(200).json(JSON.parse(completion.choices[0].message.content));
}