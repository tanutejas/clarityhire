import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);

    const res = await fetch("https://clarityhire-pearl.vercel.app/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jd })
    });

    const data = await res.json();
    setResult(data);

    setTimeout(() => setLoading(false), 1000);
  }

  const scores = result?.scores || {};

  return (
    <div className="page">

      {loading && <LoadingOverlay />}

      {/* INPUT CARD */}
      <div className="card">

        <h1>Resume Copilot</h1>
        <p className="sub">Upload or paste your resume</p>

        <textarea
          placeholder="Paste resume here"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <textarea
          placeholder="Paste job description"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        <button onClick={analyze}>Analyze Resume</button>
      </div>


      {/* RESULTS */}
      {result && (
        <div className="dashboard">

          <ScoreRing value={scores.overall || 0} />

          <Glass title="Suggestions">
            <List items={result.suggestions} />
          </Glass>

          <Glass title="Interview Questions">
            <List items={result.interviewQuestions} />
          </Glass>

          <RewriteSection bullets={result.improvedBullets} />

        </div>
      )}

    </div>
  );
}


/* ================= COMPONENTS ================= */

function ScoreRing({ value }) {
  return (
    <div
      className="ring"
      style={{
        background: `conic-gradient(#6ea8ff ${value}%, rgba(255,255,255,.08) ${value}%)`
      }}
    >
      {value}%
    </div>
  );
}

function Glass({ title, children }) {
  return (
    <div className="glass">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function List({ items = [] }) {
  return (
    <ul>
      {items?.map((i, idx) => <li key={idx}>{i}</li>)}
    </ul>
  );
}


/* ===== 🔥 BULLET REWRITE SECTION ===== */

function RewriteSection({ bullets = [] }) {

  if (!bullets?.length) return null;

  return (
    <div className="glass rewrite">

      <h3>AI Resume Improvements</h3>

      {bullets.map((b, i) => (
        <div key={i} className="rewriteRow">

          <div className="before">
            ❌ {b.before}
          </div>

          <div className="after">
            ✅ {b.after}
          </div>

        </div>
      ))}

    </div>
  );
}


/* ===== LOADING ===== */

function LoadingOverlay() {
  return (
    <div className="loadingOverlay">
      <div className="loadingCard">Analyzing your resume…</div>
    </div>
  );
}