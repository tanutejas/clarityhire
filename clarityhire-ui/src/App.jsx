import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    setResult(null);

    const res = await fetch("https://clarityhire-pearl.vercel.app/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jd }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  const score = result?.scores?.overall ?? 0;

  return (
    <div className="app">

      <div className="card">

        <h1>ClarityHire</h1>
        <p className="subtitle">AI Resume Intelligence</p>

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
          <motion.div
            className="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >

            {/* BIG APPLE RING */}
            <ScoreRing score={score} />

            {/* BARS */}
            <Bar label="Skills" value={result.scores.skills} />
            <Bar label="Experience" value={result.scores.experience} />
            <Bar label="Keywords" value={result.scores.keywords} />
            <Bar label="Seniority" value={result.scores.seniority} />
            <Bar label="Education" value={result.scores.education} />

            <div className="verdict">
              <h3>{result.hireRecommendation}</h3>
              <p>{result.explanation}</p>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}



/* =======================
   Components
======================= */

function ScoreRing({ score }) {

  let color = "#ef4444";
  if (score >= 75) color = "#22c55e";
  else if (score >= 50) color = "#f59e0b";

  return (
    <div className="ringWrap">

      <motion.div
        className="ring"
        style={{
          background: `conic-gradient(${color} ${score}%, #222 ${score}%)`
        }}
        initial={{ rotate: -90 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 1 }}
      >
        <span>{score}%</span>
      </motion.div>

      <p className="ringLabel">Overall Match</p>
    </div>
  );
}



function Bar({ label, value }) {
  return (
    <div className="barRow">

      <div className="barLabel">
        {label}
        <span>{value}%</span>
      </div>

      <div className="barBg">
        <motion.div
          className="barFill"
          initial={{ width: 0 }}
          animate={{ width: value + "%" }}
          transition={{ duration: 0.8 }}
        />
      </div>

    </div>
  );
}