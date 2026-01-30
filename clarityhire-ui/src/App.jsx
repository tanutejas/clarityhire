import { useState } from "react";
import "./App.css";

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("https://clarityhire-pearl.vercel.app/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd }),
      });

      const data = await res.json();

      if (!data.scores) {
        throw new Error(JSON.stringify(data));
      }

      setResult(data);

    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }

  // 🔥 SAFE VALUES
  const score = result?.scores?.overall ?? 0;
  const skills = result?.scores?.skills ?? 0;
  const experience = result?.scores?.experience ?? 0;
  const keywords = result?.scores?.keywords ?? 0;
  const seniority = result?.scores?.seniority ?? 0;
  const education = result?.scores?.education ?? 0;

  return (
    <div className="app">
      <div className="card">

        <h1>ClarityHire</h1>

        <textarea
          placeholder="Paste Resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <textarea
          placeholder="Paste Job Description"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        <button onClick={analyze}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {error && (
          <div style={{color:"red", marginTop:20}}>
            {error}
          </div>
        )}

        {result && (
          <div className="output">

            <h2>Overall Score: {score}%</h2>

            <Bar label="Skills" value={skills} />
            <Bar label="Experience" value={experience} />
            <Bar label="Keywords" value={keywords} />
            <Bar label="Seniority" value={seniority} />
            <Bar label="Education" value={education} />

            <p style={{marginTop:20}}>
              {result.hireRecommendation}
            </p>

            <p>{result.explanation}</p>

          </div>
        )}

      </div>
    </div>
  );
}

function Bar({ label, value }) {
  return (
    <div style={{margin:"10px 0"}}>
      <div>{label}</div>
      <div style={{background:"#333", height:8, borderRadius:6}}>
        <div
          style={{
            width: value + "%",
            height:"100%",
            background:"linear-gradient(90deg,#6cf,#8a5cff)"
          }}
        />
      </div>
    </div>
  );
}