import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [shortlisted, setShortlisted] = useState(false);

  async function analyze() {
    setLoading(true);
    setResult(null);
    setShortlisted(false);

    const res = await fetch("https://clarityhire-pearl.vercel.app/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jd }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  /* score animation */
  useEffect(() => {
    if (!result) return;

    const target = result?.scores?.overall ?? 0;
    let i = 0;

    const timer = setInterval(() => {
      i += 2;
      if (i >= target) {
        i = target;
        clearInterval(timer);
      }
      setScore(i);
    }, 15);

    return () => clearInterval(timer);
  }, [result]);

  const scores = result?.scores || {};

  /* simple resume parsing for profile */
  const name = resume.split("\n")[0] || "Candidate";
  const yearsMatch = resume.match(/(\d+)\s*years?/i);
  const years = yearsMatch ? yearsMatch[1] : "—";

  const skills =
    resume
      .match(/skills[\s\S]*?\n/i)?.[0]
      ?.replace(/skills/i, "")
      ?.split(",")
      ?.slice(0, 4)
      ?.join(", ") || "Not detected";

  const verdict = result?.hireRecommendation || "—";
  const suggestions =
    result?.missingCriticalSkills?.map(
      (s) => `Add or highlight ${s} experience`
    ) || [];

  return (
    <div className="app">
      <div className="card">

        <h1>ClarityHire</h1>
        <p className="subtitle">AI Hiring Copilot</p>

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

        {result && (
          <div className="dashboard">

            {/* PROFILE */}
            <div className="profileCard">
              <h3>{name}</h3>
              <p>{years} years experience</p>
              <p className="muted">{skills}</p>
            </div>

            {/* VERDICT */}
            <div className={`verdict ${verdict.toLowerCase().replace(" ", "")}`}>
              {verdict}
            </div>

            {/* RING */}
            <div
              className="ring"
              style={{
                background: `conic-gradient(#4f46e5 ${score}%, rgba(255,255,255,0.08) ${score}%)`
              }}
            >
              {score}%
            </div>

            {/* BARS */}
            <Bar label="Skills" value={scores.skills} />
            <Bar label="Experience" value={scores.experience} />
            <Bar label="Keywords" value={scores.keywords} />
            <Bar label="Seniority" value={scores.seniority} />
            <Bar label="Education" value={scores.education} />

            {/* SHORTLIST */}
            <button
              className={`shortlistBtn ${shortlisted ? "active" : ""}`}
              onClick={() => setShortlisted(true)}
            >
              ⭐ {shortlisted ? "Shortlisted" : "Add to Shortlist"}
            </button>

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
              <div className="section">
                <h4>Suggestions to Improve Match</h4>
                <ul>
                  {suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

function Bar({ label, value = 0 }) {
  return (
    <div className="barRow">
      <div className="barLabel">
        {label}
        <span>{value}%</span>
      </div>
      <div className="barBg">
        <div className="barFill" style={{ width: value + "%" }} />
      </div>
    </div>
  );
}