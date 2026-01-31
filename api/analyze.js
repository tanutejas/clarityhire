const https = require("https");

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { resume, jd } = req.body;

  const prompt = `
You are an ATS resume scoring engine.

Return ONLY VALID JSON.
No markdown. No explanation.

Format EXACTLY:

{
  "scores": { "overall": number },
  "suggestions": ["string"],
  "interviewQuestions": ["string"]
}

Resume:
${resume}

Job Description:
${jd}
`;

  try {

    const body = JSON.stringify({
      model: "gpt-4o-mini",
      input: prompt
    });

    const options = {
      hostname: "api.openai.com",
      path: "/v1/responses",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Length": Buffer.byteLength(body)
      }
    };

    const openaiResponse = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let data = "";

        response.on("data", chunk => data += chunk);
        response.on("end", () => resolve(data));
      });

      request.on("error", reject);
      request.write(body);
      request.end();
    });

    const parsed = JSON.parse(openaiResponse);

    const text = parsed.output[0].content[0].text;

    res.status(200).json(JSON.parse(text));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};