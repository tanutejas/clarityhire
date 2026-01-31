import { useState } from "react";
import "./App.css";

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= ANALYZE ================= */

  async function analyze() {
    if (!resume || !jd) {
      alert("Paste resume + JD first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("API error");
      console.error(err);
    }

    setLoading(false);
  }

  /* ================= FILE UPLOAD ================= */

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text(); // simple + guaranteed working
    setResume(text);
  }

  const scores = result?.scores || {};

  return (
    <div className="page">

      <div className="card">

        <h1>ClarityHire</h1>
        <p className="sub">AI Resume Analyzer</p>

        <label className="upload">
          Upload Resume (.txt)
          <input type="file" accept=".txt" hidden onChange={handleFile}/>
        </label>

        <textarea
          placeholder="Paste resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <textarea
          placeholder="Paste job description"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        <button onClick={analyze}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {result && (
        <div className="dashboard">

          <div
            className="ring"
            style={{
              background: `conic-gradient(#6ea8ff ${scores.overall}%, rgba(255,255,255,.08) ${scores.overall}%)`
            }}
          >
            {scores.overall}%
          </div>

          <Section title="Suggestions" items={result.suggestions} />
          <Section title="Interview Questions" items={result.interviewQuestions} />

        </div>
      )}

    </div>
  );
}

/* small helper */
function Section({ title, items = [] }) {
  return (
    <div className="glass">
      <h3>{title}</h3>
      {items.length === 0 && <p className="muted">None</p>}
      <ul>
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}